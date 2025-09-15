"use client";
import React, { useMemo, useState } from "react";
import { buyerCreate, buyerUpdate } from "@/lib/zodSchemas";
import { createBuyer, updateBuyer } from "@/lib/api";
import type { Buyer, City, PropertyType } from "@/lib/types";

type Mode = "create" | "edit";

/**
 * UI state mirrors form controls:
 * - strings for inputs/selects
 * - tags as string[]
 * We translate this to the domain Partial<Buyer> on submit.
 */
type UIValues = {
  fullName: string;
  phone: string;
  email: string;
  city: "" | City;
  propertyType: "" | PropertyType;
  bhk: "" | "Studio" | "1" | "2" | "3" | "4";
  purpose: "" | "Buy" | "Rent";
  budgetMin: string; // numeric string
  budgetMax: string; // numeric string
  timeline: "" | "0-3m" | "3-6m" | ">6m" | "Exploring";
  source: "" | "Website" | "Referral" | "Walk-in" | "Call" | "Other";
  status:
    | "New"
    | "Qualified"
    | "Contacted"
    | "Visited"
    | "Negotiation"
    | "Converted"
    | "Dropped";
  tags: string[];
  notes: string;
};

function toMsg(e: unknown): string {
  return e instanceof Error ? e.message : "Failed";
}

function toUI(initial?: Buyer): UIValues {
  return {
    fullName: initial?.fullName ?? "",
    phone: initial?.phone ?? "",
    email: initial?.email ?? "",
    city: (initial?.city as City | null) ?? "",
    propertyType: (initial?.propertyType as PropertyType | null) ?? "",
    bhk:
      initial?.bhk == null
        ? ""
        : initial.bhk === "Studio"
        ? "Studio"
        : (String(initial.bhk) as "1" | "2" | "3" | "4"),
    purpose: (initial?.purpose as "Buy" | "Rent" | null) ?? "",
    budgetMin:
      typeof initial?.budgetMin === "number" ? String(initial!.budgetMin) : "",
    budgetMax:
      typeof initial?.budgetMax === "number" ? String(initial!.budgetMax) : "",
    timeline: (initial?.timeline as UIValues["timeline"] | null) ?? "",
    source: (initial?.source as UIValues["source"] | null) ?? "",
    status: initial?.status ?? "New",
    tags: initial?.tags ?? [],
    notes: initial?.notes ?? "",
  };
}

export default function BuyerForm({
  mode,
  initial,
}: {
  mode: Mode;
  initial?: Buyer;
}) {
  // FIX 1: initializer returns UIValues only (not a union with Buyer)
  const [form, setForm] = useState<UIValues>(() =>
    initial ? toUI(initial) : toUI()
  );
  const [msg, setMsg] = useState<string | null>(null);

  const isResi = useMemo(
    () => form.propertyType === "Apartment" || form.propertyType === "Villa",
    [form.propertyType]
  );

  // FIX 2: separate binders for input/select vs textarea to keep onChange types sound
  const bindInputOrSelect = <K extends keyof UIValues>(
    key: K,
    coerce?: "number"
  ) => {
    const value = form[key] as string | number | string[];
    return {
      value: typeof value === "string" || typeof value === "number" ? value : "",
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      ) => {
        const raw = e.target.value;
        setForm((s) => ({ ...s, [key]: coerce === "number" ? String(raw) : raw } as UIValues));
      },
    };
  };

  const bindTextarea = <K extends keyof UIValues>(key: K) => ({
    value: (form[key] as string) ?? "",
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
      setForm((s) => ({ ...s, [key]: e.target.value } as UIValues)),
  });

  function toDomain(): Partial<Buyer> {
    // FIX 3: convert UI strings to domain types expected by Buyer / zod schema
    const bhkVal =
      form.bhk === ""
        ? undefined
        : form.bhk === "Studio"
        ? "Studio"
        : (Number(form.bhk) as 1 | 2 | 3 | 4);

    const payload: Partial<Buyer> = {
      fullName: form.fullName.trim() || undefined,
      phone: form.phone.trim() || undefined,
      email: form.email.trim() || undefined,
      city: form.city || undefined,
      propertyType: form.propertyType || undefined,
      bhk: bhkVal,
      purpose: form.purpose || undefined,
      budgetMin: form.budgetMin ? Number(form.budgetMin) : undefined,
      budgetMax: form.budgetMax ? Number(form.budgetMax) : undefined,
      timeline: form.timeline || undefined,
      source: form.source || undefined,
      status: form.status,
      tags: form.tags.length ? form.tags : undefined,
      notes: form.notes || undefined,
    };

    // If editing, include id/updatedAt so your existing zod schema logic stays the same
    if (initial?.id) {
      (payload as { id: string; updatedAt?: string }).id = initial.id;
      if (initial.updatedAt) {
        (payload as { updatedAt?: string }).updatedAt = initial.updatedAt;
      }
    }

    return payload;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    try {
      const payload = toDomain();
      // Validate with your existing schemas (unchanged logic)
      const schema = mode === "create" ? buyerCreate : buyerUpdate;
      const parsed = schema.parse(payload);

      if (mode === "create") {
        await createBuyer(parsed);
      } else if (initial?.id) {
        await updateBuyer(initial.id, parsed);
      }
      setMsg("Saved ✅");
    } catch (err) {
      setMsg(toMsg(err));
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 bg-white p-4 rounded-lg">
      {msg && <div className="text-sm text-gray-700">{msg}</div>}
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          className="border p-2 rounded"
          placeholder="Full Name"
          {...bindInputOrSelect("fullName")}
        />
        <input
          className="border p-2 rounded"
          placeholder="Phone"
          {...bindInputOrSelect("phone")}
        />
        <input
          className="border p-2 rounded"
          placeholder="Email"
          {...bindInputOrSelect("email")}
        />
        <select className="border p-2 rounded" {...bindInputOrSelect("city")}>
          <option value="">City</option>
          {["Chandigarh", "Mohali", "Zirakpur", "Panchkula", "Other"].map(
            (c) => (
              <option key={c} value={c}>
                {c}
              </option>
            )
          )}
        </select>

        <select
          className="border p-2 rounded"
          {...bindInputOrSelect("propertyType")}
        >
          <option value="">Property Type</option>
          {["Apartment", "Villa", "Plot", "Office", "Retail"].map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {isResi && (
          <select className="border p-2 rounded" {...bindInputOrSelect("bhk")}>
            <option value="">BHK</option>
            {["Studio", "1", "2", "3", "4"].map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        )}

        <select
          className="border p-2 rounded"
          {...bindInputOrSelect("purpose")}
        >
          <option value="">Purpose</option>
          {["Buy", "Rent"].map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <input
          className="border p-2 rounded"
          placeholder="Budget Min"
          type="number"
          {...bindInputOrSelect("budgetMin", "number")}
        />
        <input
          className="border p-2 rounded"
          placeholder="Budget Max"
          type="number"
          {...bindInputOrSelect("budgetMax", "number")}
        />

        <select
          className="border p-2 rounded"
          {...bindInputOrSelect("timeline")}
        >
          <option value="">Timeline</option>
          {["0-3m", "3-6m", ">6m", "Exploring"].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select className="border p-2 rounded" {...bindInputOrSelect("source")}>
          <option value="">Source</option>
          {["Website", "Referral", "Walk-in", "Call", "Other"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select className="border p-2 rounded" {...bindInputOrSelect("status")}>
          {[
            "New",
            "Qualified",
            "Contacted",
            "Visited",
            "Negotiation",
            "Converted",
            "Dropped",
          ].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Tags: comma-separated input → array */}
        <input
          className="border p-2 rounded"
          placeholder="tag1, tag2"
          value={(form.tags ?? []).join(", ")}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setForm((s) => ({
              ...s,
              tags: e.target.value
                .split(",")
                .map((t) => t.trim())
                .filter((t) => t.length > 0),
            }))
          }
        />
      </div>

      <textarea
        className="border p-2 rounded w-full"
        rows={4}
        placeholder="Notes"
        {...bindTextarea("notes")}
      />

      <div className="flex gap-2">
        <button className="border px-4 py-2 rounded">Save</button>
      </div>

      {mode === "edit" && (
        <input type="hidden" value={String(initial?.updatedAt ?? "")} readOnly />
      )}
    </form>
  );
}
