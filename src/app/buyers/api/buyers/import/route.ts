import type { NextRequest } from "next/server";
import { okJSON, badRequest, isProxy } from "../_util";
import store from "../_store";
import { csvRow } from "@/lib/zodSchemas";


export async function POST(req: NextRequest) {
if (isProxy) {
const r = await fetch(`${process.env.BACKEND_URL}/buyers/import`, { method: "POST", headers: { "content-type": "application/json" }, body: await req.text() });
return new Response(await r.text(), { status: r.status, headers: r.headers });
}
const { rows } = await req.json();
if (!Array.isArray(rows)) return badRequest("rows must be an array");
if (rows.length > 200) return badRequest("Max 200 rows allowed");
const errors: Array<{ row: number; message: string }> = [];
const valid: any[] = [];
rows.forEach((r: any, i: number) => {
const parsed = csvRow.safeParse(r);
if (!parsed.success) errors.push({ row: i+1, message: parsed.error.issues.map(x=>x.message).join("; ") });
else valid.push(parsed.data);
});
// insert valid ones
const now = new Date().toISOString();
valid.forEach(v => {
const id = crypto.randomUUID();
store.buyers.push({ ...v, id, ownerId: "demo-user", createdAt: now, updatedAt: now });
});
return okJSON({ inserted: valid.length, errors });
}