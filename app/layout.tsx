import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
// import { ThemeProvider } from "../lib/ThemeContext"; // Removed ThemeProvider import

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CineHub - Votre destination film",
  description: "Découvrez et explorez des films avec CineHub, propulsé par TMDb.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* Removed ThemeProvider */}
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
      </body>
    </html>
  );
}
