import type { Metadata, Viewport } from "next";
import { Syne, Manrope } from "next/font/google";
import "./globals.css";

const display = Syne({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700", "800"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#04060a",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://smart-car-wash.vercel.app"),
  title: "Smart Car Wash — Programări & Spălătorie Auto | Buzești, București",
  description:
    "Programează online spălarea auto cu numărul de înmatriculare. Strada Buzești 34, București. Zilnic 08:00–20:00. Tel. +40 742 399 889.",
  openGraph: {
    title: "Smart Car Wash — Programări inteligente",
    description:
      "Spălătorie auto pe Buzești 34. Booking online pe număr de înmatriculare.",
    locale: "ro_RO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ro" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
