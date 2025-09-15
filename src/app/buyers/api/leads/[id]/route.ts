// src/app/buyers/api/leads/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

export type Lead = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  tags?: string[];
  [k: string]: unknown;
};

type LeadUpdate = Partial<Omit<Lead, "id">>;

// Helper to extract [id] from URL path
function getId(req: NextRequest): string {
  const parts = req.nextUrl.pathname.split("/");
  return parts[parts.length - 1] || "";
}

// GET /buyers/api/leads/[id]
export async function GET(req: NextRequest) {
  const id = getId(req);
  const lead: Lead = { id, name: "Lead" };
  return NextResponse.json(lead);
}

// PATCH /buyers/api/leads/[id]
export async function PATCH(req: NextRequest) {
  const id = getId(req);
  const patch = (await req.json()) as LeadUpdate;
  const updated: Lead = { id, ...patch };
  return NextResponse.json(updated);
}

// DELETE /buyers/api/leads/[id]
export async function DELETE(req: NextRequest) {
  const id = getId(req);
  return NextResponse.json({ deleted: id });
}
