import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Church - Fellowship of the Believers",
  description: "Authentic New Testament fellowship principles and community.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 dark:bg-apple-dark dark:text-white min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
