// src/app/api/buyers/_util.ts
import type { NextRequest } from "next/server";

export function getQuery(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  return searchParams;
}

export function okJSON(data: any, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { "content-type": "application/json" },
  });
}

export function notFound() {
  return new Response("Not found", { status: 404 });
}

export function badRequest(msg: string) {
  return new Response(msg, { status: 400 });
}

export function conflict(msg = "Conflict") {
  return new Response(msg, { status: 409 });
}

export const isProxy = !!process.env.BACKEND_URL;
