// src/lib/csv.ts
import type { CsvRow } from '@/lib/zodSchemas';

export interface CsvStringifyOptions {
  /** CSV delimiter (default ',') */
  delimiter?: string;
  /** Newline to use (default '\n') */
  newline?: '\n' | '\r\n';
  /** Order of columns; if omitted, inferred from first row */
  columns?: string[];
}

export interface CsvParseOptions {
  /** CSV delimiter (default ',') */
  delimiter?: string;
  /** When true, trims surrounding whitespace of unquoted fields (default true) */
  trim?: boolean;
}

/**
 * Convert array of objects (CsvRow) to CSV string.
 * - Escapes quotes and wraps fields containing delimiter/quote/newline.
 */
export function toCsv(rows: CsvRow[], opts: CsvStringifyOptions = {}): string {
  if (rows.length === 0) return '';
  const delimiter = opts.delimiter ?? ',';
  const nl = opts.newline ?? '\n';

  const columns = opts.columns && opts.columns.length > 0
    ? opts.columns
    : Object.keys(rows[0] as Record<string, unknown>);

  const lines: string[] = [];
  lines.push(columns.join(delimiter));

  for (const row of rows) {
    const rec = row as Record<string, unknown>;
    const fields = columns.map((col) => escapeCsvField(valueToString(rec[col]), delimiter));
    lines.push(fields.join(delimiter));
  }

  return lines.join(nl);
}

/**
 * Parse CSV text to array of CsvRow with header row detection.
 * - Supports quoted fields, escaped quotes ("") and embedded newlines.
 * - Uses first line as headers.
 */
export function parseCsv(text: string, opts: CsvParseOptions = {}): CsvRow[] {
  const delimiter = opts.delimiter ?? ',';
  const trim = opts.trim ?? true;

  const input = stripBom(text);
  if (input.trim().length === 0) return [];

  const lines = tokenizeCsv(input, delimiter);
  if (lines.length === 0) return [];

  const headers = (lines[0] ?? []).map(h => (trim ? h.trim() : h));
  const out: CsvRow[] = [];

  for (let i = 1; i < lines.length; i += 1) {
    const cols = lines[i] ?? [];
    const obj: Record<string, unknown> = {};

    for (let c = 0; c < headers.length; c += 1) {
      const key = headers[c] ?? `col_${c}`;
      const raw = cols[c] ?? '';
      obj[key] = trim ? raw.trim() : raw;
    }

    
    out.push(obj as CsvRow);
  }

  return out;
}

/* -------------------- helpers -------------------- */

function valueToString(v: unknown): string {
  if (v === null || v === undefined) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  // Fallback for objects/arrays/dates: JSON
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

function escapeCsvField(s: string, delimiter: string): string {
  // Quote when field contains delimiter, quote, or newline
  if (s.includes(delimiter) || s.includes('"') || /\r|\n/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function stripBom(s: string): string {
  return s.charCodeAt(0) === 0xfeff ? s.slice(1) : s;
}

/**
 * Tokenizes CSV text into rows of fields honoring quotes/escapes/newlines.
 * Returns array of rows, each a string[] of fields.
 */
function tokenizeCsv(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let field = '';
  let row: string[] = [];

  let i = 0;
  const n = text.length;
  let inQuotes = false;

  while (i < n) {
    const ch = text[i] ?? '';

    if (inQuotes) {
      if (ch === '"') {
        const next = text[i + 1] ?? '';
        if (next === '"') {
          field += '"'; // escaped quote
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      field += ch;
      i += 1;
      continue;
    }

    // not in quotes
    if (ch === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }
    if (ch === delimiter) {
      row.push(field);
      field = '';
      i += 1;
      continue;
    }
    if (ch === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
      i += 1;
      continue;
    }
    if (ch === '\r') {
      // handle CRLF / CR
      const next = text[i + 1] ?? '';
      if (next === '\n') {
        row.push(field);
        rows.push(row);
        row = [];
        field = '';
        i += 2;
        continue;
      } else {
        row.push(field);
        rows.push(row);
        row = [];
        field = '';
        i += 1;
        continue;
      }
    }

    field += ch;
    i += 1;
  }

  // flush last field/row
  row.push(field);
  rows.push(row);

  return rows;
}
