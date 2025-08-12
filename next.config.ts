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
  // Optimize for serverless deployment
  output: 'standalone',
  // Ensure all API routes work properly on Netlify
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.netlify.app']
    }
  },
  // Handle dynamic imports properly
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
