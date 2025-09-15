import { z } from "zod";

export const citySchema = z.enum(["Chandigarh","Mohali","Zirakpur","Panchkula","Other"]);
export const propertyTypeSchema = z.enum(["Apartment","Villa","Plot","Office","Retail"]);
export const bhkSchema = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal("Studio")]);
export const purposeSchema = z.enum(["Buy","Rent"]);
export const timelineSchema = z.enum(["0-3m","3-6m",">6m","Exploring"]);
export const sourceSchema = z.enum(["Website","Referral","Walk-in","Call","Other"]);
export const statusSchema = z.enum(["New","Qualified","Contacted","Visited","Negotiation","Converted","Dropped"]);

const buyerFields = {
  fullName: z.string().min(2).max(80),
  email: z.string().email().optional(),
  phone: z.string().regex(/^\d{10,15}$/, "Phone must be 10–15 digits"),
  city: citySchema,
  propertyType: propertyTypeSchema,
  bhk: bhkSchema.optional(), // required only for Apartment/Villa (checked in superRefine)
  purpose: purposeSchema,
  budgetMin: z.number().int().nonnegative().optional(),
  budgetMax: z.number().int().nonnegative().optional(), // compare in superRefine
  timeline: timelineSchema,
  source: sourceSchema,
  status: statusSchema.default("New"),
  notes: z.string().max(1000).optional(),
  tags: z.array(z.string()).optional(),
};

export const buyerBase = z.object(buyerFields).superRefine((data, ctx) => {
  // bhk required iff propertyType is residential
  const requiresBhk = data.propertyType === "Apartment" || data.propertyType === "Villa";
  if (requiresBhk && data.bhk == null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["bhk"],
      message: "bhk is required for Apartment/Villa",
    });
  }

  // budgetMax ≥ budgetMin when both present
  if (data.budgetMin != null && data.budgetMax != null && data.budgetMax < data.budgetMin) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["budgetMax"],
      message: "budgetMax must be ≥ budgetMin",
    });
  }
});

export const buyerCreate = buyerBase.extend({
  // ownerId can be attached on the server; keep optional at the schema boundary
  ownerId: z.string().uuid().optional(),
});

export const buyerUpdate = buyerBase.extend({
  id: z.string().uuid(),
  updatedAt: z.string().optional(),
});
