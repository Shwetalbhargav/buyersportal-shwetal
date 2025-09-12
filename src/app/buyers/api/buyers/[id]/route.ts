import type { NextRequest } from "next/server";
import { okJSON, notFound, badRequest, isProxy, conflict } from "../../buyers/_util";
import store from "../../buyers/_store";
import { buyerUpdate } from "@/lib/zodSchemas";


export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
if (isProxy) {
const r = await fetch(`${process.env.BACKEND_URL}/buyers/${params.id}`, { cache: "no-store" });
return new Response(await r.text(), { status: r.status, headers: r.headers });
}
const rec = store.buyers.find(b => b.id === params.id);
if (!rec) return notFound();
return okJSON(rec);
}
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
if (isProxy) {
const r = await fetch(`${process.env.BACKEND_URL}/buyers/${params.id}`, { method: "PUT", headers: { "content-type": "application/json" }, body: await req.text() });
return new Response(await r.text(), { status: r.status, headers: r.headers });
}
const body = await req.json();
const parsed = buyerUpdate.safeParse(body);
if (!parsed.success) return badRequest(parsed.error.issues.map(i => i.message).join(", "));
const ix = store.buyers.findIndex(b => b.id === params.id);
if (ix === -1) return notFound();
// optimistic concurrency check
if (store.buyers[ix].updatedAt !== parsed.data.updatedAt) return conflict("Record changed, please refresh");
const now = new Date().toISOString();
const prev = store.buyers[ix];
const next = { ...prev, ...parsed.data, id: prev.id, updatedAt: now };
store.buyers[ix] = next as any;
store.history.push({ id: crypto.randomUUID(), buyerId: prev.id, changedBy: "demo-user", changedAt: now, diff: { /* simplified */ } });
return okJSON(next);
}
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
if (isProxy) {
const r = await fetch(`${process.env.BACKEND_URL}/buyers/${params.id}`, { method: "DELETE" });
return new Response(await r.text(), { status: r.status, headers: r.headers });
}
const ix = store.buyers.findIndex(b => b.id === params.id);
if (ix === -1) return notFound();
store.buyers.splice(ix,1);
return new Response(null, { status: 204 });
}