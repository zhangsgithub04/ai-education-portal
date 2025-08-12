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
  // Remove standalone output for Netlify - it interferes with their plugin
  // output: 'standalone',
  
  // Ensure all API routes work properly on Netlify
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.netlify.app']
    }
  },
  
  // Optimize for Netlify deployment
  images: {
    unoptimized: true // Netlify handles image optimization differently
  },
  
  // Handle dynamic imports properly
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  
  // Ensure proper trailing slash handling
  trailingSlash: false,
  
  // Optimize for serverless functions
  poweredByHeader: false,
};

export default nextConfig;
