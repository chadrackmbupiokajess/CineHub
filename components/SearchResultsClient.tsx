"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const fetchResults = useCallback(async (pageNum: number, isLoadMore: boolean = false) => {
    const currentQuery = initialQuery.trim();

    // If no query and no filters, show no results
    if (!currentQuery && !initialGenreId && !initialYear) {
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
      const data = await searchMovies(currentQuery, pageNum, initialGenreId, initialYear);
      const newResults = (data.results || []).map((item: any) => ({
        ...item,
        media_type: item.media_type || 'movie' // Preserve media_type from API or default to movie
      }));

      if (isLoadMore) {
        setResults(prev => [...prev, ...newResults]);
      } else {
        setResults(newResults);
      }

      // Check if there are more pages
      setHasMore(newResults.length > 0 && data.page < data.total_pages);
    } catch (err: any) {
      console.error("Error fetching search results:", err);
      setError("Impossible de charger les résultats de recherche. Veuillez réessayer.");
      if (!isLoadMore) {
        setResults([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [initialQuery, initialGenreId, initialYear]);

  // Initial fetch
  useEffect(() => {
    setPage(1);
    setResults([]);
    setHasMore(true);
    fetchResults(1, false);
  }, [initialQuery, initialGenreId, initialYear, fetchResults]);

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
      )}
    </div>
  );
};

export default SearchResultsClient;
