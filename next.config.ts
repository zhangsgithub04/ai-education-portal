import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable eslint during builds to prevent warnings from failing the build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable type checking during builds - you can run `npm run type-check` separately
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
