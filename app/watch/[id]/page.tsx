"use client"; // This page will contain client-side interactivity (iframe)

import { useParams, useRouter } from "next/navigation"; // Import useRouter
import { useEffect, useState } from "react";

export default function WatchMoviePage() {
  const params = useParams();
  const movieId = params.id as string;
  const router = useRouter(); // Initialize useRouter

  // Removed isFullScreen state
  const [showBackButton, setShowBackButton] = useState(false); // State to control back button visibility

  const vidsrcUrl = `https://vidsrc.me/embed/movie?tmdb=${movieId}&ds_lang=fr&autoplay=1`;

  // Removed useEffect for automatic fullscreen attempt

  return (
    <div
      className="w-screen h-screen bg-black relative"
      onMouseEnter={() => setShowBackButton(true)}
      onMouseLeave={() => setShowBackButton(false)}
    >
      <iframe
        src={vidsrcUrl}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
        frameBorder="0"
        className="w-full h-full"
        title={`Watch movie ${movieId}`}
      ></iframe>

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className={`absolute top-4 left-4 p-3 bg-gray-800 bg-opacity-75 rounded-full text-white transition-opacity duration-300 z-50
          ${showBackButton ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-label="Retour"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
    </div>
  );
}
