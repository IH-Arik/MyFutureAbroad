import express from "express";
import OpenAI from "openai";
import { supabase as adminSupabase } from "../config.js";
import { createMcpContext, McpContext, TOOLS, mcpToolsToOpenAI } from "../mcp/mcpServer.js";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function ms(start: number) {
  return `${(performance.now() - start).toFixed(0)}ms`;
}

const SYSTEM_PROMPT = `You are a helpful assistant for MyFutureAbroad — a platform that helps people plan their life abroad.

You have access to real-time tools that let you look up visa information, services, countries, and manage the user's personal checklists and budgets.

Guidelines:
- Be concise and helpful. Format responses with markdown where appropriate.
- When a user asks about visas or countries, always use the tools to get accurate, up-to-date information.
- When the user asks you to create, update, or modify anything (checklists, budgets, items), do it immediately using the tools — do not propose, draft, or ask for confirmation first. Just act and confirm afterwards.
- When creating a budget: call create_budget with the name AND all known expenses in the items array in a single call — never put expense data in notes. Use create_budget_item only when adding a single extra item to an existing budget afterwards.
- When adding expenses to an existing budget: use update_budget with the items array to append multiple at once, rather than making separate create_budget_item calls.
- When creating a checklist: call create_checklist with the name AND all known items in the items array in a single call. Use create_checklist_item only when adding a single extra item afterwards.
- When adding items to an existing checklist: use update_checklist with the items array rather than making separate create_checklist_item calls.
- If a tool call fails, explain what went wrong and suggest alternatives.
- Never make up visa requirements, fees, or processing times — always use the tools.
- Never reference visas, services, countries, checklist items, or budgets by their internal numeric or UUID IDs in your text responses. Always refer to them by their human-readable name (e.g. "D7 Visa" not "visa #56", "My Portugal Checklist" not "checklist abc-123"). IDs only appear inside structured code blocks (visa-cards, visa-detail), never in prose.

Service cards format:
- Whenever you return, list, or compare services, you MUST output them as a fenced code block tagged \`service-cards\` containing a JSON array. Place this block after any introductory sentence, and put any prose comparison or takeaways after the block.
- Limit to 6 services per block. If more exist, mention the total and offer to filter.
- Each object must have (omit field if null/unknown): id (string), title (string), service_type (string), price_usd (number), currency (string, ISO 4217), price_type (string), delivery_days (number), provider (string).
- Example:
\`\`\`service-cards
[{"id":"abc","title":"Portugal Visa Application","service_type":"visa_application","price_usd":1500,"currency":"EUR","price_type":"fixed","delivery_days":45,"provider":"Global Visa Solutions"}]
\`\`\`

Visa listing format:
- Whenever you return a list of 2 or more visas, you MUST output them as a fenced code block tagged \`visa-cards\` containing a JSON array. Place this block after any introductory text.
- Limit visa-cards to a maximum of 5 visas per response. If there are more, mention how many total were found and offer to filter further.
- Each object in the array must have these fields (omit the field entirely if unknown/null): id (number), name (string), visa_type (string), country (string), processing_time_days (number), validity_months (number), application_fee_usd (number), renewable (boolean).
- Example:
\`\`\`visa-cards
[{"id":56,"name":"D7 Visa","visa_type":"Family","country":"Portugal","processing_time_days":45,"validity_months":24,"application_fee_usd":150,"renewable":true}]
\`\`\`
- After the block you may add a short follow-up sentence offering more details.

Visa detail format:
- When a user asks about a SPECIFIC single visa (e.g. "tell me about the D7 visa" or "what are the requirements for visa X"), output a \`visa-detail\` fenced code block containing a single JSON object with ALL available fields. Place it after a brief intro sentence.
- Fields (use null if unknown): id (number), name (string), visa_type (string|null), country (string|null), description (string|null), processing_time_days (number|null), validity_months (number|null), application_fee_usd (number|null), renewable (boolean|null), min_age (number|null), max_age (number|null), min_income (number|null), min_income_currency (string|null), requires_health_insurance (boolean|null), requires_clean_criminal_record (boolean|null), has_path_to_residency (boolean|null), path_to_residency_description (string|null), benefits (string[]|null), official_link (string|null).
- Example:
\`\`\`visa-detail
{"id":56,"name":"D7 Visa (Portugal)","visa_type":"Family","country":"Portugal","description":"Long-stay visa for passive income earners.","processing_time_days":45,"validity_months":24,"application_fee_usd":150,"renewable":false,"min_income":760,"min_income_currency":"EUR","requires_health_insurance":true,"requires_clean_criminal_record":true,"has_path_to_residency":true,"path_to_residency_description":"Apply for residency permit after arrival","benefits":["Path to residency","Family reunification"],"official_link":"https://vistos.mne.gov.pt"}
\`\`\`
- After the block add 1-2 sentences with practical tips or a follow-up offer.

Checklist link format:
- After successfully creating OR updating a checklist (via create_checklist or update_checklist), you MUST output a \`checklist-link\` fenced code block so the user can navigate to it. Place it at the end of your response.
- The block must contain a single JSON object with: id (string, the checklist UUID), name (string), items_created (number).
- Example:
\`\`\`checklist-link
{"id":"uuid-here","name":"USA Move Checklist","items_created":14}
\`\`\`

Budget link format:
- After successfully creating OR updating a budget (via create_budget or update_budget_item), you MUST output a \`budget-link\` fenced code block so the user can navigate to it. Place it at the end of your response.
- The block must contain a single JSON object with: id (string, the budget UUID), name (string).
- Example:
\`\`\`budget-link
{"id":"uuid-here","name":"Portugal Move – Porto"}
\`\`\`

Budget summary format:
- Whenever you summarise one or more budgets (e.g. "summarise my budgets", "show my budgets", "what are my budgets"), you MUST output each budget as a \`budget-summary\` fenced code block instead of listing it in plain text. Output one block per budget.
- Each block contains a single JSON object with: id (string), name (string), total_amount (number|null), items (array of {name, cost, category|null}).
- Compute the sum of all item costs and include it as monthly_total (number).
- Example:
\`\`\`budget-summary
{"id":"uuid-here","name":"Portugal Move – Porto","total_amount":null,"monthly_total":1915,"items":[{"name":"Rent","cost":900,"category":"Housing"},{"name":"Groceries","cost":280,"category":"Food"}]}
\`\`\`
`;

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/chat/message  — streaming SSE response
// Body: { sessionId?: string, message: string }
// Headers: x-user-id, x-user-token
//
// SSE event shapes:
//   { t: "chunk", c: "text" }   — text delta from the LLM
//   { t: "tool",  n: "name"  }  — MCP tool is being called
//   { t: "done",  sid: "..." }  — finished; sid is the active session id
//   { t: "error", m: "..."   }  — something went wrong
// ─────────────────────────────────────────────────────────────────────────────
router.post("/message", async (req, res) => {
  const requestStart = performance.now();

  // ── Sync validation (before SSE mode) ───────────────────────────────────
  const userId = req.headers["x-user-id"] as string;
  const userToken = req.headers["x-user-token"] as string;
  if (!userId || !userToken) return res.status(401).json({ error: "Unauthorised" });

  const { sessionId, message } = req.body as { sessionId?: string; message: string };
  if (!message?.trim()) return res.status(400).json({ error: "message is required" });

  // ── Switch to SSE mode ───────────────────────────────────────────────────
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  function send(data: object) {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }


  let mcpCtx: McpContext | null = null;

  try {
    // ── Resolve or create chat session ────────────────────────────────────
    let activeSessionId = sessionId;
    let t = performance.now();

    if (!activeSessionId) {
      const title = message.length > 60 ? message.slice(0, 57).trimEnd() + "…" : message;
      const { data: newSession, error: sessionErr } = await adminSupabase
        .from("ai_chat_sessions")
        .insert({ user_id: userId, title })
        .select("id")
        .single();
      if (sessionErr) { send({ t: "error", m: "Failed to create chat session" }); return res.end(); }
      activeSessionId = newSession.id;
    } else {
      const { data: existing } = await adminSupabase
        .from("ai_chat_sessions")
        .select("id")
        .eq("id", activeSessionId)
        .eq("user_id", userId)
        .single();
      if (!existing) { send({ t: "error", m: "Session not found" }); return res.end(); }
    }

    // ── Load history + save user message + init MCP — all in parallel ─────
    t = performance.now();
    const [historyResult, , ctx] = await Promise.all([
      adminSupabase
        .from("ai_chat_messages")
        .select("role, content, tool_calls")
        .eq("session_id", activeSessionId)
        .order("created_at"),
      adminSupabase.from("ai_chat_messages").insert({
        session_id: activeSessionId,
        role: "user",
        content: message,
      }),
      createMcpContext(userToken, userId),
    ]);
    mcpCtx = ctx;
    const openaiTools = mcpToolsToOpenAI(TOOLS);

    const priorMessages: OpenAI.ChatCompletionMessageParam[] = (historyResult.data ?? []).map((row) => {
      if (row.role === "assistant" && row.tool_calls) {
        return {
          role: "assistant",
          content: row.content || null,
          tool_calls: row.tool_calls as OpenAI.ChatCompletionMessageToolCall[],
        } as OpenAI.ChatCompletionAssistantMessageParam;
      }
      if (row.role === "tool") {
        return {
          role: "tool",
          content: row.content,
          tool_call_id: (row.tool_calls as any)?.[0]?.id ?? "unknown",
        } as OpenAI.ChatCompletionToolMessageParam;
      }
      return { role: row.role as "user" | "assistant", content: row.content };
    });

    const messages: OpenAI.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...priorMessages,
      { role: "user", content: message },
    ];

    // ── Background DB write helpers ───────────────────────────────────────
    const pendingWrites: Promise<unknown>[] = [];
    function bgWrite(p: PromiseLike<unknown>, label: string) {
      const settled = Promise.resolve(p);
      settled.catch((err) => console.error(`[chat] bg write failed (${label}):`, err));
      pendingWrites.push(settled);
    }

    // ── Streaming agentic loop ────────────────────────────────────────────
    let llmRound = 0;
    let continueLoop = true;
    let finalContent = "";

    while (continueLoop) {
      llmRound++;
      t = performance.now();

      const stream = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages,
        tools: openaiTools,
        tool_choice: "auto",
        stream: true,
      });

      let roundContent = "";
      // Accumulate streamed tool call fragments by index
      const tcAccum: Record<number, { id: string; name: string; arguments: string }> = {};
      let finishReason = "";

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta;
        const finish = chunk.choices[0]?.finish_reason;

        if (delta?.content) {
          roundContent += delta.content;
          send({ t: "chunk", c: delta.content });
        }

        if (delta?.tool_calls) {
          for (const tc of delta.tool_calls) {
            const idx = tc.index;
            if (!tcAccum[idx]) tcAccum[idx] = { id: "", name: "", arguments: "" };
            if (tc.id) tcAccum[idx].id = tc.id;
            if (tc.function?.name) tcAccum[idx].name += tc.function.name;
            if (tc.function?.arguments) tcAccum[idx].arguments += tc.function.arguments;
          }
        }

        if (finish) finishReason = finish;
      }


      if (finishReason === "tool_calls") {
        const toolCalls = Object.entries(tcAccum)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([, tc]) => ({
            id: tc.id,
            type: "function" as const,
            function: { name: tc.name, arguments: tc.arguments },
          }));

        bgWrite(
          adminSupabase.from("ai_chat_messages").insert({
            session_id: activeSessionId,
            role: "assistant",
            content: roundContent || "",
            tool_calls: toolCalls,
          }),
          "assistant msg"
        );

        messages.push({ role: "assistant", content: roundContent || null, tool_calls: toolCalls });

        for (const toolCall of toolCalls) {
          const toolName = toolCall.function.name;
          let toolArgs: Record<string, unknown> | undefined;
          try {
            toolArgs = JSON.parse(toolCall.function.arguments || "{}") as Record<string, unknown>;
          } catch (parseErr) {
            console.error(`[chat] Failed to parse arguments for tool ${toolName}:`, parseErr);
            send({ t: "tool", n: toolName });
            const errorMsg = `Tool '${toolName}' had invalid arguments: ${(parseErr as Error).message}`;
            bgWrite(
              adminSupabase.from("ai_chat_messages").insert({
                session_id: activeSessionId,
                role: "tool",
                content: errorMsg,
                tool_calls: [{ id: toolCall.id }],
              }),
              "tool error"
            );
            messages.push({ role: "tool", tool_call_id: toolCall.id, content: errorMsg });
            continue;
          }

          send({ t: "tool", n: toolName });
          t = performance.now();

          let toolResultText: string;
          try {
            const mcpResult = await mcpCtx.client.callTool({ name: toolName, arguments: toolArgs });
            toolResultText =
              (mcpResult.content as { type: string; text: string }[]).find((c) => c.type === "text")?.text ?? "{}";
          } catch (toolErr) {
            console.error(`[chat] Tool execution failed for ${toolName}:`, toolErr);
            toolResultText = `Error executing '${toolName}': ${(toolErr as Error).message}`;
          }

          bgWrite(
            adminSupabase.from("ai_chat_messages").insert({
              session_id: activeSessionId,
              role: "tool",
              content: toolResultText,
              tool_calls: [{ id: toolCall.id }],
            }),
            "tool result"
          );

          messages.push({ role: "tool", tool_call_id: toolCall.id, content: toolResultText });
        }
      } else {
        finalContent = roundContent;
        continueLoop = false;
      }
    }

    // ── Flush all DB writes in parallel ───────────────────────────────────
    t = performance.now();
    await Promise.all([
      Promise.resolve(adminSupabase.from("ai_chat_messages").insert({
        session_id: activeSessionId,
        role: "assistant",
        content: finalContent,
      })),
      Promise.resolve(adminSupabase
        .from("ai_chat_sessions")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", activeSessionId)),
      ...pendingWrites,
    ]);

    send({ t: "done", sid: activeSessionId });
    res.end();
  } catch (err) {
    console.error(`[chat] ERROR after ${ms(requestStart)}:`, err);
    send({ t: "error", m: (err as Error).message });
    res.end();
  } finally {
    mcpCtx?.cleanup();
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/chat/sessions
// ─────────────────────────────────────────────────────────────────────────────
router.get("/sessions", async (req, res) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) return res.status(401).json({ error: "Unauthorised" });

  const { data, error } = await adminSupabase
    .from("ai_chat_sessions")
    .select("id, title, created_at, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(50);

  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/chat/sessions/:id
// ─────────────────────────────────────────────────────────────────────────────
router.get("/sessions/:id", async (req, res) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) return res.status(401).json({ error: "Unauthorised" });

  const { data: session } = await adminSupabase
    .from("ai_chat_sessions")
    .select("id, title")
    .eq("id", req.params.id)
    .eq("user_id", userId)
    .single();

  if (!session) return res.status(404).json({ error: "Session not found" });

  const { data: messages, error } = await adminSupabase
    .from("ai_chat_messages")
    .select("id, role, content, created_at")
    .eq("session_id", req.params.id)
    .neq("role", "tool")
    .order("created_at");

  if (error) return res.status(500).json({ error: error.message });
  return res.json({ session, messages });
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/chat/budget — Express-to-FastAPI Gateway for Budget Chat
// Body: { sessionId?: string, message: string }
// Headers: x-user-id, x-user-token
// ─────────────────────────────────────────────────────────────────────────────
router.post("/budget", async (req, res) => {
  const userId = req.headers["x-user-id"] as string;
  const userToken = req.headers["x-user-token"] as string;
  if (!userId || !userToken) return res.status(401).json({ error: "Unauthorised" });

  const { sessionId, message } = req.body as { sessionId?: string; message: string };
  if (!message?.trim()) return res.status(400).json({ error: "message is required" });

  try {
    const fastapiUrl = process.env.FASTAPI_BASE_URL || "http://localhost:8000";
    const fastapiRes = await fetch(`${fastapiUrl}/budget/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: sessionId || null,
        message: message,
        feature: "budget",
      }),
    });

    if (!fastapiRes.ok) {
      const errDetail = await fastapiRes.text();
      console.error("[gateway] FastAPI budget/chat error:", errDetail);
      return res.status(fastapiRes.status).json({ error: "Failed to communicate with AI backend service" });
    }

    const data = await fastapiRes.json() as {
      session_id: string;
      stage: "collecting" | "complete";
      message: string | null;
      budget: any | null;
    };

    const targetSessionId = data.session_id;

    // Synchronize the session in Supabase if it doesn't exist yet
    if (!sessionId) {
      const title = message.length > 50 ? message.slice(0, 47) + "..." : message;
      const { error: sessionErr } = await adminSupabase
        .from("ai_chat_sessions")
        .insert({
          id: targetSessionId,
          user_id: userId,
          title: `Budget: ${title}`,
        });
      if (sessionErr) {
        console.error("[gateway] Failed to create sync session in Supabase:", sessionErr);
      }
    } else {
      await adminSupabase
        .from("ai_chat_sessions")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", targetSessionId);
    }

    let finalAssistantMessage = data.message || "";

    // Handle stage "complete" by persisting the generated budget to Supabase
    if (data.stage === "complete" && data.budget) {
      const budgetData = data.budget;

      const { data: newSupabaseBudget, error: budgetErr } = await adminSupabase
        .from("budgets")
        .insert({
          user_id: userId,
          name: `${budgetData.destination_country} Relocation Budget`,
          total_amount: (budgetData.total_one_time_costs || 0) + (budgetData.total_monthly_ongoing_costs || 0),
          notes: `${budgetData.visa_type || "Visa"} Relocation Budget generated by AI.`,
        })
        .select("id")
        .single();

      if (budgetErr) {
        console.error("[gateway] Failed to save generated budget to Supabase:", budgetErr);
        return res.status(500).json({ error: "Failed to save generated budget to Supabase." });
      }

      const newBudgetId = newSupabaseBudget.id;
      const budgetItemsToInsert: any[] = [];
      if (Array.isArray(budgetData.categories)) {
        for (const cat of budgetData.categories) {
          if (Array.isArray(cat.line_items)) {
            for (const item of cat.line_items) {
              budgetItemsToInsert.push({
                budget_id: newBudgetId,
                name: item.label,
                cost: item.amount,
                category: cat.category_name,
                currency: budgetData.currency_code || "USD",
                status: false,
              });
            }
          }
        }
      }

      if (budgetItemsToInsert.length > 0) {
        const { error: itemsErr } = await adminSupabase
          .from("budget_items")
          .insert(budgetItemsToInsert);
        if (itemsErr) {
          console.error("[gateway] Failed to save budget items to Supabase:", itemsErr);
        }
      }

      finalAssistantMessage = `I have successfully analyzed your details and generated a personalized relocation budget for **${budgetData.destination_country}**!

Here is the link to access your budget:
\`\`\`budget-link
{"id": "${newBudgetId}", "name": "${budgetData.destination_country} Relocation Budget"}
\`\`\``;
    }

    const messagesToInsert = [
      {
        session_id: targetSessionId,
        role: "user",
        content: message,
      },
      {
        session_id: targetSessionId,
        role: "assistant",
        content: finalAssistantMessage,
      }
    ];

    const { error: msgErr } = await adminSupabase
      .from("ai_chat_messages")
      .insert(messagesToInsert);

    if (msgErr) {
      console.error("[gateway] Failed to save chat messages in Supabase:", msgErr);
    }

    return res.json({
      sessionId: targetSessionId,
      stage: data.stage,
      message: finalAssistantMessage,
      budget: data.budget,
    });

  } catch (err) {
    console.error("[gateway] Express budget chat handler error:", err);
    return res.status(500).json({ error: (err as Error).message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/chat/checklist — Express-to-FastAPI Gateway for Checklist Chat
// Body: { sessionId?: string, message: string }
// Headers: x-user-id, x-user-token
// ─────────────────────────────────────────────────────────────────────────────
router.post("/checklist", async (req, res) => {
  const userId = req.headers["x-user-id"] as string;
  const userToken = req.headers["x-user-token"] as string;
  if (!userId || !userToken) return res.status(401).json({ error: "Unauthorised" });

  const { sessionId, message } = req.body as { sessionId?: string; message: string };
  if (!message?.trim()) return res.status(400).json({ error: "message is required" });

  try {
    const fastapiUrl = process.env.FASTAPI_BASE_URL || "http://localhost:8000";
    const fastapiRes = await fetch(`${fastapiUrl}/checklist/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: sessionId || null,
        message: message,
        feature: "checklist",
      }),
    });

    if (!fastapiRes.ok) {
      const errDetail = await fastapiRes.text();
      console.error("[gateway] FastAPI checklist/chat error:", errDetail);
      return res.status(fastapiRes.status).json({ error: "Failed to communicate with AI backend service" });
    }

    const data = await fastapiRes.json() as {
      session_id: string;
      stage: "collecting" | "complete";
      message: string | null;
      checklist: any | null;
    };

    const targetSessionId = data.session_id;

    // Synchronize the session in Supabase if it doesn't exist yet
    if (!sessionId) {
      const title = message.length > 50 ? message.slice(0, 47) + "..." : message;
      const { error: sessionErr } = await adminSupabase
        .from("ai_chat_sessions")
        .insert({
          id: targetSessionId,
          user_id: userId,
          title: `Checklist: ${title}`,
        });
      if (sessionErr) {
        console.error("[gateway] Failed to create sync session in Supabase:", sessionErr);
      }
    } else {
      await adminSupabase
        .from("ai_chat_sessions")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", targetSessionId);
    }

    let finalAssistantMessage = data.message || "";

    // Handle stage "complete" by persisting the generated checklist to Supabase
    if (data.stage === "complete" && data.checklist) {
      const checklistData = data.checklist;

      const { data: newSupabaseChecklist, error: checklistErr } = await adminSupabase
        .from("checklists")
        .insert({
          user_id: userId,
          name: `${checklistData.destination_country} Relocation Checklist`,
          notes: `Move date reference: ${checklistData.move_date_reference || "Not specified"}. Checklist generated by AI.`,
        })
        .select("id")
        .single();

      if (checklistErr) {
        console.error("[gateway] Failed to save generated checklist to Supabase:", checklistErr);
        return res.status(500).json({ error: "Failed to save generated checklist to Supabase." });
      }

      const newChecklistId = newSupabaseChecklist.id;
      const checklistItemsToInsert: any[] = [];
      let sortOrder = 0;

      if (Array.isArray(checklistData.phases)) {
        for (const phase of checklistData.phases) {
          if (Array.isArray(phase.items)) {
            for (const item of phase.items) {
              checklistItemsToInsert.push({
                checklist_id: newChecklistId,
                name: `[${phase.phase_label || "Ongoing"}] ${item.title}${item.description ? ` - ${item.description}` : ""}`,
                category: item.category || "general",
                status: false,
                sort_order: sortOrder++,
              });
            }
          }
        }
      }

      if (checklistItemsToInsert.length > 0) {
        const { error: itemsErr } = await adminSupabase
          .from("checklist_items")
          .insert(checklistItemsToInsert);
        if (itemsErr) {
          console.error("[gateway] Failed to save checklist items to Supabase:", itemsErr);
        }
      }

      finalAssistantMessage = `I have successfully analyzed your details and generated a personalized relocation checklist for **${checklistData.destination_country}**!

Here is the link to access your checklist:
\`\`\`checklist-link
{"id": "${newChecklistId}", "name": "${checklistData.destination_country} Relocation Checklist", "items_created": ${checklistItemsToInsert.length}}
\`\`\``;
    }

    const messagesToInsert = [
      {
        session_id: targetSessionId,
        role: "user",
        content: message,
      },
      {
        session_id: targetSessionId,
        role: "assistant",
        content: finalAssistantMessage,
      }
    ];

    const { error: msgErr } = await adminSupabase
      .from("ai_chat_messages")
      .insert(messagesToInsert);

    if (msgErr) {
      console.error("[gateway] Failed to save chat messages in Supabase:", msgErr);
    }

    return res.json({
      sessionId: targetSessionId,
      stage: data.stage,
      message: finalAssistantMessage,
      checklist: data.checklist,
    });

  } catch (err) {
    console.error("[gateway] Express checklist chat handler error:", err);
    return res.status(500).json({ error: (err as Error).message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/chat/visa-finder — Express-to-FastAPI Gateway for Visa Finder Chat
// Body: { sessionId?: string, message: string }
// Headers: x-user-id, x-user-token
// ─────────────────────────────────────────────────────────────────────────────
router.post("/visa-finder", async (req, res) => {
  const userId = req.headers["x-user-id"] as string;
  const userToken = req.headers["x-user-token"] as string;
  if (!userId || !userToken) return res.status(401).json({ error: "Unauthorised" });

  const { sessionId, message } = req.body as { sessionId?: string; message: string };
  if (!message?.trim()) return res.status(400).json({ error: "message is required" });

  try {
    const fastapiUrl = process.env.FASTAPI_BASE_URL || "http://localhost:8000";
    const fastapiRes = await fetch(`${fastapiUrl}/visa-finder/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: sessionId || null,
        message: message,
        feature: "visa_finder",
      }),
    });

    if (!fastapiRes.ok) {
      const errDetail = await fastapiRes.text();
      console.error("[gateway] FastAPI visa-finder/chat error:", errDetail);
      return res.status(fastapiRes.status).json({ error: "Failed to communicate with AI backend service" });
    }

    const data = await fastapiRes.json() as {
      session_id: string;
      stage: "collecting" | "results";
      message: string | null;
      visas: any[] | null;
    };

    const targetSessionId = data.session_id;

    // Synchronize the session in Supabase if it doesn't exist yet
    if (!sessionId) {
      const title = message.length > 50 ? message.slice(0, 47) + "..." : message;
      const { error: sessionErr } = await adminSupabase
        .from("ai_chat_sessions")
        .insert({
          id: targetSessionId,
          user_id: userId,
          title: `VisaFinder: ${title}`,
        });
      if (sessionErr) {
        console.error("[gateway] Failed to create sync session in Supabase:", sessionErr);
      }
    } else {
      await adminSupabase
        .from("ai_chat_sessions")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", targetSessionId);
    }

    let finalAssistantMessage = data.message || "";

    if (data.stage === "results" && Array.isArray(data.visas)) {
      let text = "Based on your details, here are the visas you qualify for:\n\n";
      for (const v of data.visas) {
        text += `- **${v.visa_name}** (${v.country}) - **Match Rating: ${v.match_rating.toUpperCase()}**\n`;
        text += `  *Reasoning*: ${v.match_reasoning}\n`;
        if (v.key_requirements?.length) {
          text += `  *Key Requirements*: ${v.key_requirements.join(", ")}\n`;
        }
        text += `\n`;
      }
      finalAssistantMessage = text;
    }

    const messagesToInsert = [
      {
        session_id: targetSessionId,
        role: "user",
        content: message,
      },
      {
        session_id: targetSessionId,
        role: "assistant",
        content: finalAssistantMessage,
      }
    ];

    const { error: msgErr } = await adminSupabase
      .from("ai_chat_messages")
      .insert(messagesToInsert);

    if (msgErr) {
      console.error("[gateway] Failed to save chat messages in Supabase:", msgErr);
    }

    return res.json({
      sessionId: targetSessionId,
      stage: data.stage,
      message: finalAssistantMessage,
      visas: data.visas,
    });

  } catch (err) {
    console.error("[gateway] Express visa-finder chat handler error:", err);
    return res.status(500).json({ error: (err as Error).message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/chat/chatbot — Express-to-FastAPI Gateway for General Chatbot
// Body: { sessionId?: string, message: string }
// Headers: x-user-id, x-user-token
// ─────────────────────────────────────────────────────────────────────────────
router.post("/chatbot", async (req, res) => {
  const userId = req.headers["x-user-id"] as string;
  const userToken = req.headers["x-user-token"] as string;
  if (!userId || !userToken) return res.status(401).json({ error: "Unauthorised" });

  const { sessionId, message } = req.body as { sessionId?: string; message: string };
  if (!message?.trim()) return res.status(400).json({ error: "message is required" });

  try {
    const fastapiUrl = process.env.FASTAPI_BASE_URL || "http://localhost:8000";
    const fastapiRes = await fetch(`${fastapiUrl}/chatbot/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: sessionId || null,
        message: message,
        feature: "chatbot",
      }),
    });

    if (!fastapiRes.ok) {
      const errDetail = await fastapiRes.text();
      console.error("[gateway] FastAPI chatbot/chat error:", errDetail);
      return res.status(fastapiRes.status).json({ error: "Failed to communicate with AI backend service" });
    }

    const data = await fastapiRes.json() as {
      session_id: string;
      message: string;
      redirect: string | null;
      sources: string[];
      request_id: string;
    };

    const targetSessionId = data.session_id;

    // Synchronize the session in Supabase if it doesn't exist yet
    if (!sessionId) {
      const title = message.length > 50 ? message.slice(0, 47) + "..." : message;
      const { error: sessionErr } = await adminSupabase
        .from("ai_chat_sessions")
        .insert({
          id: targetSessionId,
          user_id: userId,
          title: `Chatbot: ${title}`,
        });
      if (sessionErr) {
        console.error("[gateway] Failed to create sync session in Supabase:", sessionErr);
      }
    } else {
      await adminSupabase
        .from("ai_chat_sessions")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", targetSessionId);
    }

    let finalAssistantMessage = data.message || "";
    if (data.sources && data.sources.length > 0) {
      finalAssistantMessage += "\n\n**Sources:**\n" + data.sources.map((src) => `- [${src}](${src})`).join("\n");
    }
    if (data.redirect) {
      const pageName = data.redirect.replace(/^\//, "").replace(/-/g, " ");
      const formattedPageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
      finalAssistantMessage += `\n\n*Redirecting to: [${formattedPageName}](${data.redirect})*`;
    }

    const messagesToInsert = [
      {
        session_id: targetSessionId,
        role: "user",
        content: message,
      },
      {
        session_id: targetSessionId,
        role: "assistant",
        content: finalAssistantMessage,
      }
    ];

    const { error: msgErr } = await adminSupabase
      .from("ai_chat_messages")
      .insert(messagesToInsert);

    if (msgErr) {
      console.error("[gateway] Failed to save chat messages in Supabase:", msgErr);
    }

    return res.json({
      sessionId: targetSessionId,
      message: finalAssistantMessage,
      redirect: data.redirect,
      sources: data.sources,
    });

  } catch (err) {
    console.error("[gateway] Express chatbot chat handler error:", err);
    return res.status(500).json({ error: (err as Error).message });
  }
});


// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/chat/sessions/:id
// ─────────────────────────────────────────────────────────────────────────────
router.delete("/sessions/:id", async (req, res) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) return res.status(401).json({ error: "Unauthorised" });

  const { error } = await adminSupabase
    .from("ai_chat_sessions")
    .delete()
    .eq("id", req.params.id)
    .eq("user_id", userId);

  if (error) return res.status(500).json({ error: error.message });
  return res.json({ success: true });
});

export default router;

