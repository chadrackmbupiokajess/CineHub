"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import MovieCard from "./MovieCard";

interface InfiniteSearchListProps {
  initialItems: any[];
  query: string;
}

const InfiniteSearchList: React.FC<InfiniteSearchListProps> = ({ 
  initialItems, 
  query 
}) => {
  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore || !query) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}&page=${page + 1}`);
      const newItems = await response.json();
      
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems((prevItems) => [...prevItems, ...newItems]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, hasMore, query]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isLoading) {
        loadMore();
      }
    }, { threshold: 0.5 }); // Charge à 50% de la page

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loadMore, hasMore, isLoading]);

  if (items.length === 0) {
    return (
      <p className="text-center text-lg text-gray-600 dark:text-gray-400">
        Aucun film trouvé pour votre recherche.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {items.map((item: any) => (
          <MovieCard key={item.id} item={item} />
        ))}
      </div>
      
      {/* Loading indicator and observer target */}
      <div ref={observerTarget} className="py-8 text-center">
        {isLoading && (
          <p className="text-gray-600 dark:text-gray-400">Chargement en cours...</p>
        )}
        {!hasMore && items.length > 0 && (
          <p className="text-gray-600 dark:text-gray-400">Pas d'autres films à charger</p>
        )}
      </div>
    </>
  );
};

export default InfiniteSearchList;
