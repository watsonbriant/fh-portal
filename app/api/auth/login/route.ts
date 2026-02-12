import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  createSessionToken,
  getSessionCookieOptions,
  getSessionCookieName,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const { data: rows, error } = await supabase.rpc("z_p_verify_login", {
      p_email: email,
      p_password: password,
    });

    if (error || !rows?.length) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const user = rows[0] as { user_uuid: string; user_email: string };
    const token = await createSessionToken({
      sub: user.user_uuid,
      email: user.user_email,
    });
    const res = NextResponse.json({ ok: true, email: user.user_email });
    res.cookies.set(getSessionCookieName(), token, getSessionCookieOptions());
    return res;
  } catch {
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
