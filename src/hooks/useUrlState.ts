// src/hooks/useUrlState.ts
"use client";
import { useRouter, useSearchParams } from "next/navigation";

export function useUrlState() {
  const router = useRouter();
  const sp = useSearchParams();
  function set(key: string, value?: string) {
    const next = new URLSearchParams(sp.toString());
    if (value == null || value === "") next.delete(key);
    else next.set(key, value);
    // Reset to page 1 when filters/search change
    if (key !== "page") next.set("page", "1");
    router.push(`?${next.toString()}`);
  }
  return { sp, set };
}
