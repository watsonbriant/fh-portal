import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  isEmailAllowedForRegistration,
  hashPassword,
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

    if (!isEmailAllowedForRegistration(email)) {
      return NextResponse.json(
        { error: "Error creating account.  Please contact Jordan Price at jprice@freedomhouse.cc." },
        { status: 403 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const hashed = await hashPassword(password);
    const { data: rows, error } = await supabase.rpc("z_p_register_user", {
      p_email: email,
      p_password_hash: hashed,
    });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "An account with this email already exists." },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "Registration failed." },
        { status: 500 }
      );
    }

    const user = rows?.[0] as { user_uuid: string; user_email: string } | undefined;
    if (!user?.user_uuid) {
      return NextResponse.json(
        { error: "Registration is only allowed for @freedomhouse.cc addresses." },
        { status: 403 }
      );
    }

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
