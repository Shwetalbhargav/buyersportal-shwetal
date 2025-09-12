export function canEdit(current: { id: string; role?: "admin" | "user" }, ownerId: string) {
return current?.role === "admin" || current?.id === ownerId;
}
export const canDelete = canEdit;