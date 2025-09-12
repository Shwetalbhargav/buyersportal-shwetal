import { describe, it, expect } from "vitest";
import { csvRow } from "../src/components/lib/zodSchemas";


describe("CSV Row Validation", () => {
it("accepts valid row", () => {
const row = {
fullName: "John Doe",
phone: "9876543210",
city: "Mohali",
propertyType: "Apartment",
bhk: 2,
purpose: "Buy",
budgetMin: 5000000,
budgetMax: 8000000,
timeline: "0-3m",
source: "Website",
status: "New",
tags: "hot|vip"
};
expect(() => csvRow.parse(row)).not.toThrow();
});
it("rejects when budgetMax < budgetMin", () => {
const row = { fullName: "Jane", phone: "9876543210", budgetMin: 100, budgetMax: 50 };
expect(() => csvRow.parse(row)).toThrow();
});
});