// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { register } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Email & password required" }, { status: 400 });

    const { user, token } = await register(email, password);

    const res = NextResponse.json({ user });
    // httpOnly cookie is safer than localStorage
    res.cookies.set("token", token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to register" }, { status: 400 });
  }
}
