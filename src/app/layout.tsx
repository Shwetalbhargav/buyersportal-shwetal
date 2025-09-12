// src/app/layout.tsx
import Link from "next/link";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900 antialiased">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="inline-grid h-8 w-8 place-items-center rounded-lg bg-slate-900 text-white text-sm font-bold">BL</span>
              <span className="text-lg font-semibold tracking-tight">Buyer App</span>
            </Link>

            <div className="flex items-center gap-2">
              <Link
                href="/buyers"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Buyers
              </Link>
              <Link
                href="/buyers/new"
                className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Create Lead
              </Link>
            </div>
          </nav>
        </header>

        {/* Page content */}
        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>

        {/* Footer */}
        <footer className="border-t bg-white">
          <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-500">
            © {new Date().getFullYear()} Buyer App. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
