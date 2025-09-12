import { getCurrentUser } from "@/lib/auth";
import { canEdit } from "@/lib/permissions";
export default async function GuardOwner({ buyer, children }: { buyer: { ownerId: string }; children: React.ReactNode }) {
const user = await getCurrentUser();
if (!canEdit(user, buyer.ownerId)) {
return <div className="p-4 bg-yellow-50 border rounded">View only. You don't own this lead.</div>;
}
return <>{children}</>;
}