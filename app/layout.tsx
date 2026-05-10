"use client"; // This MUST be the very first line of the file.

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { usePathname } from "next/navigation";

// Metadata cannot be exported from a client component.
// If you need specific metadata for this layout, you'd define it in a parent server layout
// or directly in page.tsx files.

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isWatchPage = pathname.startsWith("/watch/");

  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-100 text-gray-900">
        {!isWatchPage && <Header />}
        <main className="flex-1 pt-20">
          {children}
        </main>
        {!isWatchPage && <Footer />}
      </body>
    </html>
  );
}
