"use client"; // This component needs client-side interactivity

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
// import ThemeToggle from "./ThemeToggle"; // Removed ThemeToggle import

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); // Clear search input after submission
    }
  };

  const handleFilterClick = (filter: string) => {
    setFilterOpen(false);
    if (filter === "films") {
      router.push("/?type=movie");
    } else if (filter === "series") {
      router.push("/?type=tv");
    } else if (filter === "tendance") {
      router.push("/?type=trending");
    } else if (filter === "maliste") {
      router.push("/watchlist");
    }
  };

  return (
    <header className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <Link href="/" className="text-2xl font-bold text-red-500 hover:text-red-400 transition-colors">
          CineHub
        </Link>
        <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un film..."
            className="p-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
          />
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
          >
            Rechercher
          </button>
        </form>
        <nav className="flex items-center space-x-4 relative">
          {/* Removed ThemeToggle */}
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="hover:text-gray-300 transition-colors">
                Accueil
              </Link>
            </li>
            <li className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="hover:text-gray-300 transition-colors flex items-center gap-1"
              >
                Filtres ▼
              </button>
              {filterOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                  <button
                    onClick={() => handleFilterClick("films")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors first:rounded-t-lg"
                  >
                    🎬 Films
                  </button>
                  <button
                    onClick={() => handleFilterClick("series")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors"
                  >
                    📺 Séries
                  </button>
                  <button
                    onClick={() => handleFilterClick("tendance")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors"
                  >
                    🔥 Tendance
                  </button>
                  <button
                    onClick={() => handleFilterClick("maliste")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors last:rounded-b-lg"
                  >
                    ❤️ Ma liste
                  </button>
                </div>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
