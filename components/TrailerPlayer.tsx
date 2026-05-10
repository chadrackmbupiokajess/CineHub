"use client";

import React, { useEffect, useState } from "react";

interface TrailerPlayerProps {
  videoKey: string;
  title: string;
  delay?: number; // Delay in milliseconds before autoplay for non-background videos
  isBackground?: boolean; // New prop to indicate if it's a background video
}

const TrailerPlayer: React.FC<TrailerPlayerProps> = ({ videoKey, title, delay = 3000, isBackground = false }) => {
  const [src, setSrc] = useState("");

  useEffect(() => {
    let embedUrl = `https://www.youtube.com/embed/${videoKey}?controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3`;

    if (isBackground) {
      // For background videos: autoplay immediately, mute, loop, and add playlist for looping
      embedUrl += `&autoplay=1&mute=1&loop=1&playlist=${videoKey}`;
      setSrc(embedUrl);
    } else {
      // For regular trailers: apply delay before autoplay
      const timer = setTimeout(() => {
        setSrc(`${embedUrl}&autoplay=1`);
      }, delay);
      setSrc(embedUrl); // Set initial src without autoplay
      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [videoKey, delay, isBackground]);

  if (!src) return null; // Don't render iframe until src is determined

  return (
    <div className={`aspect-video ${isBackground ? 'absolute inset-0 w-full h-full' : ''}`}>
      <iframe
        width="100%"
        height="100%"
        src={src}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className={`rounded-lg ${isBackground ? 'object-cover' : ''}`}
      ></iframe>
    </div>
  );
};

export default TrailerPlayer;
