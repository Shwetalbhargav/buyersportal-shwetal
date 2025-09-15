import { NextRequest, NextResponse } from 'next/server';

type Entry = {
  id: string;
  email: string;
  status: 'active' | 'inactive';
  notes?: string | null;
};

type CreateEntryInput = {
  email: string;
  status?: 'active' | 'inactive';
  notes?: string | null;
};

export async function GET() {
  
  // TODO: list from DB
  const items: Entry[] = [];
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as CreateEntryInput;
  // TODO: insert to DB
  const created: Entry = {
    id: crypto.randomUUID(),
    email: body.email,
    status: body.status ?? 'active',
    notes: body.notes ?? null,
  };
  return NextResponse.json(created, { status: 201 });
}
