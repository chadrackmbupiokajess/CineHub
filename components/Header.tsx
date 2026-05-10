"use client"; // This component needs client-side interactivity

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
// import ThemeToggle from "./ThemeToggle"; // Removed ThemeToggle import

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSearchIconClick = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      // Focus input when opening
      setTimeout(() => {
        const input = document.getElementById("search-input") as HTMLInputElement;
        if (input) input.focus();
      }, 0);
    } else {
      setSearchQuery("");
    }
  };

  const handleFilterClick = (filter: string) => {
    if (filter === "films") {
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
    <header className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-red-500 hover:text-red-400 transition-colors mr-8">
          CineHub
        </Link>

        {/* Left Filters */}
        <nav className="flex items-center space-x-6 flex-1">
          <button
            onClick={() => router.push("/")}
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
          {/* Search Bar */}
          <div className="flex items-center gap-2">
            {searchOpen && (
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Rechercher un film..."
                className="p-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 w-64"
                onBlur={() => {
                  if (!searchQuery) {
                    setSearchOpen(false);
                  }
                }}
              />
            )}
            <button
              onClick={handleSearchIconClick}
              className="text-white hover:text-red-400 transition-colors"
              title="Rechercher"
            >
              <svg
                width="24"
                height="24"
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
          </div>

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
