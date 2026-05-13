"use client";

import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import { discoverMovies } from "../lib/tmdb"; // Import discoverMovies

interface DiscoverResultsClientProps {
  initialGenreId?: string;
  initialYear?: string;
}

const DiscoverResultsClient: React.FC<DiscoverResultsClientProps> = ({ initialGenreId, initialYear }) => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      // If no filters are applied, don't fetch anything yet
      if (!initialGenreId && !initialYear) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await discoverMovies(1, initialGenreId, initialYear);
        setResults(data.results);
      } catch (err: any) {
        console.error("Error fetching discover results:", err);
        setError("Impossible de charger les films. Veuillez réessayer.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [initialGenreId, initialYear]); // Re-fetch whenever filters change

  if (loading) {
    return <p className="text-center text-lg text-gray-600 dark:text-gray-400">Chargement des films...</p>;
  }

  if (error) {
    return <p className="text-center text-lg text-red-500">{error}</p>;
  }

  if (results.length === 0) {
    return <p className="text-center text-lg text-gray-600 dark:text-gray-400">Aucun film trouvé avec ces filtres.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {results.map((item: any) => (
        <MovieCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default DiscoverResultsClient;
