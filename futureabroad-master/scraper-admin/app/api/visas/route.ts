import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function GET() {
  const sb = createAdminClient();
  const { data, error } = await sb
    .from("visas")
    .select("*, countries(name)")
    .order("name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const sb = createAdminClient();
  const body = await req.json();
  const { data, error } = await sb.from("visas").insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
