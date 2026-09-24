import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization is disabled: all property art ships as SVG and is served
  // as-is. This keeps rendering identical across hosts (Vercel included) and
  // avoids needing dangerouslyAllowSVG for the optimizer.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
