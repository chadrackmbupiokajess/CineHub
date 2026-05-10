"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "../app/globals.css"; // Note the path change for globals.css
import Header from "../components/Header";
import Footer from "../components/Footer";
import { usePathname } from "next/navigation";
import { ReactNode } from "react"; // Import ReactNode

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function ClientLayoutWrapper({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const pathname = usePathname();
  const isWatchPage = pathname.startsWith("/watch/");

  return (
    <body className={`min-h-full flex flex-col bg-gray-100 text-gray-900 ${geistSans.variable} ${geistMono.variable} antialiased`}>
      {!isWatchPage && <Header />}
      <main className={`flex-1 ${!isWatchPage ? 'pt-16' : ''}`}>
        {children}
      </main>
      {!isWatchPage && <Footer />}
    </body>
  );
}
