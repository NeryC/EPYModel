/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config");

const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Internationalization configuration
  i18n,
  
  // Typed routes for better type safety
  typedRoutes: true,
  
  // Compiler options
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"],
    } : false,
  },
  
  // Performance optimizations
  poweredByHeader: false,
  
  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

module.exports = nextConfig;
