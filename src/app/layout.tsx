import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Church - Fellowship of the Believers",
  description: "Discover authentic New Testament fellowship principles. Learn about the priesthood of all believers, participatory worship, and biblical community as practiced in the early church.",
  keywords: ["New Testament church", "Biblical fellowship", "Priesthood of all believers", "House church principles", "Christian community", "Early church practices"],
  authors: [{ name: "The Church - Fellowship of the Believers" }],
  creator: "The Church - Fellowship of the Believers",
  publisher: "The Church - Fellowship of the Believers",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "The Church - Fellowship of the Believers",
    description: "Discover authentic New Testament fellowship principles. Learn about the priesthood of all believers, participatory worship, and biblical community as practiced in the early church.",
    url: 'http://localhost:3000',
    siteName: 'The Church - Fellowship of the Believers',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "The Church - Fellowship of the Believers",
    description: "Discover authentic New Testament fellowship principles. Learn about the priesthood of all believers, participatory worship, and biblical community as practiced in the early church.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geist.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
