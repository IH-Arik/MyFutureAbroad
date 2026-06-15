import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const validUser = process.env.ADMIN_USERNAME;
  const validPass = process.env.ADMIN_PASSWORD;
  const secret = process.env.SESSION_SECRET;

  if (!validUser || !validPass || !secret) {
    return NextResponse.json({ error: "Server misconfigured." }, { status: 500 });
  }

  if (username !== validUser || password !== validPass) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const token = await createSessionToken(secret);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return res;
}
