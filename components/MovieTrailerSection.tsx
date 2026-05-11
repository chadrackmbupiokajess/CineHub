"use client";

import React, { useState, useEffect } from 'react';
import TrailerPlayer from './TrailerPlayer';

interface MovieTrailerSectionProps {
  allTrailers: any[]; // Array of all YouTube trailers
  backgroundVideoDelay?: number; // New prop for background video delay
}

const MovieTrailerSection: React.FC<MovieTrailerSectionProps> = ({ allTrailers, backgroundVideoDelay = 4000 }) => { // Default to 4000ms
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const backgroundTrailer = allTrailers.length > 0 ? allTrailers[0] : null;
  const regularTrailers = backgroundTrailer ? allTrailers.slice(1) : allTrailers;
  const trailerToDisplayOnMobile = backgroundTrailer || regularTrailers.length > 0 ? (backgroundTrailer || regularTrailers[0]) : null;


  return (
    <>
      {/* Background Trailer (Desktop Only) */}
      {!isMobile && backgroundTrailer && (
        <div className="absolute inset-0 overflow-hidden rounded-lg">
          <TrailerPlayer
            videoKey={backgroundTrailer.key}
            title={backgroundTrailer.name}
            isBackground={true}
            delay={backgroundVideoDelay} // Pass the delay here
          />
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
        </div>
      )}

      {/* Regular Trailer Section (Mobile or if no background trailer on Desktop) */}
      {(isMobile || !backgroundTrailer) && trailerToDisplayOnMobile && (
        <div className="mt-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Bande-annonce</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TrailerPlayer
              key={trailerToDisplayOnMobile.key}
              videoKey={trailerToDisplayOnMobile.key}
              title={trailerToDisplayOnMobile.name}
              delay={0} // No delay for regular trailers
            />
          </div>
        </div>
      )}
    </>
  );
};

export default MovieTrailerSection;
