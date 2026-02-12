import { NextRequest, NextResponse } from "next/server";
import { getSessionCookieName } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const url = request.nextUrl.clone();
  const res = NextResponse.redirect(new URL("/login", url.origin));
  res.cookies.set(getSessionCookieName(), "", {
    path: "/",
    maxAge: 0,
    httpOnly: true,
    sameSite: "lax",
  });
  return res;
}
