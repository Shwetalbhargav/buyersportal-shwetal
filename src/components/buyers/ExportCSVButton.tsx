import { exportCsvUrl } from "@/lib/api";
import { BuyersFilters } from "@/lib/types";
export default function ExportCSVButton({ filters }: { filters: BuyersFilters }) {
return <a className="border px-3 py-2 rounded" href={exportCsvUrl(filters)}>Export CSV</a>;
}