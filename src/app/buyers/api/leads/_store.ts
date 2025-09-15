import type { CsvRow } from '@/lib/zodSchemas';

export type Lead = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  tags?: string[];
  [k: string]: unknown;
};

const db: Map<string, Lead> = new Map();

export const LeadsStore = {
  get(id: string): Lead | undefined {
    return db.get(id);
  },
  upsert(lead: Lead): Lead {
    db.set(lead.id, lead);
    return lead;
  },
  bulkInsert(rows: CsvRow[]): number {
    rows.forEach((r, i) => {
      const id = String((r as Record<string, unknown>).id ?? `row-${i}`);
      db.set(id, { id, ...(r as Record<string, unknown>) } as Lead);
    });
    return rows.length;
  },
  all(): Lead[] {
    return Array.from(db.values());
  },
};
