"use client"; // This page will contain client-side interactivity (iframe)

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function WatchMoviePage() {
  const params = useParams();
  const movieId = params.id as string;
  const [isFullScreen, setIsFullScreen] = useState(false);

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
    <div className="w-screen h-screen bg-black flex items-center justify-center">
      <iframe
        src={vidsrcUrl}
        allowFullScreen
        frameBorder="0"
        className="w-full h-full"
        title={`Watch movie ${movieId}`}
      ></iframe>
      {!isFullScreen && (
        <div className="absolute top-0 left-0 right-0 p-4 bg-red-600 text-white text-center">
          Cliquez sur le bouton plein écran du lecteur si le mode plein écran automatique ne fonctionne pas.
        </div>
      )}
    </div>
  );
}
