import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  reactStrictMode: true,
  
  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uhpmjlgvxcfvmrxzrspo.supabase.co',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Optimize production builds
  productionBrowserSourceMaps: false,
};

export default nextConfig;
