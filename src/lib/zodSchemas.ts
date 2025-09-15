import { z } from "zod";
import {
  CityValues,
  PropertyTypeValues,
  PurposeValues,
  TimelineValues,
  SourceValues,
  StatusValues,
} from "@/lib/types";

// Buyer creation schema
export const buyerCreate = z.object({
  fullName: z.string().min(2).max(80),
  email: z.string().email().optional(),
  phone: z.string().regex(/^\d{10,15}$/),
  city: z.enum(CityValues),
  propertyType: z.enum(PropertyTypeValues),
  bhk: z.enum(["1", "2", "3", "4", "Studio"]).optional(), // enforce separately for Apartment/Villa
  purpose: z.enum(PurposeValues),
  budgetMin: z.number().int().nonnegative().optional(),
  budgetMax: z.number().int().nonnegative().optional(),
  timeline: z.enum(TimelineValues),
  source: z.enum(SourceValues),
  status: z.enum(StatusValues).default("New"),
  notes: z.string().max(1000).optional(),
  tags: z.array(z.string()).optional(),
}).refine(
  (data) =>
    !data.budgetMax ||
    !data.budgetMin ||
    data.budgetMax >= data.budgetMin,
  {
    message: "budgetMax must be greater than or equal to budgetMin",
    path: ["budgetMax"],
  }
).refine(
  (data) =>
    data.propertyType !== "Apartment" &&
    data.propertyType !== "Villa"
      ? true
      : !!data.bhk,
  {
    message: "bhk is required when propertyType is Apartment or Villa",
    path: ["bhk"],
  }
);

export const buyerUpdate = buyerCreate.safeExtend({
  id: z.string().uuid(),
  updatedAt: z.string(),
});

export const csvRow = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.boolean(), z.null()]) 
);
export type CsvRow = z.infer<typeof csvRow>;