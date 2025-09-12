"use client";
import { useUrlState } from "@/hooks/useUrlState";
export default function BuyersPagination({ total, page, pageSize }: { total: number; page: number; pageSize: number }) {
const { set } = useUrlState();
const pages = Math.max(1, Math.ceil(total / pageSize));
return (
<div className="flex gap-2 items-center">
<button className="border px-3 py-1 rounded" disabled={page<=1} onClick={() => set("page", String(page-1))}>Prev</button>
<span>Page {page} / {pages}</span>
<button className="border px-3 py-1 rounded" disabled={page>=pages} onClick={() => set("page", String(page+1))}>Next</button>
</div>
);
}