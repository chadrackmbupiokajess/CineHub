"use client";

import React, { useEffect, useState } from "react";

interface TrailerPlayerProps {
  videoKey: string;
  title: string;
  delay?: number; // Delay in milliseconds before autoplay/visibility
  isBackground?: boolean; // New prop to indicate if it's a background video
}

const TrailerPlayer: React.FC<TrailerPlayerProps> = ({ videoKey, title, delay = 3000, isBackground = false }) => {
  const initialEmbedUrl = `https://www.youtube.com/embed/${videoKey}?controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&fs=0`;

  // Initialize src directly if it's a background video, otherwise start empty
  const [src, setSrc] = useState(isBackground ? `${initialEmbedUrl}&autoplay=1&loop=1&playlist=${videoKey}&start=0` : "");
  const [iframeOpacity, setIframeOpacity] = useState(isBackground ? 0 : 1);

  useEffect(() => {
    // Only run logic for non-background videos or for background video opacity transition
    if (isBackground) {
      // For background videos, src is already set. Just handle opacity transition.
      const opacityTimer = setTimeout(() => {
        setIframeOpacity(1);
      }, delay);
      return () => clearTimeout(opacityTimer);
    } else {
      // For regular trailers: iframe is empty initially, then loads with autoplay after delay
      const autoplayTimer = setTimeout(() => {
        setSrc(`${initialEmbedUrl}&autoplay=1`);
      }, delay);
      return () => clearTimeout(autoplayTimer);
    }
  }, [videoKey, delay, isBackground, initialEmbedUrl]); // Add initialEmbedUrl to dependencies

  // Only render iframe if src is set (or if it's a background video that's waiting for opacity)
  if (!src && !isBackground) {
    // For non-background videos, show a placeholder during the delay
    return <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center text-gray-500">Chargement de la bande-annonce...</div>;
  }

  return (
    <div className={`aspect-video ${isBackground ? 'absolute inset-0 w-full h-full' : ''}`}>
      <iframe
        width="100%"
        height="100%"
        src={src}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
        className={`rounded-lg ${isBackground ? 'object-cover' : ''}`}
        style={{ opacity: iframeOpacity, transition: 'opacity 0.5s ease-in-out' }}
      ></iframe>
    </div>
  );
};

export default TrailerPlayer;
