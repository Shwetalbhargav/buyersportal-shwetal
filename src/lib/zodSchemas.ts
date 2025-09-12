import { z } from "zod";

const Status = z.enum(["New","Qualified","Contacted","Visited","Negotiation","Converted","Dropped"]);
const Timeline = z.enum(["0-3m","3-6m",">6m","Exploring"]);
const City = z.enum(["Chandigarh","Mohali","Zirakpur","Panchkula","Other"]);
const PropertyType = z.enum(["Apartment","Villa","Plot","Office","Retail"]);

const Base = z.object({
  fullName: z.string().min(2, "Full name ≥ 2 chars"),
  phone: z.string().regex(/^\d{10,15}$/, "10–15 digit phone"),
  email: z.string().email().optional(),
  city: City.optional(),
  propertyType: PropertyType.optional(),
  bhk: z.string().optional(), // "Studio" | "1" | "2" | "3" | "4"
  purpose: z.enum(["Buy","Rent"]).optional(),
  budgetMin: z.coerce.number().int().nonnegative().optional(),
  budgetMax: z.coerce.number().int().nonnegative().optional(),
  timeline: Timeline.optional(),
  source: z.enum(["Website","Referral","Walk-in","Call","Other"]).optional(),
  status: Status.default("New"),
  // "tag1|tag2" or string[]
  tags: z.union([z.array(z.string()), z.string()])
    .transform(v => Array.isArray(v) ? v : v.split("|").map(s => s.trim()).filter(Boolean))
    .default([]),
  notes: z.string().max(1000).optional(),
});

function withRefinements<T extends z.ZodTypeAny>(schema: T) {
  return schema.superRefine((val: any, ctx) => {
    if (val.budgetMin != null && val.budgetMax != null && val.budgetMax < val.budgetMin) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "budgetMax must be ≥ budgetMin", path: ["budgetMax"] });
    }
    const isResi = val.propertyType === "Apartment" || val.propertyType === "Villa";
    if (isResi && !val.bhk) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "bhk is required for Apartment/Villa", path: ["bhk"] });
    }
  });
}

// CREATE
export const buyerCreate = withRefinements(
  Base.extend({
    ownerId: z.string().min(1)
  })
);

// UPDATE (note safeExtend would also work here if you prefer)
export const buyerUpdate = withRefinements(
  Base.extend({
    id: z.string().min(1),
    updatedAt: z.string().optional()
  })
);
