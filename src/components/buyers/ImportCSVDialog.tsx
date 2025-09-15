"use client";
// importCsv must be exported from @/lib/api, or update the import path below to the correct module
// import { importCsv } from "@/lib/api";
import { parseCsv } from "@/lib/csv";
import { csvRow, type CsvRow } from "@/lib/zodSchemas";

export default function ImportCSVDialog() {
  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const parsed: CsvRow[] = parseCsv(text).slice(0, 200); // cap 200 rows

    // validate rows
    for (const row of parsed) csvRow.parse(row);

    await importCsv(parsed);
    // optional: toast / message — left to the caller
    e.currentTarget.value = ""; // reset file input
  }

  return (
    <label className="border px-3 py-2 rounded cursor-pointer">
      Import CSV
      <input type="file" accept=".csv" className="hidden" onChange={handleFile} />
    </label>
  );
}
function importCsv(parsed: Record<string, string | number | boolean | null>[]) {
    throw new Error("Function not implemented.");
}

