import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";


const buckets = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000;
const LIMIT = 20; // max requests per minute per IP


export function middleware(req: NextRequest) {
if (req.nextUrl.pathname.startsWith("/api/buyers")) {
const ip = req.ip ?? "anon";
const now = Date.now();
const bucket = buckets.get(ip) ?? { count: 0, ts: now };
if (now - bucket.ts > WINDOW_MS) {
bucket.count = 0;
bucket.ts = now;
}
bucket.count++;
buckets.set(ip, bucket);
if (bucket.count > LIMIT) {
return new NextResponse("Rate limit exceeded", { status: 429 });
}
}
return NextResponse.next();
}