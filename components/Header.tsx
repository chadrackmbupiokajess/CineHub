"use client"; // This component needs client-side interactivity

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      router.push(`/search?query=${encodeURIComponent(trimmedQuery)}`);
      // router.refresh(); // Removed router.refresh()
    } else if (pathname === '/search') {
      router.push('/');
      // router.refresh(); // Removed router.refresh()
    }
  };

  const handleFilterClick = (filter: string) => {
    if (filter === "all") {
      router.push("/");
    } else if (filter === "films") {
      router.push("/?type=movie");
    } else if (filter === "series") {
      router.push("/?type=tv");
    } else if (filter === "nouveaute") {
      router.push("/?type=new");
    } else if (filter === "documentaire") {
      router.push("/?type=documentary");
    } else if (filter === "maliste") {
      router.push("/watchlist");
    }
  };

  return (
    <header className="fixed top-0 w-full bg-gray-900 text-white p-4 shadow-md z-50">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-red-500 hover:text-red-400 transition-colors mr-8">
          <Image
            src="/logo.png"
            alt="CineHub Logo"
            width={120}
            height={40}
            priority
          />
        </Link>

        {/* Left Filters */}
        <nav className="flex items-center space-x-6 flex-1">
          <button
            onClick={() => handleFilterClick("all")}
            className="hover:text-red-400 transition-colors font-medium"
          >
            Tous
          </button>
          <button
            onClick={() => handleFilterClick("films")}
            className="hover:text-red-400 transition-colors font-medium"
          >
            Film
          </button>
          <button
            onClick={() => handleFilterClick("series")}
            className="hover:text-red-400 transition-colors font-medium"
          >
          Série
          </button>
          <button
            onClick={() => handleFilterClick("nouveaute")}
            className="hover:text-red-400 transition-colors font-medium"
          >
            Nouveauté
          </button>
          <button
            onClick={() => handleFilterClick("documentaire")}
            className="hover:text-red-400 transition-colors font-medium"
          >
            Documentaire
          </button>
          <button
            onClick={() => handleFilterClick("maliste")}
            className="hover:text-red-400 transition-colors font-medium"
          >
            Ma liste
          </button>
        </nav>

        {/* Search Bar and Profile */}
        <div className="flex items-center gap-6">
          {/* Search Input with integrated icon */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Rechercher un film..."
              className="p-2 pr-10 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 w-64"
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-white hover:text-red-400 transition-colors"
              aria-label="Rechercher"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </form>

          {/* Profile Circle */}
          <div className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors cursor-pointer flex items-center justify-center">
            <span className="text-white font-bold">👤</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
