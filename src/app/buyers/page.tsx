import { listBuyersSSR } from "@/lib/api";
import { parseFilters } from "@/lib/url";
import BuyersFilters from "@/components/buyers/BuyersFilters";
import BuyersSearch from "@/components/buyers/BuyersSearch";
import BuyersTable from "@/components/buyers/BuyersTable";
import BuyersPagination from "@/components/buyers/BuyersPagination";

type SP = Record<string, string | string[] | undefined>;

function toURLSearchParams(sp?: SP) {
  const pairs: [string, string][] = [];
  if (!sp) return new URLSearchParams();

  for (const [k, v] of Object.entries(sp)) {
    if (v == null) continue;
    if (Array.isArray(v)) {
      for (const item of v) pairs.push([k, String(item)]);
    } else {
      pairs.push([k, String(v)]);
    }
  }
  return new URLSearchParams(pairs);
}


export default async function Page({
  searchParams,
}: { searchParams?: SP }) {
  const filters = parseFilters(toURLSearchParams(searchParams));
  const { rows, total } = await listBuyersSSR(filters);
return (
<div className="space-y-4">
<div className="flex justify-between gap-2">
<div className="flex gap-2"><BuyersFilters /><BuyersSearch /></div>
</div>
<BuyersTable data={rows} />
<BuyersPagination total={total} page={filters.page} pageSize={filters.pageSize} />
</div>
);
}