"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface TrendingItem {
  id: number;
  title?: string; // For movies
  name?: string; // For TV shows
  overview: string;
  backdrop_path: string | null;
  release_date?: string; // For movies
  first_air_date?: string; // For TV shows
  media_type: "movie" | "tv";
}

interface HeroCarouselProps {
  items: TrendingItem[];
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 8000); // Change slide every 8 seconds

    return () => clearInterval(interval);
  }, [items.length]);

  if (!items || items.length === 0) {
    return null;
  }

  const currentItem = items[currentIndex];
  const title = currentItem.title || currentItem.name;
  const releaseDate = currentItem.release_date || currentItem.first_air_date;
  const detailsPath = `/${currentItem.media_type === "movie" ? "movies" : "tv"}/${currentItem.id}`; // Assuming TV show details page will be /tv/[id]

  const backdropUrl = currentItem.backdrop_path
    ? `https://image.tmdb.org/t/p/original${currentItem.backdrop_path}`
    : "/no-image-placeholder.svg"; // Use a larger placeholder for backdrop

  return (
    <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
      {/* Background Image */}
      <Image
        src={backdropUrl}
        alt={title || "Trending Item"}
        layout="fill"
        objectFit="cover"
        priority
        className="absolute inset-0 z-0"
      />

      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10"></div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white z-20">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
          {title}
        </h2>
        <p className="text-base md:text-lg max-w-2xl mb-6 line-clamp-3 drop-shadow-md">
          {currentItem.overview || "Description non disponible."}
        </p>
        <div className="flex items-center gap-4 mb-8">
          {releaseDate && (
            <span className="text-sm md:text-base bg-red-600 px-3 py-1 rounded-full font-semibold">
              {new Date(releaseDate).getFullYear()}
            </span>
          )}
          <Link href={detailsPath} className="inline-flex items-center px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors duration-200 shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
            Lecture
          </Link>
        </div>

        {/* Navigation Dots */}
        <div className="flex space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-red-600 w-6" : "bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;
