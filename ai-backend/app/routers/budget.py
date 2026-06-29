import json
import uuid
import logging
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db
from app.models.session import ChatSession
from app.models.message import ChatMessage
from app.schemas.chat import ChatRequest, SessionHistoryResponse, ChatMessageItem
from app.schemas.budget import (
    BudgetChatResponse, BudgetUpdateRequest, BudgetUpdateResponse, BudgetSchema,
    BudgetItemUpdateRequest, BudgetItemUpdateResponse,
)
from app.prompts.budget import SYSTEM_PROMPT, UPDATE_PROMPT_TEMPLATE
from app.services.gemini import collect_chat_stream_async, generate_structured_json_async, stream_chat_sse
from app.services.currency import convert_currency, CurrencyServiceError

logger = logging.getLogger("app.routers.budget")

router = APIRouter(prefix="/budget", tags=["Budget Tool"])


_ITEM_AMOUNT_MAX = 500_000
_MONTHLY_TOTAL_WARN = 50_000


async def _apply_display_currency(budget_data: dict, display_currency: Optional[str]) -> dict:
    """
    Converts every line_item amount to display_currency and sets display_amount.
    Also sets budget-level display totals.
    Mutates budget_data in-place and returns it.
    """
    if not display_currency:
        return budget_data

    dc = display_currency.strip().upper()
    src_currency = budget_data.get("currency_code", "")
    conversion_error = False

    one_time_display = 0.0
    monthly_display = 0.0

    for cat in budget_data.get("categories", []):
        for item in cat.get("line_items", []):
            amt = float(item.get("amount") or 0.0)
            try:
                converted = await convert_currency(amt, src_currency, dc)
                item["display_amount"] = converted if converted is not None else None
                if converted is not None:
                    freq = item.get("frequency")
                    if freq == "one_time":
                        one_time_display += converted
                    elif freq == "monthly":
                        monthly_display += converted
            except CurrencyServiceError as e:
                logger.warning(f"Display currency conversion failed for item '{item.get('item_id')}': {e}")
                item["display_amount"] = None
                conversion_error = True

    budget_data["display_currency"] = dc
    budget_data["display_conversion_error"] = conversion_error
    if not conversion_error:
        budget_data["display_total_one_time"] = round(one_time_display, 2)
        budget_data["display_total_monthly"] = round(monthly_display, 2)
        buffer_base = budget_data.get("total_one_time_costs", 0)
        try:
            buf = await convert_currency(buffer_base, src_currency, dc)
            budget_data["display_buffer_fund"] = round(buf, 2) if buf is not None else None
        except CurrencyServiceError:
            budget_data["display_buffer_fund"] = None

    return budget_data


def _validate_budget_figures(budget_data: dict) -> None:
    """Clamps negative amounts and logs warnings for suspicious figures."""
    categories = budget_data.get("categories", [])
    for cat in categories:
        cat_name = cat.get("category_name", "unknown")
        for item in cat.get("line_items", []):
            amt = float(item.get("amount") or 0.0)
            label = item.get("label", "unknown")
            if amt < 0:
                logger.warning(
                    f"Budget item '{label}' in '{cat_name}' has negative amount {amt}; clamping to 0."
                )
                item["amount"] = 0.0
            elif amt > _ITEM_AMOUNT_MAX:
                logger.warning(
                    f"Budget item '{label}' in '{cat_name}' has suspicious amount {amt} "
                    f"(exceeds {_ITEM_AMOUNT_MAX:,})."
                )
    monthly_total = budget_data.get("total_monthly_ongoing_costs", 0)
    if monthly_total > _MONTHLY_TOTAL_WARN:
        logger.warning(
            f"Monthly budget total {monthly_total:,.2f} exceeds plausible threshold "
            f"({_MONTHLY_TOTAL_WARN:,})."
        )


def recalculate_budget_totals(budget_data: dict) -> dict:
    """
    Recalculates category totals, total_one_time_costs, total_monthly_ongoing_costs,
    and buffer_fund_amount (15% of total one-time costs, rounded to nearest integer)
    in the backend to ensure mathematical consistency.
    """
    one_time_sum = 0.0
    monthly_sum = 0.0

    categories = budget_data.get("categories", [])
    for cat in categories:
        cat_total = 0.0
        line_items = cat.get("line_items", [])
        for item in line_items:
            amt = float(item.get("amount") or 0.0)
            freq = item.get("frequency")
            cat_total += amt
            if freq == "one_time":
                one_time_sum += amt
            elif freq == "monthly":
                monthly_sum += amt
        cat["category_total"] = round(cat_total, 2)

    budget_data["total_one_time_costs"] = round(one_time_sum, 2)
    budget_data["total_monthly_ongoing_costs"] = round(monthly_sum, 2)
    budget_data["buffer_fund_amount"] = float(round(one_time_sum * 0.15))
    return budget_data


@router.post("/chat", response_model=BudgetChatResponse)
async def budget_chat(
    request_body: ChatRequest,
    db: AsyncSession = Depends(get_db),
    request: Request = None,
    display_currency: Optional[str] = Query(None, description="ISO 4217 code to convert budget amounts for display (e.g. GBP)."),
):
    """
    Handles conversational interactions for qualifying the user's needs and building their budget.
    """
    # 1. Feature mismatch validation
    if request_body.feature != "budget":
        raise HTTPException(status_code=400, detail="Feature mismatch. This endpoint is for budget only.")

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
        if session.feature != "budget":
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
    if stage not in ["collecting", "complete"]:
        raise HTTPException(status_code=502, detail="The AI service returned an invalid conversation stage.")

    budget_payload = None
    if stage == "collecting":
        msg_text = parsed_response.get("message")
        if not msg_text or not isinstance(msg_text, str) or not msg_text.strip():
            raise HTTPException(status_code=502, detail="The AI service returned an empty or invalid message.")
    elif stage == "complete":
        budget_payload = parsed_response.get("budget")
        if not budget_payload or not isinstance(budget_payload, dict):
            raise HTTPException(status_code=502, detail="The AI service returned an invalid or empty budget object.")
        
        # Validate structure against schema by attempting to instantiate BudgetSchema
        try:
            # Recalculate totals first
            budget_payload = recalculate_budget_totals(budget_payload)
            _validate_budget_figures(budget_payload)
            # Schema validate
            BudgetSchema(**budget_payload)
        except Exception as e:
            logger.error(f"Budget validation failed: {e}. Payload: {budget_payload}")
            raise HTTPException(status_code=502, detail="The AI service returned an invalid budget structure.")

        if display_currency:
            if len(display_currency) != 3 or not display_currency.isalpha():
                raise HTTPException(status_code=400, detail="display_currency must be a 3-letter ISO 4217 currency code.")
            budget_payload = await _apply_display_currency(budget_payload, display_currency)

    # 8. Transactionally create/update session and save message pair in a single block
    try:
        if not session_id:
            # Create new session atomically
            session = ChatSession(feature="budget")
            db.add(session)
            await db.flush()  # Populates session.id
            session_id = session.id
        else:
            # Update updated_at
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

    return BudgetChatResponse(
        session_id=session_id,
        stage=stage,
        message=parsed_response.get("message") if stage == "collecting" else None,
        budget=budget_payload,
        stream=False
    )


@router.post("/update", response_model=BudgetUpdateResponse)
async def budget_update(
    request_body: BudgetUpdateRequest,
    db: AsyncSession = Depends(get_db),
    display_currency: Optional[str] = Query(None, description="ISO 4217 code to convert budget amounts for display."),
):
    """
    Handles user instructions to update an already generated budget.
    """
    session_id = request_body.session_id

    # 1. Validate session
    stmt = select(ChatSession).where(ChatSession.id == session_id)
    res = await db.execute(stmt)
    session = res.scalars().first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")
    if session.feature != "budget":
        raise HTTPException(status_code=400, detail="Session belongs to a different feature.")

    # 2. Instruction validation
    if not request_body.instruction or not request_body.instruction.strip():
        raise HTTPException(status_code=400, detail="Instruction cannot be empty.")
    if len(request_body.instruction) > 1000:
        raise HTTPException(status_code=400, detail="Instruction exceeds maximum length of 1000 characters.")

    # 3. Call Gemini (without search grounding)
    system_prompt = "You are a relocation budget specialist for MyFutureAbroad. Modify the budget JSON based on the user's instruction."
    user_prompt = UPDATE_PROMPT_TEMPLATE.format(
        current_budget=request_body.current_budget.model_dump_json(),
        instruction=request_body.instruction
    )

    try:
        raw_response = await generate_structured_json_async(system_prompt, user_prompt, enable_search_grounding=False)
    except Exception as e:
        logger.error(f"Gemini budget update failed: {e}")
        raise e

    # 4. Schema validation and recalculations
    try:
        # Recalculate totals
        recalculated_budget = recalculate_budget_totals(raw_response)
        _validate_budget_figures(recalculated_budget)
        # Validate structure against BudgetSchema
        validated_budget = BudgetSchema(**recalculated_budget)
    except Exception as e:
        logger.error(f"Updated budget validation failed: {e}. Payload: {raw_response}")
        raise HTTPException(status_code=502, detail="The AI service returned an invalid budget structure.")

    # 4b. Apply display currency conversion if requested
    if display_currency:
        if len(display_currency) != 3 or not display_currency.isalpha():
            raise HTTPException(status_code=400, detail="display_currency must be a 3-letter ISO 4217 currency code.")
        budget_dict = validated_budget.model_dump()
        budget_dict = await _apply_display_currency(budget_dict, display_currency)
        validated_budget = BudgetSchema(**budget_dict)

    # 5. Persist instruction and modified budget inside database transaction
    try:
        user_msg = ChatMessage(
            session_id=session_id,
            role="user",
            content=request_body.instruction
        )
        assistant_msg = ChatMessage(
            session_id=session_id,
            role="assistant",
            content=validated_budget.model_dump_json()
        )
        db.add(user_msg)
        db.add(assistant_msg)

        session = await db.merge(session)
        session.updated_at = datetime.now(timezone.utc)
        db.add(session)

        await db.commit()
    except Exception as e:
        await db.rollback()
        logger.error(f"Failed to save budget update transaction: {e}")
        raise HTTPException(status_code=500, detail="Failed to save conversation. Please try again.")

    return BudgetUpdateResponse(
        session_id=session_id,
        budget=validated_budget
    )


@router.post("/update-item", response_model=BudgetItemUpdateResponse)
async def budget_update_item(
    request_body: BudgetItemUpdateRequest,
    db: AsyncSession = Depends(get_db),
    display_currency: Optional[str] = Query(None, description="ISO 4217 code to convert budget amounts for display."),
):
    """
    Directly edits a single budget line item (label, amount, notes) without calling Gemini.
    Recalculates all category totals and overall totals after the edit.
    """
    session_id = request_body.session_id

    # 1. Validate session
    stmt = select(ChatSession).where(ChatSession.id == session_id)
    res = await db.execute(stmt)
    session = res.scalars().first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")
    if session.feature != "budget":
        raise HTTPException(status_code=400, detail="Session belongs to a different feature.")

    # 2. Find the most recent assistant message containing a complete budget
    stmt = (
        select(ChatMessage)
        .where(ChatMessage.session_id == session_id, ChatMessage.role == "assistant")
        .order_by(ChatMessage.created_at.desc())
    )
    res = await db.execute(stmt)
    assistant_messages = res.scalars().all()

    budget_data = None
    for msg in assistant_messages:
        try:
            content = json.loads(msg.content)
            if not isinstance(content, dict):
                continue
            if "destination_country" in content and "categories" in content:
                # Direct budget object (stored by /update or /update-item)
                budget_data = content
                break
            if content.get("stage") == "complete" and isinstance(content.get("budget"), dict):
                # Stage envelope stored by /chat
                budget_data = content["budget"]
                break
        except (json.JSONDecodeError, AttributeError):
            continue

    if budget_data is None:
        raise HTTPException(status_code=404, detail="No complete budget found for this session.")

    # 3. Locate item by item_id and apply edits
    item_found = False
    for cat in budget_data.get("categories", []):
        for item in cat.get("line_items", []):
            if item.get("item_id") == request_body.item_id:
                if request_body.label is not None:
                    item["label"] = request_body.label.strip()
                if request_body.amount is not None:
                    item["amount"] = request_body.amount
                if request_body.notes is not None:
                    item["notes"] = request_body.notes or None
                item_found = True
                break
        if item_found:
            break

    if not item_found:
        raise HTTPException(status_code=404, detail=f"Item '{request_body.item_id}' not found in budget.")

    # 4. Recalculate totals and validate
    budget_data = recalculate_budget_totals(budget_data)
    _validate_budget_figures(budget_data)
    try:
        validated = BudgetSchema(**budget_data)
    except Exception as exc:
        logger.error(f"Budget schema validation failed after item edit: {exc}")
        raise HTTPException(status_code=500, detail="Budget structure invalid after edit.")

    # 4b. Apply display currency conversion if requested
    if display_currency:
        if len(display_currency) != 3 or not display_currency.isalpha():
            raise HTTPException(status_code=400, detail="display_currency must be a 3-letter ISO 4217 currency code.")
        budget_data = await _apply_display_currency(budget_data, display_currency)
        try:
            validated = BudgetSchema(**budget_data)
        except Exception as exc:
            logger.error(f"Budget schema validation failed after display currency conversion: {exc}")
            raise HTTPException(status_code=500, detail="Budget structure invalid after display conversion.")

    # 5. Persist edit as a new message pair (no Gemini call)
    try:
        db.add(ChatMessage(
            session_id=session_id,
            role="user",
            content=f"[manual edit] item_id={request_body.item_id}",
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
        logger.error(f"Failed to save budget item edit: {exc}")
        raise HTTPException(status_code=500, detail="Failed to save changes. Please try again.")

    return BudgetItemUpdateResponse(
        session_id=session_id,
        item_id=request_body.item_id,
        budget=validated,
    )


@router.post("/stream")
async def budget_stream(
    request_body: ChatRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    SSE streaming endpoint for the Budget chatbot.
    Yields text chunks then a final structured event with the budget or next question.
    """
    if request_body.feature != "budget":
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
        if session.feature != "budget":
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
        budget_payload = None
        if stage == "complete" and isinstance(parsed.get("budget"), dict):
            budget_payload = recalculate_budget_totals(parsed["budget"])
            _validate_budget_figures(budget_payload)
            parsed["budget"] = budget_payload

        try:
            nonlocal session, session_id
            if not session_id:
                session = ChatSession(feature="budget")
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
            logger.error(f"Failed to save SSE budget conversation: {exc}")

        final_payload = {"type": "final", "session_id": str(session_id), "stage": stage}
        if stage == "collecting":
            final_payload["message"] = parsed.get("message")
        else:
            final_payload["budget"] = budget_payload
        yield f"data: {json.dumps(final_payload)}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.get("/session/{session_id}", response_model=SessionHistoryResponse)
async def get_session_history(
    session_id: uuid.UUID,
    db: AsyncSession = Depends(get_db)
):
    """
    Returns the message history for a given Budget session.
    """
    stmt = select(ChatSession).where(ChatSession.id == session_id)
    res = await db.execute(stmt)
    session = res.scalars().first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")
    if session.feature != "budget":
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
