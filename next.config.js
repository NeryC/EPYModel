/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config");

const nextConfig = {
  // Enable React strict mode for better development experience
  // Note: Disabled temporarily if causing issues with third-party libraries
  reactStrictMode: true,
  
  // Internationalization configuration
  i18n,
  
  // Performance optimizations
  swcMinify: true,
  
  // Compiler options
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"],
    } : false,
  },
};

module.exports = nextConfig;
