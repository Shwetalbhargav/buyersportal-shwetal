import { NextRequest, NextResponse } from 'next/server';

type IdParams = { id: string };

export type Buyer = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  tags?: string[];
};

type BuyerUpdate = Partial<Omit<Buyer, 'id'>>;

export async function GET(_req: NextRequest, { params }: { params: IdParams }) {
  const { id } = params;
  // TODO: fetch from DB
  const buyer: Buyer = { id, name: 'Buyer Name' };
  return NextResponse.json(buyer);
}

export async function PATCH(req: NextRequest, { params }: { params: IdParams }) {
  const { id } = params;
  const patch = (await req.json()) as BuyerUpdate;
  // TODO: update DB
  const updated: Buyer = { id, name: patch.name ?? 'Buyer Name', email: patch.email, phone: patch.phone, tags: patch.tags };
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: IdParams }) {
  const { id } = params;
  // TODO: delete
  return NextResponse.json({ deleted: id });
}
