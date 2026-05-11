"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface LogoOverlayProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  delay?: number; // Delay in milliseconds before hiding the logo
}

const LogoOverlay: React.FC<LogoOverlayProps> = ({ src, alt, width, height, delay = 3000 }) => {
  const [showLogo, setShowLogo] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogo(false); // Hide logo after the specified delay
    }, delay);

    return () => clearTimeout(timer); // Cleanup the timer
  }, [delay]);

  if (!showLogo) {
    return null;
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center z-30">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="opacity-75 transition-opacity duration-500"
      />
    </div>
  );
};

export default LogoOverlay;
