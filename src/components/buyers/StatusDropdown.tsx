"use client";
import { useState } from "react";
export default function StatusDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
const [v, setV] = useState(value);
return (
<select className="border p-1 rounded" value={v} onChange={e => { setV(e.target.value); onChange(e.target.value); }}>
{["New","Qualified","Contacted","Visited","Negotiation","Converted","Dropped"].map(s => <option key={s} value={s}>{s}</option>)}
</select>
);
}