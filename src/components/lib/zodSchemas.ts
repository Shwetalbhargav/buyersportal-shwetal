import { z } from "zod";
export const buyerBase = z.object({
fullName: z.string().min(2, "Full name must be at least 2 characters"),
email: z.string().email("Invalid email").optional().or(z.literal(""))
.transform(v => (v ? v : undefined)),
phone: z.string().regex(/^\d{10,15}$/, "Phone must be 10–15 digits"),
city: z.enum(["Chandigarh","Mohali","Zirakpur","Panchkula","Other"]).optional(),
propertyType: z.enum(["Apartment","Villa","Plot","Office","Retail"]).optional(),
bhk: z.preprocess(v => (v === "" || v == null ? undefined : v),
z.union([z.literal("Studio"), z.coerce.number().int().min(1).max(4)])
).optional(),
purpose: z.enum(["Buy","Rent"]).optional(),
budgetMin: z.preprocess(v => (v === "" ? undefined : v), z.coerce.number().nonnegative()).optional(),
budgetMax: z.preprocess(v => (v === "" ? undefined : v), z.coerce.number().nonnegative()).optional(),
timeline: z.enum(["0-3m","3-6m",">6m","Exploring"]).optional(),
source: z.enum(["Website","Referral","Walk-in","Call","Other"]).optional(),
notes: z.string().max(1000, "Max 1000 chars").optional(),
tags: z.array(z.string()).default([]),
status: z.enum(["New","Qualified","Contacted","Visited","Negotiation","Converted","Dropped"]).default("New"),
});

export const buyerCreate = buyerBase.superRefine((d, ctx) => {
if ((d.propertyType === "Apartment" || d.propertyType === "Villa") && !d.bhk) {
ctx.addIssue({ path: ["bhk"], code: z.ZodIssueCode.custom, message: "BHK is required for Apartment/Villa" });
}
if (d.budgetMin != null && d.budgetMax != null && d.budgetMax < d.budgetMin) {
ctx.addIssue({ path: ["budgetMax"], code: z.ZodIssueCode.custom, message: "Max budget must be ≥ Min budget" });
}
});


export const buyerUpdate = buyerCreate.extend({
id: z.string(),
updatedAt: z.string(),
});


export const csvRow = buyerBase.extend({
tags: z.string().optional().transform(v => v ? v.split("|").map(s => s.trim()).filter(Boolean) : []),
}).strict();