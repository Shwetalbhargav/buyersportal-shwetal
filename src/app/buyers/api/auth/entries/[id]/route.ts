// src/app/buyers/api/auth/entries/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

type Entry = {
  id: string;
  email: string;
  status: "active" | "inactive";
  notes: string | null;
};

// Safely derive the dynamic [id] segment without relying on the 2nd arg
function getId(req: NextRequest): string {
  const segments = req.nextUrl.pathname.split("/");
  return segments[segments.length - 1] || "";
}

// GET /buyers/api/auth/entries/[id]
export async function GET(req: NextRequest) {
  const id = getId(req);

  // TODO: replace with real DB fetch
  const entry: Entry = {
    id,
    email: "user@example.com",
    status: "active",
    notes: null,
  };

  return NextResponse.json(entry);
}

// DELETE /buyers/api/auth/entries/[id]
export async function DELETE(req: NextRequest) {
  const id = getId(req);

  // TODO: perform deletion in DB using `id`
  // On success, respond with 204 No Content
  return new NextResponse(null, { status: 204 });
}
