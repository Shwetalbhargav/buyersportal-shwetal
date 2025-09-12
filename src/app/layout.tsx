// src/app/layout.tsx
import Link from "next/link";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="border-b bg-white">
          <nav className="max-w-6xl mx-auto flex gap-4 p-4">
            <Link href="/" className="font-semibold">Buyer App</Link>
            <Link href="/buyers" className="text-gray-700 hover:underline">Buyers</Link>
            <Link href="/buyers/new" className="text-gray-700 hover:underline">Create</Link>
          </nav>
        </header>
        <main className="max-w-6xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
