import { NextRequest, NextResponse } from 'next/server';
import { csvRow, type CsvRow } from '@/lib/zodSchemas';

function parseCsv(input: string): CsvRow[] {
  const lines = input.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];
  const headers = lines[0]!.split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const obj: Record<string, unknown> = {};
    headers.forEach((h, i) => (obj[h] = values[i] ?? null));
    return obj as CsvRow;
  });
}

export async function POST(req: NextRequest) {
  const text = await req.text();
  const rows = parseCsv(text);
  // validate each row (throws if invalid)
  for (const r of rows) csvRow.parse(r);
  // TODO: persist rows
  return NextResponse.json({ imported: rows.length });
}
