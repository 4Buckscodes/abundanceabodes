import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static-friendly for Netlify deployment
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
