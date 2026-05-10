"use client"; // Mark as client component

import Image from "next/image";
import Link from "next/link";

interface MediaItem {
  id: number;
  title?: string; // For movies
  name?: string; // For TV shows
  poster_path: string | null;
  vote_average: number;
  media_type?: "movie" | "tv"; // Optional, will default to movie if not provided
  overview?: string; // Description
  release_date?: string; // For movies
  first_air_date?: string; // For TV shows
  genres?: Array<{ id: number; name: string }>; // For details page
}

interface MovieCardProps {
  item: MediaItem;
}

const MovieCard: React.FC<MovieCardProps> = ({ item }) => {
  const imageUrl = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : "/no-image-placeholder.svg";

  const displayTitle = item.title || item.name;
  const mediaTypePath = item.media_type === "tv" ? "tv" : "movies";
  const releaseDate = item.release_date || item.first_air_date || null;

  // Format date as "Mercredi, 30/03/2025"
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const dayName = days[date.getUTCDay()];
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${dayName}, ${day}/${month}/${year}`;
  };

  const overview = item.overview || "";
  const truncatedOverview = overview.length > 100 ? overview.substring(0, 100) + "..." : overview;

  return (
    <Link href={`/${mediaTypePath}/${item.id}`} className="block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform transition-transform duration-200 hover:scale-105 cursor-pointer h-full flex flex-col">
      {/* Affiche */}
      <div className="relative w-full h-48">
        <Image
          src={imageUrl}
          alt={displayTitle || "Media Item"}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>

      {/* Contenu */}
      <div className="p-3 flex-1 flex flex-col">
        {/* Titre */}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{displayTitle}</h2>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-2 mb-2">{truncatedOverview}</p>

        {/* Date */}
        <p className="text-gray-600 dark:text-gray-400 text-xs mb-3 font-bold">{formatDate(releaseDate)}</p>

        {/* Note */}
        <div className="mt-auto">
          <p className="text-yellow-500 dark:text-yellow-400 text-xs font-semibold">
            ⭐ {item.vote_average ? item.vote_average.toFixed(1) : "N/A"} / 10
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
