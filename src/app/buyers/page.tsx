import { listBuyersSSR } from "@/components/lib/api";
import { parseFilters } from "@/components/lib/url";
import BuyersFilters from "@/components/buyers/BuyersFilters";
import BuyersSearch from "@/components/buyers/BuyersSearch";
import BuyersTable from "@/components/buyers/BuyersTable";
import BuyersPagination from "@/components/buyers/BuyersPagination";


export default async function Page({ searchParams }: { searchParams: Record<string,string> }) {
const filters = parseFilters(new URLSearchParams(searchParams as any));
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