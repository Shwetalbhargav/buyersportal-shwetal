"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Me = { id: string } | null;
type LoginResponse = { ok: true } | { ok: false; error?: string };

function msgFromError(e: unknown): string {
  return e instanceof Error ? e.message : "Login failed";
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetch("/buyers/api/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((me: Me) => {
        if (me?.id) router.replace("/dashboard");
      })
      .catch(() => {});
  }, [router]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const r = await fetch("/buyers/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!r.ok) {
        const data = (await r.json().catch(() => ({}))) as Partial<LoginResponse>;
        throw new Error((data as { error?: string })?.error ?? "Login failed");
      }
      router.replace("/dashboard");
    } catch (e) {
      setErr(msgFromError(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl border bg-white p-6">
      <h1 className="text-xl font-semibold">Login</h1>
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <label className="block">
          <span className="text-sm">Email</span>
          <input
            type="email"
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-slate-900 px-4 py-2 text-white disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <p className="text-sm text-slate-600">
          No account? <a href="/register" className="underline">Register</a>
        </p>
      </form>
    </div>
  );
}
