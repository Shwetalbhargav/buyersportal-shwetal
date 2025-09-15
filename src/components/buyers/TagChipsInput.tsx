"use client";
import { useState } from "react";

export default function TagChipsInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [draft, setDraft] = useState<string>("");

  function addFromDraft() {
    const t = draft.trim();
    if (!t) return;
    if (!value.includes(t)) onChange([...value, t]);
    setDraft("");
  }

  function removeAt(idx: number) {
    const next = value.filter((_, i) => i !== idx);
    onChange(next);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addFromDraft();
    } else if (e.key === "Backspace" && draft.length === 0 && value.length) {
      // quick backspace-to-pop
      removeAt(value.length - 1);
    }
  }

  return (
    <div className="border p-2 rounded flex flex-wrap gap-2">
      {value.map((t, i) => (
        <span
          key={`${t}-${i}`}
          className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs"
        >
          {t}
          <button
            type="button"
            className="text-slate-500 hover:text-slate-700"
            onClick={() => removeAt(i)}
            aria-label={`Remove ${t}`}
            title={`Remove ${t}`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        className="min-w-[10ch] flex-1 outline-none"
        placeholder="Add tag"
        value={draft}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={addFromDraft}
      />
    </div>
  );
}
