"use client";

import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import { searchMovies } from "../lib/tmdb"; // Import searchMovies

interface SearchResultsClientProps {
  initialQuery: string;
}

const SearchResultsClient: React.FC<SearchResultsClientProps> = ({ initialQuery }) => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!initialQuery || initialQuery.trim() === '') {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await searchMovies(initialQuery);
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
  }, [initialQuery]); // Re-fetch whenever initialQuery changes

  if (loading) {
    return <p className="text-center text-lg text-gray-600">Chargement des résultats...</p>;
  }

  if (error) {
    return <p className="text-center text-lg text-red-500">{error}</p>;
  }

  if (results.length === 0 && initialQuery.trim() !== '') {
    return <p className="text-center text-lg text-gray-600">Aucun film trouvé pour votre recherche "{initialQuery}".</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> {/* Changed grid-cols-1 to grid-cols-2 */}
      {results.map((item: any) => (
        <MovieCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default SearchResultsClient;
