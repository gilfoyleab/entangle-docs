import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Entangle Docs",
  description: "Black-and-white product documentation for Entangle's cross-chain messaging network.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
