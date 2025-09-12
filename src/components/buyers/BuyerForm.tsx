"use client";
import { useState } from "react";
import { buyerCreate, buyerUpdate } from "@/lib/zodSchemas";
import { createBuyer, updateBuyer } from "@/lib/api";
import type { Buyer } from "@/lib/types";


export default function BuyerForm({ mode, initial }: { mode: "create" | "edit"; initial?: Buyer }) {
const [form, setForm] = useState<any>(initial ?? { status: "New", tags: [] });
const [msg, setMsg] = useState<string | null>(null);


const isResi = form.propertyType === "Apartment" || form.propertyType === "Villa";


async function onSubmit(e: React.FormEvent) {
e.preventDefault();
try {
const schema = mode === "create" ? buyerCreate : buyerUpdate;
const parsed = schema.parse({ ...form, id: initial?.id, updatedAt: initial?.updatedAt });
if (mode === "create") await createBuyer(parsed);
else await updateBuyer(initial!.id, parsed);
setMsg("Saved ✅");
} catch (err: any) {
setMsg(err?.message ?? "Failed");
}
}

function bind<K extends string>(key: K) {
return {
value: form[key] ?? "",
onChange: (e: any) => setForm((s: any) => ({ ...s, [key]: e.target.value }))
};
}

return (
<form onSubmit={onSubmit} className="space-y-3 bg-white p-4 rounded-lg">
{msg && <div className="text-sm text-gray-700">{msg}</div>}
<div className="grid sm:grid-cols-2 gap-3">
<input className="border p-2 rounded" placeholder="Full Name" {...bind("fullName")} />
<input className="border p-2 rounded" placeholder="Phone" {...bind("phone")} />
<input className="border p-2 rounded" placeholder="Email" {...bind("email")} />
<select className="border p-2 rounded" {...bind("city")}>
<option value="">City</option>
{ ["Chandigarh","Mohali","Zirakpur","Panchkula","Other"].map(c => <option key={c} value={c}>{c}</option>) }
</select>
<select className="border p-2 rounded" {...bind("propertyType")}>
<option value="">Property Type</option>
{ ["Apartment","Villa","Plot","Office","Retail"].map(c => <option key={c} value={c}>{c}</option>) }
</select>
{isResi && (
<select className="border p-2 rounded" {...bind("bhk")}>
<option value="">BHK</option>
{["Studio",1,2,3,4].map(b => <option key={b} value={String(b)}>{String(b)}</option>)}
</select>
)}
<select className="border p-2 rounded" {...bind("purpose")}>
<option value="">Purpose</option>
{ ["Buy","Rent"].map(p => <option key={p} value={p}>{p}</option>) }
</select>
<input className="border p-2 rounded" placeholder="Budget Min" type="number" {...bind("budgetMin")} />
<input className="border p-2 rounded" placeholder="Budget Max" type="number" {...bind("budgetMax")} />
<select className="border p-2 rounded" {...bind("timeline")}>
<option value="">Timeline</option>
{ ["0-3m","3-6m",">6m","Exploring"].map(t => <option key={t} value={t}>{t}</option>) }
</select>
<select className="border p-2 rounded" {...bind("source")}>
<option value="">Source</option>
{ ["Website","Referral","Walk-in","Call","Other"].map(s => <option key={s} value={s}>{s}</option>) }
</select>
<select className="border p-2 rounded" {...bind("status")}>
{ ["New","Qualified","Contacted","Visited","Negotiation","Converted","Dropped"].map(s => <option key={s} value={s}>{s}</option>) }
</select>
<input className="border p-2 rounded" placeholder="tag1|tag2" {...bind("tags")} />
</div>
<textarea className="border p-2 rounded w-full" rows={4} placeholder="Notes" {...bind("notes")} />
<div className="flex gap-2">
<button className="border px-4 py-2 rounded">Save</button>
</div>
{mode === "edit" && <input type="hidden" value={initial?.updatedAt} />}
</form>
);
}