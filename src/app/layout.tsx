import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DokTerm — Termini yt, më lehtë.",
  description: "Platformë për menaxhimin e termineve në klinika stomatologjike.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sq">
      <body>{children}</body>
    </html>
  );
}
