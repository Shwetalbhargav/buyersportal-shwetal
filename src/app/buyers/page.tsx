// src/app/page.tsx
"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // If already logged in, bounce to dashboard
  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((me) => {
        if (me?.id) router.replace("/dashboard");
      })
      .catch(() => {});
  }, [router]);

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border bg-white">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-slate-100 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-100 blur-3xl" />

        <div className="relative mx-auto max-w-3xl px-6 py-14 text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Buyer Lead Intake
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Capture, search, and manage buyer leads in one streamlined workspace.
          </p>

          {/* Primary CTAs: Login / Register */}
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/login"
              className="w-full rounded-lg bg-slate-900 px-5 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-slate-800 sm:w-auto"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="w-full rounded-lg border border-slate-200 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto"
            >
              Create an account
            </Link>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Already logged in? You’ll be redirected to your dashboard automatically.
          </p>
        </div>
      </section>

      {/* Quick actions (optional previews) */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          title="Add a New Buyer"
          desc="Create a buyer lead with contact and budget details."
          href="/login"
          action="Sign in to continue"
        />
        <Card
          title="Search & Filter"
          desc="Find the right buyers by status, tags, or budget."
          href="/login"
          action="Sign in to continue"
        />
        <Card
          title="CSV Import/Export"
          desc="Bulk-import leads or export your data anytime."
          href="/login"
          action="Sign in to continue"
        />
      </section>

      {/* How it works */}
      <section className="rounded-2xl border bg-white p-6">
        <h2 className="text-lg font-semibold">How it works</h2>
        <ol className="mt-3 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
          <li className="rounded-xl border p-4">
            <div className="font-medium text-slate-900">1) Capture</div>
            <p>Add buyers quickly from any device.</p>
          </li>
          <li className="rounded-xl border p-4">
            <div className="font-medium text-slate-900">2) Organize</div>
            <p>Filter by status, tags, and buying intent.</p>
          </li>
          <li className="rounded-xl border p-4">
            <div className="font-medium text-slate-900">3) Export</div>
            <p>Sync with your pipeline via CSV import/export.</p>
          </li>
        </ol>
      </section>
    </div>
  );
}

function Card({
  title,
  desc,
  href,
  action,
}: {
  title: string;
  desc: string;
  href: string;
  action: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border bg-white p-6 transition-shadow hover:shadow-md">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-slate-100 blur-2xl transition-transform group-hover:translate-x-2 group-hover:-translate-y-2" />
      <h3 className="relative text-base font-semibold">{title}</h3>
      <p className="relative mt-1 text-sm text-slate-600">{desc}</p>
      <Link
        href={href}
        className="relative mt-4 inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        {action}
      </Link>
    </div>
  );
}
