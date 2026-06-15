import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";

export async function POST(req: NextRequest) {
  const loginUrl = new URL("/login", req.url);
  const res = NextResponse.redirect(loginUrl);
  res.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions(0) });
  return res;
}
