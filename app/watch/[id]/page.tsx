"use client"; // This page will contain client-side interactivity (iframe)

import { useParams, useRouter } from "next/navigation"; // Import useRouter
import { useEffect, useState } from "react";

export default function WatchMoviePage() {
  const params = useParams();
  const movieId = params.id as string;
  const router = useRouter(); // Initialize useRouter

  // Removed isFullScreen state
  const [showBackButton, setShowBackButton] = useState(false); // State to control back button visibility
  const [language, setLanguage] = useState<'vf' | 'vostfr'>('vf'); // Language selection: VF or VOSTFR

  const getVideoUrl = () => {
    if (language === 'vf') {
      return `https://www.2embed.cc/embed/${movieId}`;
    } else {
      return `https://vidsrc.me/embed/movie?tmdb=${movieId}&ds_lang=fr&autoplay=1`;
    }
  };

  const videoUrl = getVideoUrl();

  // Removed useEffect for automatic fullscreen attempt

  return (
    <div
      className="w-screen h-screen bg-black relative"
      onMouseEnter={() => setShowBackButton(true)}
      onMouseLeave={() => setShowBackButton(false)}
    >
      <iframe
        src={videoUrl}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
        frameBorder="0"
        className="w-full h-full"
        title={`Watch movie ${movieId}`}
        key={language} // Force re-render when language changes
      ></iframe>

      {/* Language Selector */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2 z-50">
        <button
          onClick={() => setLanguage('vf')}
          className={`px-4 py-2 rounded-full font-bold transition-colors duration-200 ${
            language === 'vf'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 bg-opacity-75 text-gray-300 hover:bg-gray-700'
          }`}
        >
          VF
        </button>
        <button
          onClick={() => setLanguage('vostfr')}
          className={`px-4 py-2 rounded-full font-bold transition-colors duration-200 ${
            language === 'vostfr'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 bg-opacity-75 text-gray-300 hover:bg-gray-700'
          }`}
        >
          VOSTFR
        </button>
      </div>

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
