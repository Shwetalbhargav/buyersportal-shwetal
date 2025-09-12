import { describe, it, expect } from "vitest";
import { buyerCreate, csvRow } from "@/lib/zodSchemas";


describe("buyer validation", () => {
it("rejects budgetMax < budgetMin", () => {
const r = buyerCreate.safeParse({ fullName: "A B", phone: "1234567890", budgetMin: 200, budgetMax: 100 });
expect(r.success).toBe(false);
});
it("requires BHK when Apartment/Villa", () => {
const r = buyerCreate.safeParse({ fullName: "Ok", phone: "1234567890", propertyType: "Apartment" });
expect(r.success).toBe(false);
});
it("parses csv tags pipe-separated", () => {
const r = csvRow.safeParse({ fullName: "Ok", phone: "1234567890", tags: "hot|vip" });
expect(r.success).toBe(true);
if (r.success) expect(r.data.tags).toEqual(["hot","vip"]);
});
});