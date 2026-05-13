"use client";

import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import { searchMovies } from "../lib/tmdb"; // Only searchMovies is needed here

interface SearchResultsClientProps {
  initialQuery: string;
  initialGenreId?: string; // Add initialGenreId prop
  initialYear?: string;    // Add initialYear prop
}

const SearchResultsClient: React.FC<SearchResultsClientProps> = ({ initialQuery, initialGenreId, initialYear }) => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Effect to fetch search results with filters
  useEffect(() => {
    const fetchResults = async () => {
      const currentQuery = initialQuery.trim();

      // If no query and no filters, show no results
      if (!currentQuery && !initialGenreId && !initialYear) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await searchMovies(currentQuery, 1, initialGenreId, initialYear);
        setResults(data.results);
      } catch (err: any) {
        console.error("Error fetching search results:", err);
        setError("Impossible de charger les résultats de recherche. Veuillez réessayer.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [initialQuery, initialGenreId, initialYear]); // Re-fetch when query or filters change

  if (loading) {
    return <p className="text-center text-lg text-gray-600 dark:text-gray-400">Chargement des résultats...</p>;
  }

  if (error) {
    return <p className="text-center text-lg text-red-500">{error}</p>;
  }

  const showNoResultsMessage = results.length === 0 && (initialQuery.trim() !== '' || initialGenreId !== '' || initialYear !== '');

  return (
    <div>
      {showNoResultsMessage ? (
        <p className="text-center text-lg text-gray-600 dark:text-gray-400">
          Aucun film trouvé pour votre recherche avec les filtres appliqués.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((item: any) => (
            <MovieCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsClient;
