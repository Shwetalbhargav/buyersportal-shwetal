// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { login } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Email & password required" }, { status: 400 });

    const { user, token } = await login(email, password);

    const res = NextResponse.json({ user });
    res.cookies.set("token", token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to login" }, { status: 401 });
  }
}
