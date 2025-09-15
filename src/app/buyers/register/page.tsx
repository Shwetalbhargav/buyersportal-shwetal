// src/app/register/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already logged in, bounce to dashboard
  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((me) => {
        if (me?.id) router.replace("/dashboard");
      })
      .catch(() => {});
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const r = await fetch("/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!r.ok) {
        const data = await r.json().catch(() => ({}));
        throw new Error(data.error || "Registration failed");
      }
      router.replace("/dashboard");
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl border bg-white p-6">
      <h1 className="text-xl font-semibold">Create your account</h1>
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <label className="block">
          <span className="text-sm">Email</span>
          <input
            type="email"
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
        </label>

        <label className="block">
          <span className="text-sm">Password</span>
          <input
            type="password"
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </label>

        {err && <p className="text-sm text-red-600">{err}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-slate-900 px-4 py-2 text-white disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create account"}
        </button>

        <p className="text-sm text-slate-600">
          Already have an account?{" "}
          <a href="/login" className="underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
