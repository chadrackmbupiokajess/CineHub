"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import MovieCard from "../../components/MovieCard";
import { getMovieDetails } from "../../lib/tmdb";

interface FavoriteMovie {
  id: number;
  title: string;
}

export default function FavoritesPage() {
  const [favoriteMovies, setFavoriteMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const favorites: FavoriteMovie[] = JSON.parse(localStorage.getItem("favorites") || "[]");

        if (favorites.length === 0) {
          setFavoriteMovies([]);
          setLoading(false);
          return;
        }

        const movieDetailsPromises = favorites.map(async (fav) => {
          try {
            const details = await getMovieDetails(fav.id);
            return details;
          } catch (detailError) {
            console.error(`Failed to fetch details for movie ID ${fav.id}:`, detailError);
            return null; // Return null for movies that failed to fetch
          }
        });

        const details = await Promise.all(movieDetailsPromises);
        // Filter out any nulls if fetching details failed for some movies
        setFavoriteMovies(details.filter(Boolean));
      } catch (e: any) {
        console.error("Failed to load favorites:", e);
        setError("Impossible de charger les films favoris.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center pt-20 md:pt-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Mes Favoris</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Chargement de vos films favoris...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center pt-20 md:pt-8">
        <h1 className="text-3xl font-bold text-red-500 mb-6">Erreur</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">{error}</p>
        <Link href="/" className="text-blue-500 hover:underline inline-block mt-4">
          &larr; Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 pt-20 md:pt-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Mes Favoris</h1>

      {/* Quick Menu Links */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        <Link
          href="/favorites"
          className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-medium"
        >
          ⭐ Mes favoris
        </Link>
        <Link
          href="/profile"
          className="px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors font-medium"
        >
          👤 Mon profil
        </Link>
        <Link
          href="/about"
          className="px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors font-medium"
        >
          ℹ️ À propos
        </Link>
      </div>

      {favoriteMovies.length === 0 ? (
        <div className="text-center text-lg text-gray-600 dark:text-gray-400 mt-10">
          <p>Vous n'avez pas encore ajouté de films à vos favoris.</p>
          <Link href="/" className="text-blue-500 hover:underline inline-block mt-4">
            Parcourir les films
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {favoriteMovies.map((movie) => (
            <MovieCard key={movie.id} item={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
