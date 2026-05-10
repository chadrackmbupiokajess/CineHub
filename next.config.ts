import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['image.tmdb.org'],
  },
  // Allow connections from your local IP in development mode
  allowedDevOrigins: ['192.168.7.110'], // Updated to your correct local IP
  /* config options here */
};

export default nextConfig;
