// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";

const WINDOW_MS = 60_000;
const LIMIT = 100;
const buckets = new Map<string, { count: number; ts: number }>();

function getClientIp(req: NextRequest): string {
  // e.g. "client, proxy1, proxy2"
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;

  // Optional fallback if your platform injects a non-typed .ip
  const maybe = (req as NextRequest & { ip?: string }).ip;
  return maybe ?? "anon";
}

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api/buyers")) {
    const ip = getClientIp(req); // <-- use this instead of req.ip
    const now = Date.now();

    const bucket = buckets.get(ip) ?? { count: 0, ts: now };
    if (now - bucket.ts > WINDOW_MS) {
      bucket.count = 0;
      bucket.ts = now;
    }
    bucket.count += 1;
    buckets.set(ip, bucket);

    if (bucket.count > LIMIT) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
  }
  return NextResponse.next();
}

// (optional) limit this middleware to that route
export const config = {
  matcher: ["/api/buyers/:path*"],
};
