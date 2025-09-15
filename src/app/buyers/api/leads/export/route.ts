import { NextRequest, NextResponse } from 'next/server';
import type { CsvRow } from '@/lib/zodSchemas';

function toCsv(rows: CsvRow[]): string {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0] as Record<string, unknown>);
  const lines = [
    headers.join(','),
    ...rows.map(r => headers.map(h => csvEscape(String((r as Record<string, unknown>)[h] ?? ''))).join(',')),
  ];
  return lines.join('\n');
}

function csvEscape(s: string): string {
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(_req: NextRequest) {
  // TODO: pull rows from DB
  const rows: CsvRow[] = [];
  const csv = toCsv(rows);
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="leads.csv"',
    },
  });
}
