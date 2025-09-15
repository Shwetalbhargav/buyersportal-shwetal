"use client";
import { useEffect, useState } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useUrlState } from "@/hooks/useUrlState";

export default function BuyersSearch() {
  const { set } = useUrlState();
  const [q, setQ] = useState<string>("");
  const debounced = useDebouncedValue(q, 400);

  useEffect(() => {
    set("q", debounced || undefined);
  }, [debounced, set]);

  return (
    <input
      className="border p-2 rounded"
      placeholder="Search name/phone/email"
      value={q}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value)}
    />
  );
}
