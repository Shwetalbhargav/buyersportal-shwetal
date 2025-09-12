
"use client";
import { useUrlState } from "@/hooks/useUrlState";
export default function BuyersFilters() {
const { sp, set } = useUrlState();
return (
<div className="flex gap-2 items-end flex-wrap">
<select className="border p-2 rounded" value={sp.get("city") || ""} onChange={e => set("city", e.target.value || undefined)}>
<option value="">City</option>
{ ["Chandigarh","Mohali","Zirakpur","Panchkula","Other"].map(c => <option key={c} value={c}>{c}</option>) }
</select>
<select className="border p-2 rounded" value={sp.get("propertyType") || ""} onChange={e => set("propertyType", e.target.value || undefined)}>
<option value="">Property Type</option>
{ ["Apartment","Villa","Plot","Office","Retail"].map(c => <option key={c} value={c}>{c}</option>) }
</select>
<select className="border p-2 rounded" value={sp.get("status") || ""} onChange={e => set("status", e.target.value || undefined)}>
<option value="">Status</option>
{ ["New","Qualified","Contacted","Visited","Negotiation","Converted","Dropped"].map(s => <option key={s} value={s}>{s}</option>) }
</select>
<select className="border p-2 rounded" value={sp.get("timeline") || ""} onChange={e => set("timeline", e.target.value || undefined)}>
<option value="">Timeline</option>
{ ["0-3m","3-6m",">6m","Exploring"].map(t => <option key={t} value={t}>{t}</option>) }
</select>
</div>
);
}