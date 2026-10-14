import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "TARA – Turn Curiosity Into Superpowers | AI-Powered Learning Platform",
  description:
    "TARA is an AI-powered smart education platform that helps school students learn effectively through interactive lessons, games, AI-guided explanations, experiments, and real-world challenges.",
  keywords: ["AI learning", "education", "smart learning", "students", "TARA", "edtech"],
  authors: [{ name: "TARA Team" }],
  openGraph: {
    title: "TARA – AI-Powered Smart Learning Platform",
    description: "Turn Curiosity Into Superpowers with TARA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${nunito.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
