// ./src/middleware.ts
import { NextRequest, NextResponse } from "next/server";

const WINDOW_MS = 60_000; // 1 min
const LIMIT = 100;

// Simple in-memory buckets (edge/runtime note: resets on cold start)
const buckets = new Map<string, { count: number; ts: number }>();

function getClientIp(req: NextRequest): string {
  // most proxies set x-forwarded-for: "client, proxy1, proxy2"
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const ip = xff.split(",")[0]?.trim();
    if (ip) return ip;
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;

  // last resort: accept an untyped .ip if a platform injects it
  const maybeIp = (req as NextRequest & { ip?: string }).ip;
  if (maybeIp) return maybeIp;

  return "anon";
}

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api/buyers")) {
    const ip = getClientIp(req);
    const now = Date.now();

    const bucket = buckets.get(ip) ?? { count: 0, ts: now };
    if (now - bucket.ts > WINDOW_MS) {
      bucket.count = 0;
      bucket.ts = now;
    }
    bucket.count += 1;
    buckets.set(ip, bucket);

    if (bucket.count > LIMIT) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }
  }

  return NextResponse.next();
}

// optional: limit the middleware to just this route
export const config = {
  matcher: ["/api/buyers/:path*"],
};
