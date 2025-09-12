import { Buyer } from "@/lib/types";
export default function BuyersTable({ data }: { data: Buyer[] }) {
return (
<table className="table bg-white rounded-lg overflow-hidden">
<thead>
<tr>
<th>Name</th><th>Phone</th><th>City</th><th>Property</th><th>Budget</th><th>Timeline</th><th>Status</th><th>Updated</th><th></th>
</tr>
</thead>
<tbody>
{data.map(b => (
<tr key={b.id}>
<td>{b.fullName}</td>
<td>{b.phone}</td>
<td>{b.city}</td>
<td>{b.propertyType}{b.bhk ? ` · ${b.bhk}`: ""}</td>
<td>{(b.budgetMin ?? "")}–{(b.budgetMax ?? "")}</td>
<td>{b.timeline}</td>
<td>{b.status}</td>
<td>{new Date(b.updatedAt).toLocaleString()}</td>
<td><a className="text-blue-600" href={`/buyers/${b.id}`}>View / Edit</a></td>
</tr>
))}
</tbody>
</table>
);
}