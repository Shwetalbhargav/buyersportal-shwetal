import { getCurrentUser } from "@/lib/auth";
import { canEdit } from "@/lib/permissions";

export default async function GuardOwner({
  buyer,
  children,
}: {
  buyer: { ownerId: string };
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Map SessionUser's role to "admin" or "user"
  const mappedUser = user
    ? {
        id: user.id,
        role: user.role === "ADMIN" ? "admin" as "admin" : "user" as "user",
      }
    : undefined;

  if (!mappedUser || !canEdit(mappedUser, buyer.ownerId)) {
    return (
      <div className="p-4 bg-yellow-50 border rounded">
        View only. You don&apos;t own this lead.
      </div>
    );
  }

  return <>{children}</>;
}
