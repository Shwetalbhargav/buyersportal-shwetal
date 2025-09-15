import { NextRequest, NextResponse } from 'next/server';
import type { Lead } from './_store';

type LeadCreate = {
  name?: string;
  email?: string;
  phone?: string;
  tags?: string[];
  [k: string]: unknown;
};

type LeadFilters = {
  q?: string;
  tag?: string;
};

function readFilters(req: NextRequest): LeadFilters {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') ?? undefined;
  const tag = searchParams.get('tag') ?? undefined;
  return { q, tag };
}

export async function GET(req: NextRequest) {
  const filters = readFilters(req);
  // TODO: fetch with filters
  const items: Lead[] = [];
  return NextResponse.json({ items, filters });
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as LeadCreate;
  // TODO: create and return lead
  const created: Lead = { id: crypto.randomUUID(), ...body };
  return NextResponse.json(created, { status: 201 });
}
