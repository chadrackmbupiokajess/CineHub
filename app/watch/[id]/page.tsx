"use client"; // This page will contain client-side interactivity (iframe)

import { useParams, useRouter } from "next/navigation"; // Import useRouter
import { useEffect, useState } from "react";

export default function WatchMoviePage() {
  const params = useParams();
  const movieId = params.id as string;
  const router = useRouter(); // Initialize useRouter

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false); // State to control back button visibility

  const vidsrcUrl = `https://vidsrc.me/embed/movie?tmdb=${movieId}`;

  useEffect(() => {
    // Attempt to go full screen when the component mounts
    const elem = document.documentElement; // Target the whole document
    if (elem.requestFullscreen) {
      elem.requestFullscreen().then(() => setIsFullScreen(true)).catch(() => setIsFullScreen(false));
    } else if ((elem as any).mozRequestFullScreen) { /* Firefox */
      (elem as any).mozRequestFullScreen().then(() => setIsFullScreen(true)).catch(() => setIsFullScreen(false));
    } else if ((elem as any).webkitRequestFullscreen) { /* Chrome, Safari & Opera */
      (elem as any).webkitRequestFullscreen().then(() => setIsFullScreen(true)).catch(() => setIsFullScreen(false));
    } else if ((elem as any).msRequestFullscreen) { /* IE/Edge */
      (elem as any).msRequestFullscreen().then(() => setIsFullScreen(true)).catch(() => setIsFullScreen(false));
    }

    // Listen for fullscreen change events
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div
      className="w-screen h-screen bg-black relative"
      onMouseEnter={() => setShowBackButton(true)}
      onMouseLeave={() => setShowBackButton(false)}
    >
      <iframe
        src={vidsrcUrl}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" // Expanded allow permissions
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
