export type City = "Chandigarh" | "Mohali" | "Zirakpur" | "Panchkula" | "Other";
export type PropertyType = "Apartment" | "Villa" | "Plot" | "Office" | "Retail";
export type Purpose = "Buy" | "Rent";
export type Timeline = "0-3m" | "3-6m" | ">6m" | "Exploring";
export type Source = "Website" | "Referral" | "Walk-in" | "Call" | "Other";
export type Status = "New" | "Qualified" | "Contacted" | "Visited" | "Negotiation" | "Converted" | "Dropped";


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