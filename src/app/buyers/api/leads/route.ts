import type { NextRequest } from "next/server";
import { okJSON, badRequest, getQuery, isProxy } from "./_util";
import store from "./_store";
import { PAGE_SIZE } from "@/lib/constants";
import { buyerCreate } from "@/lib/zodSchemas";


export const dynamic = "force-dynamic";


export async function GET(req: NextRequest) {
if (isProxy) {
const url = `${process.env.BACKEND_URL}/buyers${new URL(req.url).search}`;
const r = await fetch(url, { headers: { "content-type": "application/json" }, cache: "no-store" });
return new Response(await r.text(), { status: r.status, headers: r.headers });
}
const q = getQuery(req);
const page = Number(q.get("page") || 1);
const pageSize = Number(q.get("pageSize") || PAGE_SIZE);
const city = q.get("city") || undefined;
const propertyType = q.get("propertyType") || undefined;
const status = q.get("status") || undefined;
const timeline = q.get("timeline") || undefined;
const search = (q.get("q") || "").toLowerCase();
const sort = q.get("sort") || "updatedAt.desc";
let rows = store.buyers.slice();
if (city) rows = rows.filter(r => r.city === city);
if (propertyType) rows = rows.filter(r => r.propertyType === propertyType);
if (status) rows = rows.filter(r => r.status === status);
if (timeline) rows = rows.filter(r => r.timeline === timeline);
if (search) rows = rows.filter(r => [r.fullName, r.phone, r.email].join(" ").toLowerCase().includes(search));
rows.sort((a,b) => sort === "updatedAt.asc" ? (+new Date(a.updatedAt) - +new Date(b.updatedAt)) : (+new Date(b.updatedAt) - +new Date(a.updatedAt)));
const total = rows.length;
const slice = rows.slice((page-1)*pageSize, page*pageSize);
return okJSON({ rows: slice, total });
}


export async function POST(req: NextRequest) {
if (isProxy) {
const url = `${process.env.BACKEND_URL}/buyers`;
const r = await fetch(url, { method: "POST", body: await req.text(), headers: { "content-type": "application/json" } });
return new Response(await r.text(), { status: r.status, headers: r.headers });
}
const body = await req.json();
const parsed = buyerCreate.safeParse(body);
if (!parsed.success) return badRequest(parsed.error.issues.map(i => i.message).join(", "));
const now = new Date().toISOString();
const id = crypto.randomUUID();
const rec = { ...parsed.data, id, ownerId: "demo-user", createdAt: now, updatedAt: now } as any;
store.buyers.unshift(rec);
store.history.push({ id: crypto.randomUUID(), buyerId: id, changedBy: "demo-user", changedAt: now, diff: { create: true } });
return okJSON(rec, { status: 201 });
}