import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { supabase as adminSupabase } from "../config.js";

// ─────────────────────────────────────────────────────────────────────────────
// Tool definitions
// ─────────────────────────────────────────────────────────────────────────────

const TOOLS = [
  {
    name: "get_countries",
    description: "List all available countries on the platform, with optional search by name.",
    inputSchema: {
      type: "object",
      properties: {
        search: { type: "string", description: "Optional country name filter" },
      },
    },
  },
  {
    name: "get_visas",
    description:
      "List visas available on the platform. Can filter by country name or visa type. Returns key fields like name, type, processing time, fees.",
    inputSchema: {
      type: "object",
      properties: {
        country_name: { type: "string", description: "Filter by country name" },
        visa_type: { type: "string", description: "Filter by visa type" },
        limit: { type: "number", description: "Max results (default 20)" },
      },
    },
  },
  {
    name: "get_visa_details",
    description: "Get full details for a specific visa by its ID.",
    inputSchema: {
      type: "object",
      properties: {
        visa_id: { type: "number", description: "The visa ID" },
      },
      required: ["visa_id"],
    },
  },
  {
    name: "get_services",
    description: "List services offered by providers. Can filter by service type or country.",
    inputSchema: {
      type: "object",
      properties: {
        service_type: { type: "string", description: "Filter by service type" },
        limit: { type: "number", description: "Max results (default 20)" },
      },
    },
  },
  {
    name: "create_checklist",
    description: "Create a new checklist with optional items in one call. Pass all known items in the items array — do NOT put item data in notes.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Checklist name (e.g. 'Portugal Move Checklist')" },
        notes: { type: "string", description: "Short optional description only" },
        items: {
          type: "array",
          description: "Items to create immediately with the checklist",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              category: { type: "string", description: "Optional category label" },
            },
            required: ["name"],
          },
        },
      },
      required: ["name"],
    },
  },
  {
    name: "update_checklist",
    description: "Rename a checklist, update its notes, or append new items. Use notes: \"\" to clear notes.",
    inputSchema: {
      type: "object",
      properties: {
        checklist_id: { type: "string", description: "The checklist UUID" },
        name: { type: "string", description: "New checklist name" },
        notes: { type: "string", description: "New notes (pass empty string to clear)" },
        items: {
          type: "array",
          description: "New items to append to this checklist",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              category: { type: "string" },
            },
            required: ["name"],
          },
        },
      },
      required: ["checklist_id"],
    },
  },
  {
    name: "get_user_checklists",
    description: "Get the current user's checklists. Requires authentication.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_checklist_items",
    description: "Get items for a specific checklist belonging to the current user.",
    inputSchema: {
      type: "object",
      properties: {
        checklist_id: { type: "string", description: "The checklist UUID" },
      },
      required: ["checklist_id"],
    },
  },
  {
    name: "update_checklist_item",
    description:
      "Update the status (done/not done) or name of a checklist item. Only works on the user's own checklists.",
    inputSchema: {
      type: "object",
      properties: {
        item_id: { type: "string", description: "The checklist item UUID" },
        status: { type: "boolean", description: "Set completion status (true = done)" },
        name: { type: "string", description: "Optionally rename the item" },
      },
      required: ["item_id"],
    },
  },
  {
    name: "create_checklist_item",
    description: "Add a new item to one of the user's checklists.",
    inputSchema: {
      type: "object",
      properties: {
        checklist_id: { type: "string", description: "The checklist UUID" },
        name: { type: "string", description: "Item name" },
        category: { type: "string", description: "Optional category label" },
      },
      required: ["checklist_id", "name"],
    },
  },
  {
    name: "create_budget",
    description: "Create a new budget with optional expense items in one call. Pass all known expenses in the items array — do NOT use notes for expense data (notes is a short description only).",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Budget name (e.g. 'Portugal Move – Porto')" },
        total_amount: { type: "number", description: "Optional overall budget cap" },
        notes: { type: "string", description: "Short optional description only — never expense data" },
        items: {
          type: "array",
          description: "Expense items to create immediately with the budget",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              cost: { type: "number" },
              category: { type: "string" },
              currency: { type: "string", description: "ISO code e.g. EUR, USD (default USD)" },
            },
            required: ["name", "cost"],
          },
        },
      },
      required: ["name"],
    },
  },
  {
    name: "update_budget",
    description: "Update a budget's name, notes, or total_amount cap, and optionally add new expense items. Pass items to append new expenses without affecting existing ones. Use notes: \"\" to clear bad notes.",
    inputSchema: {
      type: "object",
      properties: {
        budget_id: { type: "string", description: "The budget UUID" },
        name: { type: "string", description: "New budget name" },
        notes: { type: "string", description: "New notes (pass empty string to clear)" },
        total_amount: { type: "number", description: "New total budget cap (set to 0 to clear)" },
        items: {
          type: "array",
          description: "New expense items to append to this budget",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              cost: { type: "number" },
              category: { type: "string" },
              currency: { type: "string", description: "ISO code e.g. EUR, USD (default USD)" },
            },
            required: ["name", "cost"],
          },
        },
      },
      required: ["budget_id"],
    },
  },
  {
    name: "get_user_budgets",
    description: "Get the current user's budgets. Requires authentication.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_budget_items",
    description: "Get items (expenses) for a specific budget belonging to the current user.",
    inputSchema: {
      type: "object",
      properties: {
        budget_id: { type: "string", description: "The budget UUID" },
      },
      required: ["budget_id"],
    },
  },
  {
    name: "update_budget_item",
    description:
      "Update a budget item's name, cost, category, or paid status. Only works on the user's own budgets.",
    inputSchema: {
      type: "object",
      properties: {
        item_id: { type: "string", description: "The budget item UUID" },
        name: { type: "string", description: "New name for the item" },
        cost: { type: "number", description: "New cost amount" },
        category: { type: "string", description: "New category label" },
        status: { type: "boolean", description: "Mark as paid (true) or unpaid (false)" },
      },
      required: ["item_id"],
    },
  },
  {
    name: "create_budget_item",
    description: "Add a single expense item to a budget. Use the items array on create_budget/update_budget instead when adding multiple at once.",
    inputSchema: {
      type: "object",
      properties: {
        budget_id: { type: "string", description: "The budget UUID" },
        name: { type: "string", description: "Item name" },
        cost: { type: "number", description: "Cost amount" },
        category: { type: "string", description: "Optional category label" },
        currency: { type: "string", description: "ISO currency code e.g. EUR, USD (default USD)" },
      },
      required: ["budget_id", "name", "cost"],
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Tool handlers
// ─────────────────────────────────────────────────────────────────────────────

async function handleTool(
  name: string,
  args: Record<string, unknown>,
  userClient: SupabaseClient,
  userId: string
): Promise<string> {
  try {
    switch (name) {
      // ── Global data ──────────────────────────────────────────────────────
      case "get_countries": {
        let query = adminSupabase
          .from("countries")
          .select("id, name, flag_url")
          .order("name");
        if (args.search) query = query.ilike("name", `%${args.search}%`);
        const { data, error } = await query.limit(50);
        if (error) throw error;
        return JSON.stringify(data);
      }

      case "get_visas": {
        let query = adminSupabase
          .from("visas")
          .select(
            "id, name, visa_type, processing_time_days, validity_months, application_fee_usd, renewable, countries(name)"
          )
          .order("name");
        if (args.visa_type) query = query.eq("visa_type", args.visa_type as string);
        if (args.country_name) {
          const { data: country } = await adminSupabase
            .from("countries")
            .select("id")
            .ilike("name", `%${args.country_name as string}%`)
            .limit(1)
            .single();
          if (!country) return JSON.stringify([]);
          query = query.eq("country_id", country.id);
        }
        const { data, error } = await query.limit((args.limit as number) || 5);
        if (error) throw error;
        // Flatten country join and strip null fields to minimise token count
        const slim = (data as any[]).map((v) => {
          const out: Record<string, unknown> = { id: v.id, name: v.name };
          if (v.countries?.name) out.country = v.countries.name;
          if (v.visa_type != null) out.visa_type = v.visa_type;
          if (v.processing_time_days != null) out.processing_time_days = v.processing_time_days;
          if (v.validity_months != null) out.validity_months = v.validity_months;
          if (v.application_fee_usd != null) out.application_fee_usd = v.application_fee_usd;
          if (v.renewable != null) out.renewable = v.renewable;
          return out;
        });
        return JSON.stringify(slim);
      }

      case "get_visa_details": {
        const { data, error } = await adminSupabase
          .from("visas")
          .select("*, countries(name)")
          .eq("id", args.visa_id as number)
          .single();
        if (error) throw error;
        return JSON.stringify(data);
      }

      case "get_services": {
        let query = adminSupabase
          .from("services")
          .select("id, title, description, service_type, price_usd, currency, price_type, delivery_days, providers(company_name)")
          .eq("active", true)
          .order("title");
        if (args.service_type) query = query.eq("service_type", args.service_type as string);
        const { data, error } = await query.limit((args.limit as number) || 20);
        if (error) throw error;
        return JSON.stringify(data);
      }

      // ── User data (requires authenticated client) ─────────────────────────
      case "create_checklist": {
        const { data: checklist, error: clErr } = await userClient
          .from("checklists")
          .insert({ user_id: userId, name: args.name, notes: args.notes ?? null })
          .select("id, name, notes")
          .single();
        if (clErr) throw clErr;
        const inputItems = (args.items as any[] | undefined) ?? [];
        let insertedItems: any[] = [];
        if (inputItems.length > 0) {
          const { data: items, error: itemsErr } = await userClient
            .from("checklist_items")
            .insert(inputItems.map((item: any) => ({
              checklist_id: checklist.id,
              name: item.name,
              category: item.category ?? null,
              status: false,
            })))
            .select("id, name, category");
          if (itemsErr) throw itemsErr;
          insertedItems = items ?? [];
        }
        return JSON.stringify({ success: true, checklist, items_created: insertedItems.length });
      }

      case "update_checklist": {
        const { data: existing } = await userClient
          .from("checklists")
          .select("id")
          .eq("id", args.checklist_id as string)
          .eq("user_id", userId)
          .single();
        if (!existing) return JSON.stringify({ error: "Checklist not found or not owned by user" });
        const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
        if (args.name !== undefined) updates.name = args.name;
        if (args.notes !== undefined) updates.notes = (args.notes as string).length > 0 ? args.notes : null;
        const { data: checklist, error: clErr } = await userClient
          .from("checklists")
          .update(updates)
          .eq("id", args.checklist_id as string)
          .select("id, name, notes")
          .single();
        if (clErr) throw clErr;
        const inputItems = (args.items as any[] | undefined) ?? [];
        let insertedItems: any[] = [];
        if (inputItems.length > 0) {
          const { data: items, error: itemsErr } = await userClient
            .from("checklist_items")
            .insert(inputItems.map((item: any) => ({
              checklist_id: args.checklist_id,
              name: item.name,
              category: item.category ?? null,
              status: false,
            })))
            .select("id, name, category");
          if (itemsErr) throw itemsErr;
          insertedItems = items ?? [];
        }
        return JSON.stringify({ success: true, checklist, items_created: insertedItems.length });
      }

      case "get_user_checklists": {
        const { data, error } = await userClient
          .from("checklists")
          .select("id, name, notes, created_at, updated_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });
        if (error) throw error;
        return JSON.stringify(data);
      }

      case "get_checklist_items": {
        const { data: cl } = await userClient
          .from("checklists")
          .select("id")
          .eq("id", args.checklist_id as string)
          .eq("user_id", userId)
          .single();
        if (!cl) return JSON.stringify({ error: "Checklist not found or not owned by user" });
        const { data, error } = await userClient
          .from("checklist_items")
          .select("id, name, category, status, created_at")
          .eq("checklist_id", args.checklist_id as string)
          .order("created_at");
        if (error) throw error;
        return JSON.stringify(data);
      }

      case "update_checklist_item": {
        // Verify item ownership: check that item belongs to user's checklist
        const { data: item } = await userClient
          .from("checklist_items")
          .select("checklist_id")
          .eq("id", args.item_id as string)
          .single();

        if (!item) return JSON.stringify({ error: "Checklist item not found" });

        const { data: checklist } = await userClient
          .from("checklists")
          .select("id")
          .eq("id", item.checklist_id)
          .eq("user_id", userId)
          .single();

        if (!checklist) return JSON.stringify({ error: "Item does not belong to your checklist" });

        const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
        if (args.status !== undefined) updates.status = args.status;
        if (args.name) updates.name = args.name;
        const { data, error } = await userClient
          .from("checklist_items")
          .update(updates)
          .eq("id", args.item_id as string)
          .select("id, name, status")
          .single();
        if (error) throw error;
        return JSON.stringify({ success: true, item: data });
      }

      case "create_checklist_item": {
        const { data: cl } = await userClient
          .from("checklists")
          .select("id")
          .eq("id", args.checklist_id as string)
          .eq("user_id", userId)
          .single();
        if (!cl) return JSON.stringify({ error: "Checklist not found or not owned by user" });
        const { data, error } = await userClient
          .from("checklist_items")
          .insert({
            checklist_id: args.checklist_id,
            name: args.name,
            category: args.category || null,
            status: false,
          })
          .select("id, name, category, status")
          .single();
        if (error) throw error;
        return JSON.stringify({ success: true, item: data });
      }

      case "create_budget": {
        const { data: budget, error: budgetErr } = await userClient
          .from("budgets")
          .insert({
            user_id: userId,
            name: args.name,
            total_amount: args.total_amount ?? null,
            notes: args.notes ?? null,
          })
          .select("id, name, total_amount, notes")
          .single();
        if (budgetErr) throw budgetErr;
        const inputItems = (args.items as any[] | undefined) ?? [];
        let insertedItems: any[] = [];
        if (inputItems.length > 0) {
          const { data: items, error: itemsErr } = await userClient
            .from("budget_items")
            .insert(inputItems.map((item: any) => ({
              budget_id: budget.id,
              name: item.name,
              cost: item.cost,
              category: item.category ?? null,
              currency: item.currency ?? "USD",
              status: false,
            })))
            .select("id, name, cost, category, currency");
          if (itemsErr) throw itemsErr;
          insertedItems = items ?? [];
        }
        return JSON.stringify({ success: true, budget, items_created: insertedItems.length });
      }

      case "update_budget": {
        const { data: bud } = await userClient
          .from("budgets")
          .select("id")
          .eq("id", args.budget_id as string)
          .eq("user_id", userId)
          .single();
        if (!bud) return JSON.stringify({ error: "Budget not found or not owned by user" });
        const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
        if (args.name !== undefined) updates.name = args.name;
        if (args.notes !== undefined) updates.notes = (args.notes as string).length > 0 ? args.notes : null;
        if (args.total_amount !== undefined) updates.total_amount = (args.total_amount as number) > 0 ? args.total_amount : null;
        const { data, error } = await userClient
          .from("budgets")
          .update(updates)
          .eq("id", args.budget_id as string)
          .select("id, name, notes, total_amount")
          .single();
        if (error) throw error;
        const inputItems = (args.items as any[] | undefined) ?? [];
        let insertedItems: any[] = [];
        if (inputItems.length > 0) {
          const { data: items, error: itemsErr } = await userClient
            .from("budget_items")
            .insert(inputItems.map((item: any) => ({
              budget_id: args.budget_id,
              name: item.name,
              cost: item.cost,
              category: item.category ?? null,
              currency: item.currency ?? "USD",
              status: false,
            })))
            .select("id, name, cost, category, currency");
          if (itemsErr) throw itemsErr;
          insertedItems = items ?? [];
        }
        return JSON.stringify({ success: true, budget: data, items_created: insertedItems.length });
      }

      case "get_user_budgets": {
        const { data, error } = await userClient
          .from("budgets")
          .select("id, name, total_amount, notes, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });
        if (error) throw error;
        return JSON.stringify(data);
      }

      case "get_budget_items": {
        const { data: bud } = await userClient
          .from("budgets")
          .select("id")
          .eq("id", args.budget_id as string)
          .eq("user_id", userId)
          .single();
        if (!bud) return JSON.stringify({ error: "Budget not found or not owned by user" });
        const { data, error } = await userClient
          .from("budget_items")
          .select("id, name, cost, category, status, created_at")
          .eq("budget_id", args.budget_id as string)
          .order("created_at");
        if (error) throw error;
        return JSON.stringify(data);
      }

      case "update_budget_item": {
        // Verify item ownership: check that item belongs to user's budget
        const { data: item } = await userClient
          .from("budget_items")
          .select("budget_id")
          .eq("id", args.item_id as string)
          .single();

        if (!item) return JSON.stringify({ error: "Budget item not found" });

        const { data: budget } = await userClient
          .from("budgets")
          .select("id")
          .eq("id", item.budget_id)
          .eq("user_id", userId)
          .single();

        if (!budget) return JSON.stringify({ error: "Item does not belong to your budget" });

        const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
        if (args.name !== undefined) updates.name = args.name;
        if (args.cost !== undefined) updates.cost = args.cost;
        if (args.category !== undefined) updates.category = args.category;
        if (args.status !== undefined) updates.status = args.status;
        const { data, error } = await userClient
          .from("budget_items")
          .update(updates)
          .eq("id", args.item_id as string)
          .select("id, name, cost, status")
          .single();
        if (error) throw error;
        return JSON.stringify({ success: true, item: data });
      }

      case "create_budget_item": {
        const { data: bud } = await userClient
          .from("budgets")
          .select("id")
          .eq("id", args.budget_id as string)
          .eq("user_id", userId)
          .single();
        if (!bud) return JSON.stringify({ error: "Budget not found or not owned by user" });
        const { data, error } = await userClient
          .from("budget_items")
          .insert({
            budget_id: args.budget_id,
            name: args.name,
            cost: args.cost,
            category: args.category || null,
            currency: (args.currency as string) || "USD",
            status: false,
          })
          .select("id, name, cost, category, currency, status")
          .single();
        if (error) throw error;
        return JSON.stringify({ success: true, item: data });
      }

      default:
        return JSON.stringify({ error: `Unknown tool: ${name}` });
    }
  } catch (err) {
    return JSON.stringify({ error: (err as Error).message });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Create an in-process MCP server/client pair for a single request
// ─────────────────────────────────────────────────────────────────────────────

export interface McpContext {
  client: Client;
  cleanup: () => void;
}

export async function createMcpContext(
  userToken: string,
  userId: string
): Promise<McpContext> {
  const supabaseUrl =
    process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const userClient = createClient(supabaseUrl, process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "", {
    global: { headers: { Authorization: `Bearer ${userToken}` } },
  });

  const server = new Server(
    { name: "myfutureabroad-mcp", version: "1.0.0" },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOLS,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    const result = await handleTool(
      req.params.name,
      (req.params.arguments ?? {}) as Record<string, unknown>,
      userClient,
      userId
    );
    return {
      content: [{ type: "text" as const, text: result }],
    };
  });

  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);

  const client = new Client(
    { name: "myfutureabroad-chat-client", version: "1.0.0" },
    { capabilities: {} }
  );
  await client.connect(clientTransport);

  return {
    client,
    cleanup: async () => {
      await client.close();
      await server.close();
    },
  };
}

// Convert MCP tool definitions to OpenAI tool format
export function mcpToolsToOpenAI(mcpTools: typeof TOOLS) {
  return mcpTools.map((tool) => ({
    type: "function" as const,
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.inputSchema,
    },
  }));
}

export { TOOLS };
