"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import MovieCard from "./MovieCard";
import { discoverMovies } from "../lib/tmdb"; // Import discoverMovies

interface DiscoverResultsClientProps {
  initialGenreId?: string;
  initialYear?: string;
}

const DiscoverResultsClient: React.FC<DiscoverResultsClientProps> = ({ initialGenreId, initialYear }) => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const fetchResults = useCallback(async (pageNum: number, isLoadMore: boolean = false) => {
    // If no filters are applied, don't fetch anything yet
    if (!initialGenreId && !initialYear) {
      setResults([]);
      setLoading(false);
      setHasMore(false);
      return;
    }

    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const data = await discoverMovies(pageNum, initialGenreId, initialYear);
      const newResults = data.results || [];

      if (isLoadMore) {
        setResults(prev => [...prev, ...newResults]);
      } else {
        setResults(newResults);
      }

      // Check if there are more pages
      setHasMore(newResults.length > 0 && data.page < data.total_pages);
    } catch (err: any) {
      console.error("Error fetching discover results:", err);
      setError("Impossible de charger les films. Veuillez réessayer.");
      if (!isLoadMore) {
        setResults([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [initialGenreId, initialYear]);

  // Initial fetch
  useEffect(() => {
    setPage(1);
    setResults([]);
    setHasMore(true);
    fetchResults(1, false);
  }, [initialGenreId, initialYear, fetchResults]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchResults(nextPage, true);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, loadingMore, page, fetchResults]);

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
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {results.map((item: any) => (
          <MovieCard key={`${item.id}-${page}`} item={item} />
        ))}
      </div>
      {hasMore && (
        <div ref={loadMoreRef} className="text-center py-8">
          {loadingMore && <p className="text-lg text-gray-600 dark:text-gray-400">Chargement de plus de résultats...</p>}
        </div>
      )}
    </>
  );
};

export default DiscoverResultsClient;
