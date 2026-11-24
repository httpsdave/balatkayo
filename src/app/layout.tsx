import type { Metadata } from "next";
import { Playfair_Display, Special_Elite } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const specialElite = Special_Elite({
  variable: "--font-special-elite",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BALATKAYO — An Interactive Historical Exhibit",
  description:
    "Balatkayo: Disguise. An exploration of extravagance, authoritarian rule, and the realities experienced by Filipinos during the Marcos dictatorship.",
  openGraph: {
    title: "BALATKAYO",
    description:
      "What was shown. What was hidden. An interactive historical exhibit.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${specialElite.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
