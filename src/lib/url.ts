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


export type QueryValue = string | number | boolean | null | undefined;
export type QueryParams = Record<string, QueryValue | QueryValue[]>;
export function buildQuery(params: QueryParams): string {
  const sp = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([key, val]) => {
    if (val === null || val === undefined) return;
    const push = (v: Exclude<QueryValue, null | undefined>) =>
      sp.append(key, String(v));
    Array.isArray(val) ? val.forEach(v => v != null && push(v)) : push(val);
  });
  return sp.toString();
}