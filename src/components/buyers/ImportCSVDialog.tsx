"use client";
import { importCsv } from "@/lib/api";
export default function ImportCSVDialog() {
async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
const file = e.target.files?.[0];
if (!file) return;
// TODO: parse via Papaparse, validate with csvRow, show errors, cap 200 rows
await importCsv([]);
}
return (
<label className="border px-3 py-2 rounded cursor-pointer">Import CSV
<input type="file" accept=".csv" className="hidden" onChange={handleFile} />
</label>
);
}