import { NextRequest, NextResponse } from 'next/server';

type LoginInput = { email: string; password: string };
type LoginResult = { ok: true; token: string } | { ok: false; message: string };

export async function POST(req: NextRequest) {
  const body = (await req.json()) as LoginInput;
  // TODO: real auth check
  const ok = Boolean(body.email && body.password);
  const result: LoginResult = ok
    ? { ok: true, token: 'mock-token' }
    : { ok: false, message: 'Invalid credentials' };
  return NextResponse.json(result, { status: ok ? 200 : 401 });
}
