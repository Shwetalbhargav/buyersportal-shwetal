import { PAGE_SIZE } from "./constants";
export function parseFilters(sp: URLSearchParams) {
return {
page: Number(sp.get("page") || 1),
pageSize: PAGE_SIZE,
city: sp.get("city") || undefined,
propertyType: sp.get("propertyType") || undefined,
status: sp.get("status") || undefined,
timeline: sp.get("timeline") || undefined,
q: sp.get("q") || undefined,
sort: (sp.get("sort") as any) || "updatedAt.desc",
};
}
export function buildQuery(obj: Record<string, any>) {
const sp = new URLSearchParams();
Object.entries(obj).forEach(([k, v]) => {
if (v == null || v === "") return; sp.set(k, String(v));
});
return sp.toString();
}