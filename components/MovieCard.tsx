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
}

interface MovieCardProps {
  item: MediaItem;
}

const MovieCard: React.FC<MovieCardProps> = ({ item }) => {
  const imageUrl = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : "/no-image-placeholder.svg";

  const displayTitle = item.title || item.name;
  const mediaTypePath = item.media_type === "tv" ? "tv" : "movies"; // Default to "movies" if not specified

  return (
    <Link href={`/${mediaTypePath}/${item.id}`} className="block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform transition-transform duration-200 hover:scale-105 cursor-pointer">
      <div className="relative w-full h-96">
        <Image
          src={imageUrl}
          alt={displayTitle || "Media Item"}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 truncate">{displayTitle}</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Note: {item.vote_average ? item.vote_average.toFixed(1) : "N/A"} / 10
        </p>
      </div>
    </Link>
  );
};

export default MovieCard;
