// src/app/buyers/api/buyers/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

// Example type — adjust to your real Buyer type
type Buyer = {
  id: string;
  fullName: string;
  email?: string | null;
  phone: string;
  city: string;
  propertyType: string;
  bhk?: number | "Studio" | null;
  purpose: "Buy" | "Rent";
  budgetMin?: number;
  budgetMax?: number;
  timeline: string;
  source: string;
  status: string;
  notes?: string | null;
  tags?: string[];
  ownerId: string;
  updatedAt: string;
};

function getId(req: NextRequest): string {
  const parts = req.nextUrl.pathname.split("/");
  return parts[parts.length - 1] || "";
}

// GET /buyers/api/buyers/[id]
export async function GET(req: NextRequest) {
  const id = getId(req);

  // TODO: fetch buyer from DB instead of dummy data
  const buyer: Buyer = {
    id,
    fullName: "Test User",
    email: "user@example.com",
    phone: "9876543210",
    city: "Chandigarh",
    propertyType: "Apartment",
    bhk: 2,
    purpose: "Buy",
    budgetMin: 500000,
    budgetMax: 1000000,
    timeline: "0-3m",
    source: "Website",
    status: "New",
    notes: null,
    tags: ["hot-lead"],
    ownerId: "user-123",
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json(buyer);
}

// DELETE /buyers/api/buyers/[id]
export async function DELETE(req: NextRequest) {
  const id = getId(req);

  // TODO: delete buyer from DB using `id`
  return new NextResponse(null, { status: 204 });
}
