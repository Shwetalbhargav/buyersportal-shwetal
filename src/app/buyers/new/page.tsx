import BuyerForm from "@/components/buyers/BuyerForm";
export default function Page() {
return (
<div className="space-y-4">
<h1 className="text-xl font-semibold">Create Lead</h1>
<BuyerForm mode="create" />
</div>
);
}