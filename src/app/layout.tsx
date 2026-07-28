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
  metadataBase: new URL("https://smart-car-wash-theta.vercel.app"),
  title: "Smart Car Wash — Programări & Spălătorie Auto | Buzești, București",
  description:
    "Spălătorie auto pe Strada Buzești 34, București. Rating Google 4.5 (557+). Programează online cu numărul de înmatriculare. Zilnic 08:00–20:00.",
  openGraph: {
    title: "Smart Car Wash — Spălare inteligentă pe Buzești",
    description:
      "Express, Complet, Detail. Booking online pe număr. 8 linii · 4.5★ Google.",
    locale: "ro_RO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoWash",
    name: "Smart Car Wash",
    image: "https://smart-car-wash-theta.vercel.app",
    telephone: "+40742399889",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Strada Buzești 34",
      addressLocality: "București",
      postalCode: "011015",
      addressCountry: "RO",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 44.4528,
      longitude: 26.0855,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "08:00",
      closes: "20:00",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      reviewCount: "557",
    },
    url: "https://smart-car-wash-theta.vercel.app",
  };

  return (
    <html lang="ro" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
