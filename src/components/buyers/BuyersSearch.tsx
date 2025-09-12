"use client";
import { useState } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useUrlState } from "@/hooks/useUrlState";
export default function BuyersSearch() {
const { set } = useUrlState();
const [q, setQ] = useState("");
const debounced = useDebouncedValue(q, 400);
// push to URL when debounced
// eslint-disable-next-line react-hooks/exhaustive-deps
(function sync(){ set("q", debounced || undefined); })();
return (
<input className="border p-2 rounded" placeholder="Search name/phone/email" value={q} onChange={e => setQ(e.target.value)} />
);
}