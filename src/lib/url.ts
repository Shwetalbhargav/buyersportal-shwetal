import { z } from "zod";
import {
  CityValues,
  PropertyTypeValues,
  StatusValues,
  TimelineValues,
  City,
  PropertyType,
  Status,
  Timeline,
} from "@/lib/types";

const filtersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  city: z.enum(CityValues).optional(),
  propertyType: z.enum(PropertyTypeValues).optional(),
  status: z.enum(StatusValues).optional(),
  timeline: z.enum(TimelineValues).optional(),
  q: z.string().optional(),
  sort: z.string().optional(),
});

export type BuyersFilters = {
  page: number;
  pageSize: number;
  city?: City;
  propertyType?: PropertyType;
  status?: Status;
  timeline?: Timeline;
  q?: string;
  sort?: string;
};

export function parseFilters(sp: URLSearchParams): BuyersFilters {
  return filtersSchema.parse({
    page: sp.get("page"),
    pageSize: sp.get("pageSize"),
    city: sp.get("city") ?? undefined,
    propertyType: sp.get("propertyType") ?? undefined,
    status: sp.get("status") ?? undefined,
    timeline: sp.get("timeline") ?? undefined,
    q: sp.get("q") ?? undefined,
    sort: sp.get("sort") ?? undefined,
  });
}
