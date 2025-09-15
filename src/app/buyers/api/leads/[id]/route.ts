import { NextRequest, NextResponse } from 'next/server';

type IdParams = { id: string };

export type Lead = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  tags?: string[];
  [k: string]: unknown;
};

type LeadUpdate = Partial<Omit<Lead, 'id'>>;

export async function GET(_req: NextRequest, { params }: { params: IdParams }) {
  const { id } = params;
  const lead: Lead = { id, name: 'Lead' };
  return NextResponse.json(lead);
}

export async function PATCH(req: NextRequest, { params }: { params: IdParams }) {
  const { id } = params;
  const patch = (await req.json()) as LeadUpdate;
  const updated: Lead = { id, ...patch };
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: IdParams }) {
  const { id } = params;
  return NextResponse.json({ deleted: id });
}
