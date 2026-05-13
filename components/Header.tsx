"use client"; // This component needs client-side interactivity

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { searchMovies, getGenres } from "../lib/tmdb"; // Import getGenres

interface Genre {
  id: number;
  name: string;
}

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false); // State for filter menu visibility
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenreId, setSelectedGenreId] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const router = useRouter();
  const pathname = usePathname();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const avatarMenuRef = useRef<HTMLDivElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null); // Ref for filter menu

  // Fetch genres on component mount
  useEffect(() => {
    const fetchGenresData = async () => {
      try {
        const data = await getGenres("movie");
        setGenres(data.genres);
      } catch (err) {
        console.error("Error fetching genres:", err);
      }
    };
    fetchGenresData();
  }, []);

  // Debounce logic for fetching suggestions
  useEffect(() => {
    const handler = setTimeout(async () => {
      const trimmedQuery = searchQuery.trim();
      if (trimmedQuery.length > 2) {
        try {
          const data = await searchMovies(trimmedQuery);
          setSuggestions(data.results.slice(0, 5));
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
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();

    const params = new URLSearchParams();
    if (trimmedQuery) {
      params.set("query", trimmedQuery);
    }
    if (selectedGenreId) {
      params.set("genre", selectedGenreId);
    }
    if (selectedYear) {
      params.set("year", selectedYear);
    }

    const queryString = params.toString();

    if (trimmedQuery) {
      router.push(`/search?${queryString}`);
    } else if (selectedGenreId || selectedYear) {
      router.push(`/discover?${queryString}`);
    } else {
      router.push("/"); // Or some default page if nothing is selected
    }

    setShowSuggestions(false);
    setMenuOpen(false);
    setShowFilterMenu(false); // Close filter menu after search
  };

  const handleSuggestionClick = (suggestionTitle: string) => {
    setSearchQuery(suggestionTitle);
    const params = new URLSearchParams();
    params.set("query", suggestionTitle);
    if (selectedGenreId) {
      params.set("genre", selectedGenreId);
    }
    if (selectedYear) {
      params.set("year", selectedYear);
    }
    router.push(`/search?${params.toString()}`);
    setShowSuggestions(false);
    setMenuOpen(false);
    setShowFilterMenu(false);
  };

  // Close suggestions and menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        const suggestionsDropdown = document.getElementById('suggestions-dropdown');
        if (suggestionsDropdown && suggestionsDropdown.contains(event.target as Node)) {
          return;
        }
        setShowSuggestions(false);
      }
      
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(event.target as Node)) {
        setAvatarMenuOpen(false);
      }

      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setShowFilterMenu(false);
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
    setShowSuggestions(false);
    setMenuOpen(false);
    setShowFilterMenu(false);
  };

  const handleAvatarMenuClick = (action: string) => {
    setAvatarMenuOpen(false);
    if (action === "favorites") {
      router.push("/favorites");
    } else if (action === "profile") {
      router.push("/profile");
    } else if (action === "logout") {
      // TODO: Implement logout logic
      console.log("Logout clicked");
    } else if (action === "about") {
      router.push("/about");
    }
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenreId(e.target.value);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

  return (
    <header className="fixed top-0 w-full bg-gray-900 text-white p-4 shadow-md z-50">
      <div className="container mx-auto">
        {/* Top Row: Logo | Menu/Filters, Search, Profile, Hamburger+Avatar */}
        <div className="flex justify-between items-center gap-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-red-500 hover:text-red-400 transition-colors flex-shrink-0">
            <Image
              src="/logo.png"
              alt="CineHub Logo"
              width={120}
              height={40}
              priority
            />
          </Link>

          {/* Desktop Menu (always visible on lg+) */}
          <nav className="hidden lg:flex gap-6 flex-1 items-center ml-8">
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
            {/* Filter Icon for Desktop Menu */}
            <div className="relative" ref={filterMenuRef}>
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="flex items-center p-2 rounded-full hover:bg-gray-700 transition-colors"
                aria-label="Ouvrir les filtres"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {showFilterMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 p-3">
                  <select
                    value={selectedGenreId}
                    onChange={handleGenreChange}
                    className="w-full p-2 mb-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Tous les genres</option>
                    {genres.map((genre) => (
                      <option key={genre.id} value={genre.id}>
                        {genre.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedYear}
                    onChange={handleYearChange}
                    className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Toutes les années</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleSearchSubmit} // Use handleSearchSubmit to apply filters
                    className="w-full mt-3 px-4 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 transition-colors"
                  >
                    Appliquer
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Center/Right Section: Search and Profile */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} className="relative hidden sm:block">
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder="Rechercher..."
                className="p-2 pr-10 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 w-48 lg:w-64"
                ref={searchInputRef}
                onFocus={() => searchQuery.trim().length > 2 && suggestions.length > 0 && setShowSuggestions(true)}
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
                <div id="suggestions-dropdown" className="absolute left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="p-2 cursor-pointer hover:bg-gray-700 text-white truncate text-sm"
                      onClick={() => handleSuggestionClick(suggestion.title || suggestion.name)}
                    >
                      {suggestion.title || suggestion.name} ({suggestion.release_date?.substring(0, 4) || suggestion.first_air_date?.substring(0, 4)})
                    </div>
                  ))}
                </div>
              )}
            </form>

            {/* Avatar (Desktop Only) */}
            <div 
              className="hidden lg:flex relative" 
              ref={avatarMenuRef}
            >
              <button
                onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                className="w-10 h-10 rounded-full bg-gray-700 cursor-pointer flex items-center justify-center flex-shrink-0"
              >
                <span className="text-white font-bold text-lg">👤</span>
              </button>

              {/* Avatar Dropdown Menu */}
              {avatarMenuOpen && (
                <div className="absolute right-0 mt-12 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50">
                  <button
                    onClick={() => handleAvatarMenuClick("favorites")}
                    className="w-full text-left px-4 py-3 hover:bg-gray-700 text-white transition-colors font-medium"
                  >
                    ⭐ Mes favoris
                  </button>
                  <button
                    onClick={() => handleAvatarMenuClick("profile")}
                    className="w-full text-left px-4 py-3 hover:bg-gray-700 text-white transition-colors font-medium border-t border-gray-700"
                  >
                    👤 Mon profil
                  </button>
                  <button
                    onClick={() => handleAvatarMenuClick("about")}
                    className="w-full text-left px-4 py-3 hover:bg-gray-700 text-white transition-colors font-medium border-t border-gray-700"
                  >
                    ℹ️ À propos
                  </button>
                  <button
                    onClick={() => handleAvatarMenuClick("logout")}
                    className="w-full text-left px-4 py-3 hover:bg-red-600 text-white transition-colors font-medium border-t border-gray-700"
                  >
                    🚪 Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Hamburger Menu + Avatar (Mobile/Tablet) - RIGHT */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Filter Icon for Mobile Menu */}
            <div className="relative" ref={filterMenuRef}>
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="flex items-center p-2 rounded-full hover:bg-gray-700 transition-colors"
                aria-label="Ouvrir les filtres"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {showFilterMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 p-3">
                  <select
                    value={selectedGenreId}
                    onChange={handleGenreChange}
                    className="w-full p-2 mb-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Tous les genres</option>
                    {genres.map((genre) => (
                      <option key={genre.id} value={genre.id}>
                        {genre.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedYear}
                    onChange={handleYearChange}
                    className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Toutes les années</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleSearchSubmit} // Use handleSearchSubmit to apply filters
                    className="w-full mt-3 px-4 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 transition-colors"
                  >
                    Appliquer
                  </button>
                </div>
              )}
            </div>

            {/* Avatar with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                className="w-10 h-10 rounded-full bg-gray-700 cursor-pointer flex items-center justify-center flex-shrink-0"
              >
                <span className="text-white font-bold text-lg">👤</span>
              </button>

              {/* Avatar Dropdown Menu (Mobile) */}
              {avatarMenuOpen && (
                <div className="absolute right-0 mt-10 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50">
                  <button
                    onClick={() => handleAvatarMenuClick("favorites")}
                    className="w-full text-left px-4 py-3 hover:bg-gray-700 text-white transition-colors font-medium"
                  >
                    ⭐ Mes favoris
                  </button>
                  <button
                    onClick={() => handleAvatarMenuClick("profile")}
                    className="w-full text-left px-4 py-3 hover:bg-gray-700 text-white transition-colors font-medium border-t border-gray-700"
                  >
                    👤 Mon profil
                  </button>
                  <button
                    onClick={() => handleAvatarMenuClick("about")}
                    className="w-full text-left px-4 py-3 hover:bg-gray-700 text-white transition-colors font-medium border-t border-gray-700"
                  >
                    ℹ️ À propos
                  </button>
                  <button
                    onClick={() => handleAvatarMenuClick("logout")}
                    className="w-full text-left px-4 py-3 hover:bg-red-600 text-white transition-colors font-medium border-t border-gray-700"
                  >
                    🚪 Déconnexion
                  </button>
                </div>
              )}
            </div>
            
            {/* Hamburger Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex flex-col gap-1.5 p-2"
              aria-label="Menu"
            >
              <span className={`w-6 h-0.5 bg-white transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-white transition-opacity ${menuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-white transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Navigation (Collapsible) */}
        <nav className={`lg:hidden mt-4 ${menuOpen ? 'flex flex-col gap-2 pt-4 border-t border-gray-700' : 'hidden'}`}>
          <button
            onClick={() => handleFilterClick("all")}
            className="hover:text-red-400 transition-colors font-medium text-left py-2"
          >
            Tous
          </button>
          <button
            onClick={() => handleFilterClick("films")}
            className="hover:text-red-400 transition-colors font-medium text-left py-2"
          >
            Film
          </button>
          <button
            onClick={() => handleFilterClick("series")}
            className="hover:text-red-400 transition-colors font-medium text-left py-2"
          >
            Série
          </button>
          <button
            onClick={() => handleFilterClick("nouveaute")}
            className="hover:text-red-400 transition-colors font-medium text-left py-2"
          >
            Nouveauté
          </button>
          <button
            onClick={() => handleFilterClick("documentaire")}
            className="hover:text-red-400 transition-colors font-medium text-left py-2"
          >
            Documentaire
          </button>
          <button
            onClick={() => handleFilterClick("maliste")}
            className="hover:text-red-400 transition-colors font-medium text-left py-2"
          >
            Ma liste
          </button>

          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative mt-4 sm:hidden">
            <input
              id="search-input-mobile"
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Rechercher un film..."
              className="p-2 pr-10 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
              onFocus={() => searchQuery.trim().length > 2 && suggestions.length > 0 && setShowSuggestions(true)}
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

            {/* Mobile Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div id="suggestions-dropdown-mobile" className="absolute left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="p-2 cursor-pointer hover:bg-gray-700 text-white truncate text-sm"
                    onClick={() => handleSuggestionClick(suggestion.title || suggestion.name)}
                  >
                    {suggestion.title || suggestion.name}
                  </div>
                ))}
              </div>
            )}
          </form>
        </nav>
      </div>
    </header>
  );
};

export default Header;
