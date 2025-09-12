export function toCsv(rows: Record<string, any>[], headers: string[]): string {
const head = headers.join(",");
const body = rows.map(r => headers.map(h => JSON.stringify(r[h] ?? "")).join(",")).join("\n");
return `${head}\n${body}`;
}