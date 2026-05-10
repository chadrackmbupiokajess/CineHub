"use client"; // This component needs client-side interactivity

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { searchMovies } from "../lib/tmdb"; // Import searchMovies for suggestions

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchInputRef = useRef<HTMLInputElement>(null); // Ref for the search input

  // Debounce logic for fetching suggestions
  useEffect(() => {
    const handler = setTimeout(async () => {
      const trimmedQuery = searchQuery.trim();
      if (trimmedQuery.length > 2) { // Only fetch suggestions if query is at least 3 characters
        try {
          const data = await searchMovies(trimmedQuery);
          setSuggestions(data.results.slice(0, 5)); // Limit to top 5 suggestions
          setShowSuggestions(true);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300); // 300ms debounce delay for suggestions

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle form submission (Enter key or click on search icon)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      router.push(`/search?query=${encodeURIComponent(trimmedQuery)}`);
      setShowSuggestions(false); // Hide suggestions after full search
    } else if (pathname === '/search') {
      router.push('/');
      setShowSuggestions(false); // Hide suggestions
    }
  };

  // Handle click on a suggestion
  const handleSuggestionClick = (suggestionTitle: string) => {
    setSearchQuery(suggestionTitle);
    router.push(`/search?query=${encodeURIComponent(suggestionTitle)}`);
    setShowSuggestions(false); // Hide suggestions
  };

  // Hide suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


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
    setShowSuggestions(false); // Hide suggestions when clicking a filter
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
          {/* Search Input with integrated icon and suggestions */}
          <form onSubmit={handleSearchSubmit} className="relative" ref={searchInputRef}>
            <input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Rechercher un film..."
              className="p-2 pr-10 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 w-80" // Changed w-64 to w-80
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

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="p-2 cursor-pointer hover:bg-gray-700 text-white truncate"
                    onClick={() => handleSuggestionClick(suggestion.title || suggestion.name)}
                  >
                    {suggestion.title || suggestion.name} ({suggestion.release_date?.substring(0, 4) || suggestion.first_air_date?.substring(0, 4)})
                  </div>
                ))}
              </div>
            )}
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
