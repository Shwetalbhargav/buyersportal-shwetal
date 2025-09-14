// app/api/entries/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireUser } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(req: Request) {

  try {
    requireUser(req as any); 
    const entries = await prisma.entry.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, content: true, ownerId: true, createdAt: true, updatedAt: true },
    });
    return NextResponse.json(entries);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const user = requireUser(req as any);
    const { title, content } = await req.json();
    if (!title) return NextResponse.json({ error: "title is required" }, { status: 400 });

    const created = await prisma.entry.create({
      data: { title, content: content ?? "", ownerId: user.id },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    if (e?.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Failed to create" }, { status: 400 });
  }
}
