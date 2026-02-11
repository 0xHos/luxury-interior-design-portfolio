import React from "react"
import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { LocaleProvider } from "@/lib/locale-context";
import "./globals.css";

const _playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const _inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Luxe Interiors | Luxury Interior Design Studio",
  description:
    "Creating bespoke luxury interiors that tell your story through refined craftsmanship and timeless design. Based in the Middle East.",
  generator: "v0.app",
};

export const viewport: Viewport = {
  themeColor: "#1a1815",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${_playfair.variable} ${_inter.variable} font-sans antialiased`}
      >
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
