// City
export const CityValues = [
  "Chandigarh",
  "Mohali",
  "Zirakpur",
  "Panchkula",
  "Other",
] as const;
export type City = typeof CityValues[number];

// PropertyType
export const PropertyTypeValues = [
  "Apartment",
  "Villa",
  "Plot",
  "Office",
  "Retail",
] as const;
export type PropertyType = typeof PropertyTypeValues[number];

// Purpose
export const PurposeValues = ["Buy", "Rent"] as const;
export type Purpose = typeof PurposeValues[number];

// Timeline
export const TimelineValues = ["0-3m", "3-6m", ">6m", "Exploring"] as const;
export type Timeline = typeof TimelineValues[number];

// Source
export const SourceValues = ["Website", "Referral", "Walk-in", "Call", "Other"] as const;
export type Source = typeof SourceValues[number];

// Status
export const StatusValues = [
  "New",
  "Qualified",
  "Contacted",
  "Visited",
  "Negotiation",
  "Converted",
  "Dropped",
] as const;
export type Status = typeof StatusValues[number];


export interface Buyer {
id: string;
ownerId: string;
fullName: string;
email?: string | null;
phone: string;
city?: City | null;
propertyType?: PropertyType | null;
bhk?: "Studio" | 1 | 2 | 3 | 4 | null;
purpose?: Purpose | null;
budgetMin?: number | null;
budgetMax?: number | null;
timeline?: Timeline | null;
source?: Source | null;
status: Status;
notes?: string | null;
tags: string[];
updatedAt: string;
createdAt: string;
}


export interface BuyersFilters {
page: number;
pageSize: number;
city?: City;
propertyType?: PropertyType;
status?: Status;
timeline?: Timeline;
q?: string; // fullName|phone|email
sort?: "updatedAt.desc" | "updatedAt.asc";
}


export interface BuyerHistoryItem {
id: string;
buyerId: string;
field: keyof Buyer;
oldValue: string | null;
newValue: string | null;
changedAt: string;
changedBy: string; // user id
}