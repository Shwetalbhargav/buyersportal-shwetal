import { getBuyer } from "@/components/lib/api";
import BuyerForm from "@/components/buyers/BuyerForm";
import HistoryList from "@/components/buyers/HistoryList";
import GuardOwner from "@/components/buyers/GuardOwner";


export default async function Page({ params }: { params: { id: string } }) {
const buyer = await getBuyer(params.id);
return (
<div className="grid lg:grid-cols-3 gap-6">
<div className="lg:col-span-2 space-y-4">
<h1 className="text-xl font-semibold">View / Edit</h1>
<GuardOwner buyer={buyer}>
<BuyerForm mode="edit" initial={buyer} />
</GuardOwner>
</div>
<aside>
<HistoryList buyerId={buyer.id} />
</aside>
</div>
);
}