import { NextRequest, NextResponse } from 'next/server';

type IdParams = { id: string };

type Entry = {
  id: string;
  email: string;
  status: 'active' | 'inactive';
  notes?: string | null;
};

type EntryUpdate = Partial<Pick<Entry, 'email' | 'status' | 'notes'>>;

export async function GET(_req: NextRequest, { params }: { params: IdParams }) {
  const { id } = params;
  // TODO: fetch from DB
  const entry: Entry = { id, email: 'user@example.com', status: 'active', notes: null };
  return NextResponse.json(entry);
}

export async function PATCH(req: NextRequest, { params }: { params: IdParams }) {
  const { id } = params;
  const payload = (await req.json()) as EntryUpdate;
  // TODO: update DB with payload
  const updated: Entry = { id, email: payload.email ?? 'user@example.com', status: payload.status ?? 'active', notes: payload.notes ?? null };
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: IdParams }) {
  const { id } = params;
  // TODO: delete in DB
  return NextResponse.json({ deleted: id });
}
