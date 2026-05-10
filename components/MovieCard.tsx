"use client"; // Mark as client component

import Image from "next/image";
import Link from "next/link";

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    poster_path: string | null;
    vote_average: number;
  };
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/no-image-placeholder.svg";

  return (
    <Link href={`/movies/${movie.id}`} className="block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform transition-transform duration-200 hover:scale-105 cursor-pointer">
      <div className="relative w-full h-96">
        <Image
          src={imageUrl}
          alt={movie.title}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 truncate">{movie.title}</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Note: {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"} / 10
        </p>
      </div>
    </Link>
  );
};

export default MovieCard;
