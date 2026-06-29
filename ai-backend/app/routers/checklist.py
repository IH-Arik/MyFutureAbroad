import json
import re
import uuid
import logging
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db
from app.models.session import ChatSession
from app.models.message import ChatMessage
from app.schemas.chat import ChatRequest, SessionHistoryResponse, ChatMessageItem
from app.schemas.checklist import (
    ChecklistChatResponse, ChecklistUpdateRequest, ChecklistUpdateResponse, ChecklistSchema,
    ChecklistItemStatusRequest, ChecklistItemStatusResponse,
    ChecklistAddItemRequest, ChecklistAddItemResponse, ChecklistDeleteItemRequest,
)
from app.prompts.checklist import SYSTEM_PROMPT, UPDATE_PROMPT_TEMPLATE
from app.services.gemini import collect_chat_stream_async, generate_structured_json_async, stream_chat_sse

logger = logging.getLogger("app.routers.checklist")

router = APIRouter(prefix="/checklist", tags=["Checklist Tool"])


def normalize_checklist_data(data: dict) -> dict:
    """
    Defensively normalizes checklist keys, categories, statuses, and phase IDs
    to match the Pydantic schema literals and prevent 502 validation failures.
    """
    valid_phases = {
        "six_months_before", "three_months_before", "one_month_before", "two_weeks_before",
        "moving_week", "first_month_after", "three_months_after", "six_months_after", "ongoing"
    }
    valid_categories = {
        "documents", "legal", "financial", "property", "logistics", "healthcare", "administrative", "personal"
    }
    valid_statuses = {"not_started", "in_progress", "done"}

    phases = data.get("phases", [])
    if not isinstance(phases, list):
        data["phases"] = []
        return data

    normalized_phases = []
    for phase in phases:
        if not isinstance(phase, dict):
            continue
        phase_id = phase.get("phase_id")
        if phase_id not in valid_phases:
            phase["phase_id"] = "ongoing"
        
        items = phase.get("items", [])
        if not isinstance(items, list):
            phase["items"] = []
            normalized_phases.append(phase)
            continue
        
        normalized_items = []
        for item in items:
            if not isinstance(item, dict):
                continue
            
            category = item.get("category")
            if category not in valid_categories:
                # Map close matching or default to personal
                if category == "education":
                    item["category"] = "personal"
                else:
                    item["category"] = "personal"
            
            status = item.get("status")
            if status not in valid_statuses:
                item["status"] = "not_started"
            
            if "country_specific" not in item:
                item["country_specific"] = False
            else:
                item["country_specific"] = bool(item["country_specific"])
                
            normalized_items.append(item)
            
        phase["items"] = normalized_items
        normalized_phases.append(phase)
        
    data["phases"] = normalized_phases
    return data


@router.post("/chat", response_model=ChecklistChatResponse)
async def checklist_chat(
    request_body: ChatRequest,
    db: AsyncSession = Depends(get_db),
    request: Request = None
):
    """
    Handles conversational interactions for qualifying the user's needs and building their relocation checklist.
    """
    # 1. Feature mismatch validation
    if request_body.feature != "checklist":
        raise HTTPException(status_code=400, detail="Feature mismatch. This endpoint is for checklist only.")

    # 2. Message validations
    if not request_body.message or not request_body.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")
    if len(request_body.message) > 2000:
        raise HTTPException(status_code=400, detail="Message exceeds maximum length of 2000 characters.")

    # 3. Validate existing session if provided
    session = None
    session_id = request_body.session_id
    if session_id:
        stmt = select(ChatSession).where(ChatSession.id == session_id)
        res = await db.execute(stmt)
        session = res.scalars().first()
        if not session:
            raise HTTPException(status_code=404, detail="Session not found.")
        if session.feature != "checklist":
            raise HTTPException(status_code=400, detail="Session belongs to a different feature.")

    # 4. Load session history if session exists
    history = []
    if session_id:
        try:
            stmt = select(ChatMessage).where(ChatMessage.session_id == session_id).order_by(ChatMessage.created_at.asc())
            res = await db.execute(stmt)
            messages_db = res.scalars().all()
            history = [{"role": msg.role, "content": msg.content} for msg in messages_db]
        except Exception as e:
            logger.error(f"Failed to load chat history for session {session_id}: {e}")
            raise HTTPException(status_code=500, detail="Failed to load chat history.")

    # 5. Append new user message to conversation payload
    history.append({"role": "user", "content": request_body.message})

    # 6. Call Gemini (non-blocking — runs in thread pool)
    try:
        response_text = await collect_chat_stream_async(SYSTEM_PROMPT, history, enable_search_grounding=True)
    except Exception as e:
        logger.error(f"Gemini call failed: {e}")
        raise e

    # 7. Parse and validate Gemini JSON response
    cleaned_text = response_text.strip()
    first_brace = cleaned_text.find("{")
    last_brace = cleaned_text.rfind("}")
    if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
        cleaned_text = cleaned_text[first_brace:last_brace + 1]

    try:
        parsed_response = json.loads(cleaned_text)
    except json.JSONDecodeError as e:
        logger.warning(f"Failed to parse Gemini response as JSON, wrapping as collecting stage message. Raw: {response_text}")
        parsed_response = {
            "stage": "collecting",
            "message": response_text.strip()
        }

    stage = parsed_response.get("stage")
    if stage == "collecting":
        msg_text = parsed_response.get("message", "").strip()
        if msg_text.startswith("{") and msg_text.endswith("}"):
            try:
                inner_json = json.loads(msg_text)
                if isinstance(inner_json, dict) and (inner_json.get("stage") == "complete" or "checklist" in inner_json):
                    logger.info("Recovered nested complete checklist response from collecting stage message.")
                    parsed_response = inner_json
                    stage = parsed_response.get("stage", "complete")
            except Exception as pe:
                logger.debug(f"Message started/ended with braces but failed to parse as nested JSON: {pe}")

    if stage not in ["collecting", "complete"]:
        raise HTTPException(status_code=502, detail="The AI service returned an invalid conversation stage.")

    checklist_payload = None
    if stage == "collecting":
        msg_text = parsed_response.get("message")
        if not msg_text or not isinstance(msg_text, str) or not msg_text.strip():
            raise HTTPException(status_code=502, detail="The AI service returned an empty or invalid message.")
    elif stage == "complete":
        checklist_payload = parsed_response.get("checklist")
        if not checklist_payload or not isinstance(checklist_payload, dict):
            raise HTTPException(status_code=502, detail="The AI service returned an invalid or empty checklist object.")
        
        # Normalize checklist structure/literals defensively
        checklist_payload = normalize_checklist_data(checklist_payload)
        
        # Schema validate
        try:
            validated_checklist = ChecklistSchema(**checklist_payload)
        except Exception as e:
            logger.error(f"Checklist validation failed: {e}. Payload: {checklist_payload}")
            raise HTTPException(status_code=502, detail="The AI service returned an invalid checklist structure.")

        # Business rule check: If the phases array is empty or contains no items across all phases, return 502
        total_items = 0
        for phase in validated_checklist.phases:
            total_items += len(phase.items)
        if total_items == 0:
            raise HTTPException(status_code=502, detail="The AI service returned an empty checklist.")

    # 8. Transactionally create/update session and save message pair in a single block
    try:
        if not session_id:
            session = ChatSession(feature="checklist")
            db.add(session)
            await db.flush()  # Populates session.id
            session_id = session.id
        else:
            session = await db.merge(session)
            session.updated_at = datetime.now(timezone.utc)
            db.add(session)

        user_msg = ChatMessage(
            session_id=session_id,
            role="user",
            content=request_body.message
        )
        assistant_msg = ChatMessage(
            session_id=session_id,
            role="assistant",
            content=json.dumps(parsed_response)
        )
        db.add(user_msg)
        db.add(assistant_msg)
        
        await db.commit()
    except Exception as e:
        await db.rollback()
        logger.error(f"Failed to save conversation to database: {e}")
        raise HTTPException(status_code=500, detail="Failed to save conversation. Please try again.")

    return ChecklistChatResponse(
        session_id=session_id,
        stage=stage,
        message=parsed_response.get("message") if stage == "collecting" else None,
        checklist=checklist_payload,
        stream=False
    )


@router.post("/update", response_model=ChecklistUpdateResponse)
async def checklist_update(
    request_body: ChecklistUpdateRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Handles user instructions to update an already generated checklist.
    """
    session_id = request_body.session_id

    # 1. Validate session
    stmt = select(ChatSession).where(ChatSession.id == session_id)
    res = await db.execute(stmt)
    session = res.scalars().first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")
    if session.feature != "checklist":
        raise HTTPException(status_code=400, detail="Session belongs to a different feature.")

    # 2. Instruction validation
    if not request_body.instruction or not request_body.instruction.strip():
        raise HTTPException(status_code=400, detail="Instruction cannot be empty.")
    if len(request_body.instruction) > 1000:
        raise HTTPException(status_code=400, detail="Instruction exceeds maximum length of 1000 characters.")

    # 3. Call Gemini (without search grounding)
    system_prompt = "You are a relocation checklist specialist for MyFutureAbroad. Modify the checklist JSON based on the user's instruction."
    user_prompt = UPDATE_PROMPT_TEMPLATE.format(
        current_checklist=request_body.current_checklist.model_dump_json(),
        instruction=request_body.instruction
    )

    try:
        raw_response = await generate_structured_json_async(system_prompt, user_prompt, enable_search_grounding=False)
    except Exception as e:
        logger.error(f"Gemini checklist update failed: {e}")
        raise e

    # 4. Normalize and validate schema
    raw_response = normalize_checklist_data(raw_response)
    try:
        validated_checklist = ChecklistSchema(**raw_response)
    except Exception as e:
        logger.error(f"Updated checklist validation failed: {e}. Payload: {raw_response}")
        raise HTTPException(status_code=502, detail="The AI service returned an invalid checklist structure.")

    # 5. Verify that no existing item_id was changed or modified by Gemini
    # Collect all original item_ids and their titles
    original_item_map = {}
    for phase in request_body.current_checklist.phases:
        for item in phase.items:
            original_item_map[item.title.strip().lower()] = item.item_id

    # Check the updated checklist
    for phase in validated_checklist.phases:
        for item in phase.items:
            title_lower = item.title.strip().lower()
            if title_lower in original_item_map:
                if item.item_id != original_item_map[title_lower]:
                    logger.error(f"Item ID modified. Expected {original_item_map[title_lower]} for '{item.title}', got {item.item_id}")
                    raise HTTPException(status_code=502, detail="The AI service modified an existing checklist item ID.")

    # 6. Persist instruction and modified checklist inside database transaction
    try:
        user_msg = ChatMessage(
            session_id=session_id,
            role="user",
            content=request_body.instruction
        )
        assistant_msg = ChatMessage(
            session_id=session_id,
            role="assistant",
            content=validated_checklist.model_dump_json()
        )
        db.add(user_msg)
        db.add(assistant_msg)

        session = await db.merge(session)
        session.updated_at = datetime.now(timezone.utc)
        db.add(session)

        await db.commit()
    except Exception as e:
        await db.rollback()
        logger.error(f"Failed to save checklist update transaction: {e}")
        raise HTTPException(status_code=500, detail="Failed to save conversation. Please try again.")

    return ChecklistUpdateResponse(
        session_id=session_id,
        checklist=validated_checklist
    )


@router.patch("/item-status", response_model=ChecklistItemStatusResponse)
async def checklist_item_status(
    request_body: ChecklistItemStatusRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Updates the status of a single checklist item (not_started / in_progress / done)
    without calling Gemini. Persists the change as a new message pair.
    """
    session_id = request_body.session_id

    # 1. Validate session
    stmt = select(ChatSession).where(ChatSession.id == session_id)
    res = await db.execute(stmt)
    session = res.scalars().first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")
    if session.feature != "checklist":
        raise HTTPException(status_code=400, detail="Session belongs to a different feature.")

    # 2. Find the most recent assistant message containing a complete checklist
    stmt = (
        select(ChatMessage)
        .where(ChatMessage.session_id == session_id, ChatMessage.role == "assistant")
        .order_by(ChatMessage.created_at.desc())
    )
    res = await db.execute(stmt)
    assistant_messages = res.scalars().all()

    checklist_data = None
    for msg in assistant_messages:
        try:
            content = json.loads(msg.content)
            if not isinstance(content, dict):
                continue
            if "destination_country" in content and "phases" in content:
                # Direct checklist object (stored by /update or /item-status)
                checklist_data = content
                break
            if content.get("stage") == "complete" and isinstance(content.get("checklist"), dict):
                # Stage envelope stored by /chat
                checklist_data = content["checklist"]
                break
        except (json.JSONDecodeError, AttributeError):
            continue

    if checklist_data is None:
        raise HTTPException(status_code=404, detail="No complete checklist found for this session.")

    # 3. Locate item by item_id and update its status
    item_found = False
    for phase in checklist_data.get("phases", []):
        for item in phase.get("items", []):
            if item.get("item_id") == request_body.item_id:
                item["status"] = request_body.status
                item_found = True
                break
        if item_found:
            break

    if not item_found:
        raise HTTPException(status_code=404, detail=f"Item '{request_body.item_id}' not found in checklist.")

    # 4. Normalize and validate
    checklist_data = normalize_checklist_data(checklist_data)
    try:
        validated = ChecklistSchema(**checklist_data)
    except Exception as exc:
        logger.error(f"Checklist schema validation failed after status update: {exc}")
        raise HTTPException(status_code=500, detail="Checklist structure invalid after edit.")

    # 5. Persist as a new message pair (no Gemini call)
    try:
        db.add(ChatMessage(
            session_id=session_id,
            role="user",
            content=f"[status update] item_id={request_body.item_id} status={request_body.status}",
        ))
        db.add(ChatMessage(
            session_id=session_id,
            role="assistant",
            content=validated.model_dump_json(),
        ))
        session = await db.merge(session)
        session.updated_at = datetime.now(timezone.utc)
        db.add(session)
        await db.commit()
    except Exception as exc:
        await db.rollback()
        logger.error(f"Failed to save checklist status update: {exc}")
        raise HTTPException(status_code=500, detail="Failed to save changes. Please try again.")

    return ChecklistItemStatusResponse(
        session_id=session_id,
        item_id=request_body.item_id,
        status=request_body.status,
        checklist=validated,
    )


@router.post("/add-item", response_model=ChecklistAddItemResponse)
async def checklist_add_item(
    request_body: ChecklistAddItemRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Adds a new item to a specific phase of an existing checklist without calling Gemini.
    Generates a unique item_id slug from the title.
    """
    session_id = request_body.session_id

    stmt = select(ChatSession).where(ChatSession.id == session_id)
    res = await db.execute(stmt)
    session = res.scalars().first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")
    if session.feature != "checklist":
        raise HTTPException(status_code=400, detail="Session belongs to a different feature.")

    stmt = (
        select(ChatMessage)
        .where(ChatMessage.session_id == session_id, ChatMessage.role == "assistant")
        .order_by(ChatMessage.created_at.desc())
    )
    res = await db.execute(stmt)
    assistant_messages = res.scalars().all()

    checklist_data = None
    for msg in assistant_messages:
        try:
            content = json.loads(msg.content)
            if not isinstance(content, dict):
                continue
            if "destination_country" in content and "phases" in content:
                checklist_data = content
                break
            if content.get("stage") == "complete" and isinstance(content.get("checklist"), dict):
                checklist_data = content["checklist"]
                break
        except (json.JSONDecodeError, AttributeError):
            continue

    if checklist_data is None:
        raise HTTPException(status_code=404, detail="No complete checklist found for this session.")

    # Generate unique item_id slug
    base_slug = re.sub(r"[^a-z0-9]+", "_", request_body.title.lower().strip()).strip("_")
    short_uid = str(uuid.uuid4()).replace("-", "")[:6]
    new_item_id = f"{base_slug}_{short_uid}"

    # Ensure uniqueness within the checklist
    existing_ids = {
        item.get("item_id")
        for phase in checklist_data.get("phases", [])
        for item in phase.get("items", [])
    }
    if new_item_id in existing_ids:
        new_item_id = f"{base_slug}_{str(uuid.uuid4()).replace('-', '')[:8]}"

    new_item = {
        "item_id": new_item_id,
        "title": request_body.title.strip(),
        "description": request_body.description.strip(),
        "status": "not_started",
        "category": request_body.category,
        "country_specific": request_body.country_specific,
        "notes": request_body.notes or None,
    }

    # Find the target phase and append
    phase_found = False
    for phase in checklist_data.get("phases", []):
        if phase.get("phase_id") == request_body.phase_id:
            phase.setdefault("items", []).append(new_item)
            phase_found = True
            break

    if not phase_found:
        # Phase doesn't exist yet — create it with a sensible label
        label_map = {
            "six_months_before": "6 Months Before",
            "three_months_before": "3 Months Before",
            "one_month_before": "1 Month Before",
            "two_weeks_before": "2 Weeks Before",
            "moving_week": "Moving Week",
            "first_month_after": "First Month After",
            "three_months_after": "3 Months After",
            "six_months_after": "6 Months After",
            "ongoing": "Ongoing",
        }
        checklist_data.setdefault("phases", []).append({
            "phase_id": request_body.phase_id,
            "phase_label": label_map.get(request_body.phase_id, request_body.phase_id.replace("_", " ").title()),
            "items": [new_item],
        })

    checklist_data = normalize_checklist_data(checklist_data)
    try:
        validated = ChecklistSchema(**checklist_data)
    except Exception as exc:
        logger.error(f"Checklist validation failed after add-item: {exc}")
        raise HTTPException(status_code=500, detail="Checklist structure invalid after adding item.")

    try:
        db.add(ChatMessage(session_id=session_id, role="user", content=f"[add item] {new_item_id}"))
        db.add(ChatMessage(session_id=session_id, role="assistant", content=validated.model_dump_json()))
        session = await db.merge(session)
        session.updated_at = datetime.now(timezone.utc)
        db.add(session)
        await db.commit()
    except Exception as exc:
        await db.rollback()
        logger.error(f"Failed to save add-item change: {exc}")
        raise HTTPException(status_code=500, detail="Failed to save changes. Please try again.")

    return ChecklistAddItemResponse(session_id=session_id, item_id=new_item_id, checklist=validated)


@router.post("/delete-item", response_model=ChecklistItemStatusResponse)
async def checklist_delete_item(
    request_body: ChecklistDeleteItemRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Removes an item from the checklist by item_id without calling Gemini.
    Uses POST (not DELETE) so the session_id and item_id can be passed in the request body.
    """
    session_id = request_body.session_id

    stmt = select(ChatSession).where(ChatSession.id == session_id)
    res = await db.execute(stmt)
    session = res.scalars().first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")
    if session.feature != "checklist":
        raise HTTPException(status_code=400, detail="Session belongs to a different feature.")

    stmt = (
        select(ChatMessage)
        .where(ChatMessage.session_id == session_id, ChatMessage.role == "assistant")
        .order_by(ChatMessage.created_at.desc())
    )
    res = await db.execute(stmt)
    assistant_messages = res.scalars().all()

    checklist_data = None
    for msg in assistant_messages:
        try:
            content = json.loads(msg.content)
            if not isinstance(content, dict):
                continue
            if "destination_country" in content and "phases" in content:
                checklist_data = content
                break
            if content.get("stage") == "complete" and isinstance(content.get("checklist"), dict):
                checklist_data = content["checklist"]
                break
        except (json.JSONDecodeError, AttributeError):
            continue

    if checklist_data is None:
        raise HTTPException(status_code=404, detail="No complete checklist found for this session.")

    item_found = False
    for phase in checklist_data.get("phases", []):
        items = phase.get("items", [])
        new_items = [i for i in items if i.get("item_id") != request_body.item_id]
        if len(new_items) < len(items):
            phase["items"] = new_items
            item_found = True
            break

    if not item_found:
        raise HTTPException(status_code=404, detail=f"Item '{request_body.item_id}' not found in checklist.")

    checklist_data = normalize_checklist_data(checklist_data)
    try:
        validated = ChecklistSchema(**checklist_data)
    except Exception as exc:
        logger.error(f"Checklist validation failed after delete-item: {exc}")
        raise HTTPException(status_code=500, detail="Checklist structure invalid after deleting item.")

    try:
        db.add(ChatMessage(session_id=session_id, role="user", content=f"[delete item] {request_body.item_id}"))
        db.add(ChatMessage(session_id=session_id, role="assistant", content=validated.model_dump_json()))
        session = await db.merge(session)
        session.updated_at = datetime.now(timezone.utc)
        db.add(session)
        await db.commit()
    except Exception as exc:
        await db.rollback()
        logger.error(f"Failed to save delete-item change: {exc}")
        raise HTTPException(status_code=500, detail="Failed to save changes. Please try again.")

    return ChecklistItemStatusResponse(
        session_id=session_id,
        item_id=request_body.item_id,
        status="deleted",
        checklist=validated,
    )


@router.post("/stream")
async def checklist_stream(
    request_body: ChatRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    SSE streaming endpoint for the Checklist chatbot.
    Yields text chunks then a final structured event with the checklist or next question.
    """
    if request_body.feature != "checklist":
        raise HTTPException(status_code=400, detail="Feature mismatch.")
    if not request_body.message or not request_body.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")
    if len(request_body.message) > 2000:
        raise HTTPException(status_code=400, detail="Message exceeds maximum length of 2000 characters.")

    session = None
    session_id = request_body.session_id
    if session_id:
        res = await db.execute(select(ChatSession).where(ChatSession.id == session_id))
        session = res.scalars().first()
        if not session:
            raise HTTPException(status_code=404, detail="Session not found.")
        if session.feature != "checklist":
            raise HTTPException(status_code=400, detail="Session belongs to a different feature.")

    history = []
    if session_id:
        res = await db.execute(
            select(ChatMessage).where(ChatMessage.session_id == session_id).order_by(ChatMessage.created_at.asc())
        )
        history = [{"role": m.role, "content": m.content} for m in res.scalars().all()]

    history.append({"role": "user", "content": request_body.message})

    async def event_generator():
        accumulated = ""
        try:
            async for chunk in stream_chat_sse(SYSTEM_PROMPT, history, enable_search_grounding=True):
                accumulated += chunk
                yield f"data: {json.dumps({'type': 'chunk', 'text': chunk})}\n\n"
        except Exception as exc:
            yield f"data: {json.dumps({'type': 'error', 'message': str(exc)})}\n\n"
            return

        cleaned = accumulated.strip()
        first_brace = cleaned.find("{")
        last_brace = cleaned.rfind("}")
        if first_brace != -1 and last_brace > first_brace:
            cleaned = cleaned[first_brace:last_brace + 1]
        try:
            parsed = json.loads(cleaned)
        except json.JSONDecodeError:
            parsed = {"stage": "collecting", "message": accumulated.strip()}

        stage = parsed.get("stage", "collecting")
        checklist_payload = None
        if stage == "complete" and isinstance(parsed.get("checklist"), dict):
            checklist_payload = normalize_checklist_data(parsed["checklist"])

        try:
            nonlocal session, session_id
            if not session_id:
                session = ChatSession(feature="checklist")
                db.add(session)
                await db.flush()
                session_id = session.id
            else:
                session = await db.merge(session)
                session.updated_at = datetime.now(timezone.utc)
                db.add(session)
            db.add(ChatMessage(session_id=session_id, role="user", content=request_body.message))
            db.add(ChatMessage(session_id=session_id, role="assistant", content=json.dumps(parsed)))
            await db.commit()
        except Exception as exc:
            await db.rollback()
            logger.error(f"Failed to save SSE checklist conversation: {exc}")

        final_payload = {"type": "final", "session_id": str(session_id), "stage": stage}
        if stage == "collecting":
            final_payload["message"] = parsed.get("message")
        else:
            final_payload["checklist"] = checklist_payload
        yield f"data: {json.dumps(final_payload)}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.get("/session/{session_id}", response_model=SessionHistoryResponse)
async def get_session_history(
    session_id: uuid.UUID,
    db: AsyncSession = Depends(get_db)
):
    """
    Returns the message history for a given Checklist session.
    """
    stmt = select(ChatSession).where(ChatSession.id == session_id)
    res = await db.execute(stmt)
    session = res.scalars().first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")
    if session.feature != "checklist":
        raise HTTPException(status_code=400, detail="Session belongs to a different feature.")
        
    try:
        stmt = select(ChatMessage).where(ChatMessage.session_id == session_id).order_by(ChatMessage.created_at.asc())
        res = await db.execute(stmt)
        messages_db = res.scalars().all()
    except Exception as e:
        logger.error(f"Failed to retrieve chat messages for session {session_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to load chat session history.")
        
    messages = [
        ChatMessageItem(
            id=msg.id,
            role=msg.role,
            content=msg.content,
            created_at=msg.created_at
        ) for msg in messages_db
    ]
    
    return SessionHistoryResponse(
        session_id=session.id,
        feature=session.feature,
        created_at=session.created_at,
        messages=messages
    )
