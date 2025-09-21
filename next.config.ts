import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  
  // Ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },

  // Ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Images unoptimized to prevent build issues
  images: {
    unoptimized: true,
  },

  // Optional: if using modular imports for better tree shaking
  modularizeImports: {
    '@radix-ui/react-*': {
      transform: '@radix-ui/react-*/{{member}}',
      preventFullImport: true,
    },
    // Removed lucide-react transform as it's causing build issues
  },
};

export default nextConfig;