import type { Metadata } from "next";

// Self-hosted fonts (no network call at build time).
import "@fontsource-variable/inter";
import "@fontsource-variable/noto-sans";
import "@fontsource-variable/noto-sans-jp";
import "@fontsource-variable/noto-sans-sc";
import "@fontsource-variable/noto-sans-kr";
import "@fontsource-variable/noto-sans-arabic";
import "@fontsource-variable/noto-sans-devanagari";
import "@fontsource-variable/noto-sans-bengali";
import "@fontsource-variable/noto-sans-sinhala";
import "@fontsource/noto-sans-myanmar";

import "./globals.css";

export const metadata: Metadata = {
  title: "Typpi",
  description: "Learn to type Japanese by chatting — a little at a time.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
