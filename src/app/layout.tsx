import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { NAME } from "@/config";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${NAME}`,
    template: `%s | ${NAME}`,
  },
  description:
    "Professional makeup artist specializing in bridal, party, and editorial makeup. Book your appointment today for a stunning look.",
  keywords: [
    "makeup artist",
    "bridal makeup",
    "party makeup",
    "editorial makeup",
    "Mumbai makeup artist",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: NAME,
    title: `${NAME}`,
    description:
      "Professional makeup artist specializing in bridal, party, and editorial makeup.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-body bg-background text-text antialiased">
        {children}
      </body>
    </html>
  );
}
