import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thedealsfr.com"),
  title: "TheDealsFr - Discover Local Deals, Effortlessly",
  description:
    "TheDealsFr connects you with exclusive discounts from nearby stores. Save smarter, support local businesses in your community.",
  keywords: [
    "local deals",
    "discounts",
    "local business",
    "savings",
    "community",
    "Nepal",
    "Lalitpur",
  ],
  authors: [{ name: "TheDealsFr Team" }],
  creator: "TheDealsFr",
  publisher: "TheDealsFr",
  openGraph: {
    title: "TheDealsFr - Discover Local Deals, Effortlessly",
    description:
      "Connect with exclusive discounts from nearby stores. Save smarter, support local.",
    url: "https://thedealsfr.com",
    siteName: "TheDealsFr",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "TheDealsFr - Local Deals Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TheDealsFr - Discover Local Deals, Effortlessly",
    description:
      "Connect with exclusive discounts from nearby stores. Save smarter, support local.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en ">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <StoreProvider>{children}</StoreProvider>
        <Toaster richColors={true} />
      </body>
    </html>
  );
}
