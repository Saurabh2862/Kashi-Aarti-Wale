import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { getSiteUrl } from "@/lib/site-url";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  robots: { index: process.env.VERCEL_ENV !== "preview", follow: true },
  title: {
    default: "Kashi Aarti Wale | Book Sacred Ganga Aarti Ceremonies",
    template: "%s | Kashi Aarti Wale",
  },
  description:
    "Book authentic Kashi-style Ganga Aarti for weddings, family rituals, and auspicious events across India.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Kashi Aarti Wale",
    title: "Kashi Aarti Wale | Sacred Ganga Aarti",
    description: "Bring the blessings of Kashi to your wedding, home and special occasions. Book your Ganga Aarti ceremony.",
    images: [{ url: "/social/kashi-aarti-wale.jpg", width: 1200, height: 630, alt: "Kashi Aarti Wale - Sacred Ganga Aarti for your special day", type: "image/jpeg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kashi Aarti Wale | Sacred Ganga Aarti",
    description: "Book Ganga Aarti for weddings, family rituals and special occasions.",
    images: ["/social/kashi-aarti-wale.jpg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${manrope.variable}`}>{children}</body>
    </html>
  );
}
