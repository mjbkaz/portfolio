import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    // Serve AVIF first (smallest), then WebP. Vercel optimizes these on the edge.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
