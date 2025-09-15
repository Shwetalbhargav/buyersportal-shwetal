// src/app/buyers/api/buyers/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

// Replace with your real Buyer type if you have one
type Buyer = {
  id: string;
  fullName?: string;
  email?: string | null;
  phone?: string;
  city?: string;
  propertyType?: string;
  bhk?: number | "Studio" | null;
  purpose?: "Buy" | "Rent";
  budgetMin?: number;
  budgetMax?: number;
  timeline?: string;
  source?: string;
  status?: string;
  notes?: string | null;
  tags?: string[];
  ownerId?: string;
  updatedAt?: string;
  [k: string]: unknown;
};

type BuyerUpdate = Partial<Omit<Buyer, "id">>;

// Helper: extract the [id] dynamic segment from the URL path
function getId(req: NextRequest): string {
  const parts = req.nextUrl.pathname.split("/");
  return parts[parts.length - 1] || "";
}

// GET /buyers/api/buyers/[id]
export async function GET(req: NextRequest) {
  const id = getId(req);

  // TODO: fetch from DB e.g.:
  // const buyer = await db.buyer.findUnique({ where: { id } });
  // if (!buyer) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Demo response (remove when wired to DB)
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

// PATCH /buyers/api/buyers/[id]
export async function PATCH(req: NextRequest) {
  const id = getId(req);
  const patch = (await req.json()) as BuyerUpdate;

  // TODO: update in DB e.g.:
  // const updated = await db.buyer.update({ where: { id }, data: patch });

  // Demo response (remove when wired to DB)
  const updated: Buyer = { id, ...patch, updatedAt: new Date().toISOString() };

  return NextResponse.json(updated);
}

// DELETE /buyers/api/buyers/[id]
export async function DELETE(req: NextRequest) {
  const id = getId(req);

  // TODO: delete in DB e.g.:
  // await db.buyer.delete({ where: { id } });

  return new NextResponse(null, { status: 204 });
}
