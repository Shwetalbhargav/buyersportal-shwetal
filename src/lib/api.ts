import { BuyersFilters, Buyer } from "./types";
import { buildQuery } from "./url";
const BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api"; // proxy by default


export async function listBuyersSSR(filters: BuyersFilters, cookie?: string) {
const url = `${BASE}/buyers?${buildQuery(filters)}`;
const res = await fetch(url, { headers: cookie ? { cookie } : undefined, cache: "no-store" });
if (!res.ok) throw new Error("Failed to load buyers");
return res.json() as Promise<{ rows: Buyer[]; total: number }>;
}
export async function getBuyer(id: string) {
const res = await fetch(`${BASE}/buyers/${id}`, { cache: "no-store" });
if (!res.ok) throw new Error("Not found");
return res.json() as Promise<Buyer>;
}
export async function createBuyer(input: any) {
const res = await fetch(`${BASE}/buyers`, { method: "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify(input) });
if (!res.ok) throw new Error(await res.text());
return res.json() as Promise<Buyer>;
}
export async function updateBuyer(id: string, input: any) {
const res = await fetch(`${BASE}/buyers/${id}`, { method: "PUT", headers: { "Content-Type":"application/json" }, body: JSON.stringify(input) });
if (res.status === 409) throw new Error("CONFLICT");
if (!res.ok) throw new Error(await res.text());
return res.json() as Promise<Buyer>;
}
export async function removeBuyer(id: string) {
const res = await fetch(`${BASE}/buyers/${id}`, { method: "DELETE" });
if (!res.ok) throw new Error(await res.text());
return res.json();
}
export async function importCsv(rows: any[]) {
const res = await fetch(`${BASE}/buyers/import`, { method: "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify({ rows }) });
if (!res.ok) throw new Error(await res.text());
return res.json() as Promise<{ inserted: number; errors: Array<{row:number; message:string}> }>; }
export function exportCsvUrl(filters: BuyersFilters) { return `${BASE}/buyers/export?${buildQuery(filters)}`; }