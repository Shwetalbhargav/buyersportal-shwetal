import { NextRequest, NextResponse } from 'next/server';

type RegisterInput = { email: string; password: string; name?: string };
type RegisterResult = { id: string; email: string; name?: string };

export async function POST(req: NextRequest) {
  const body = (await req.json()) as RegisterInput;
  // TODO: persist user
  const user: RegisterResult = { id: crypto.randomUUID(), email: body.email, name: body.name };
  return NextResponse.json(user, { status: 201 });
}
