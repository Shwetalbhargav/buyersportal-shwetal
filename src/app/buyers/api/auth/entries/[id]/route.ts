// app/api/entries/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireUser } from "@/lib/auth";

const prisma = new PrismaClient();

export async function PUT(_req: Request, { params }: { params: { id: string } }) {
  try {
    const req = _req as any;
    const user = requireUser(req);
    const body = await _req.json();

    const entry = await prisma.entry.findUnique({ where: { id: params.id } });
    if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (entry.ownerId !== user.id) {
      return NextResponse.json({ error: "Forbidden (not your entry)" }, { status: 403 });
    }

    const updated = await prisma.entry.update({
      where: { id: params.id },
      data: { title: body.title ?? entry.title, content: body.content ?? entry.content },
    });

    return NextResponse.json(updated);
  } catch (e: any) {
    if (e?.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Failed to update" }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const req = _req as any;
    const user = requireUser(req);

    const entry = await prisma.entry.findUnique({ where: { id: params.id } });
    if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (entry.ownerId !== user.id) {
      return NextResponse.json({ error: "Forbidden (not your entry)" }, { status: 403 });
    }

    await prisma.entry.delete({ where: { id: params.id } });
    return new NextResponse(null, { status: 204 });
  } catch (e: any) {
    if (e?.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Failed to delete" }, { status: 400 });
  }
}
