// src/app/api/me/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    return NextResponse.json({ id: payload.id, email: payload.email });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
