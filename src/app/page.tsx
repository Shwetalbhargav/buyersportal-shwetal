// src/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-xl w-full space-y-6">
        <h1 className="text-2xl font-semibold">Buyer Lead Intake</h1>
        <p className="text-gray-600">
          Capture, search and manage buyer leads.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <Link
            className="rounded-lg border px-4 py-3 text-center hover:bg-gray-50"
            href="/buyers"
          >
            View Buyers
          </Link>
          <Link
            className="rounded-lg border px-4 py-3 text-center hover:bg-gray-50"
            href="/buyers/new"
          >
            Create Lead
          </Link>
        </div>
        <div className="text-sm text-gray-500">
          Need CSV?{" "}
          <Link className="underline" href="/buyers">
            Import/Export from the list page
          </Link>
          .
        </div>
      </div>
    </main>
  );
}
