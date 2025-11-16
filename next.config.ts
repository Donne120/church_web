import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  reactStrictMode: true,
  
  // Optimize images
  images: {
    domains: ['uhpmjlgvxcfvmrxzrspo.supabase.co'],
    formats: ['image/avif', 'image/webp'],
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Enable SWC minification
  swcMinify: true,

  // Optimize production builds
  productionBrowserSourceMaps: false,
};

export default nextConfig;
