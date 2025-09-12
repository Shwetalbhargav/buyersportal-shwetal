import type { NextRequest } from "next/server";
import { isProxy } from "../_util";
import store from "../_store";


export async function GET(req: NextRequest) {
if (isProxy) {
const url = `${process.env.BACKEND_URL}/buyers/export${new URL(req.url).search}`;
const r = await fetch(url, { cache: "no-store" });
return new Response(await r.text(), { status: r.status, headers: r.headers });
}
// respect current filters minimally (same as list route)
const sp = new URL(req.url).searchParams;
const city = sp.get("city") || undefined;
const propertyType = sp.get("propertyType") || undefined;
const status = sp.get("status") || undefined;
const timeline = sp.get("timeline") || undefined;
const search = (sp.get("q") || "").toLowerCase();
let rows = store.buyers.slice();
if (city) rows = rows.filter(r => r.city === city);
if (propertyType) rows = rows.filter(r => r.propertyType === propertyType);
if (status) rows = rows.filter(r => r.status === status);
if (timeline) rows = rows.filter(r => r.timeline === timeline);
if (search) rows = rows.filter(r => [r.fullName, r.phone, r.email].join(" ").toLowerCase().includes(search));


const headers = ["fullName","email","phone","city","propertyType","bhk","purpose","budgetMin","budgetMax","timeline","source","notes","tags","status"];
const head = headers.join(",");
const body = rows.map(r => headers.map(h => JSON.stringify((h === "tags" ? r.tags?.join("|") : (r as any)[h]) ?? "")).join(",")).join("
");
const csv = `${head}
${body}`;
return new Response(csv, { headers: { "content-type": "text/csv", "content-disposition": "attachment; filename=buyers.csv" } });
}