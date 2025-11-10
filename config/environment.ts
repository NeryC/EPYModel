// Environment configuration for epimodel-next
// This file centralizes all environment-related configuration

/**
 * Get API URL based on NODE_ENV
 * - Development: http://localhost:3001
 * - Production: http://epymodel.uaa.edu.py:3001
 * - Can be overridden with NEXT_PUBLIC_API_URL environment variable
 */
function getApiUrl(): string {
  // Allow explicit override via environment variable
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Automatically determine URL based on NODE_ENV
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  switch (nodeEnv) {
    case 'production':
      return 'http://epymodel.uaa.edu.py:3001';
    case 'test':
      return 'http://localhost:3001';
    case 'development':
    default:
      return 'http://localhost:3001';
  }
}

// Environment flags (must be defined before ENV_CONFIG to use in getApiUrl)
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_TEST = process.env.NODE_ENV === 'test';

export const ENV_CONFIG = {
  // API Configuration
  // API URL is automatically determined based on NODE_ENV
  // Can be overridden with NEXT_PUBLIC_API_URL environment variable
  API_URL: getApiUrl(),
  API_TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000', 10),
  API_RETRY_ATTEMPTS: parseInt(process.env.NEXT_PUBLIC_API_RETRY_ATTEMPTS || '3', 10),
  
  // Environment flags
  IS_DEVELOPMENT,
  IS_PRODUCTION,
  IS_TEST,
  
  // Feature flags
  ENABLE_DEBUG_LOGS: process.env.NEXT_PUBLIC_DEBUG_LOGS === 'true',
  ENABLE_ERROR_REPORTING: process.env.NEXT_PUBLIC_ERROR_REPORTING === 'true',
} as const;

/**
 * Validation function to ensure environment configuration is valid
 * No longer requires NEXT_PUBLIC_API_URL as it's automatically determined
 */
export function validateEnvironment(): void {
  // Validate API timeout and retry attempts are positive numbers
  if (ENV_CONFIG.API_TIMEOUT <= 0) {
    console.warn('Warning: API_TIMEOUT should be a positive number. Using default: 30000');
  }
  
  if (ENV_CONFIG.API_RETRY_ATTEMPTS < 0) {
    console.warn('Warning: API_RETRY_ATTEMPTS should be a non-negative number. Using default: 3');
  }
  
  // Log configuration in development with debug logs enabled
  if (ENV_CONFIG.IS_DEVELOPMENT && ENV_CONFIG.ENABLE_DEBUG_LOGS) {
    console.log('Environment Configuration:', {
      NODE_ENV: process.env.NODE_ENV,
      API_URL: ENV_CONFIG.API_URL,
      API_TIMEOUT: ENV_CONFIG.API_TIMEOUT,
      API_RETRY_ATTEMPTS: ENV_CONFIG.API_RETRY_ATTEMPTS,
      IS_DEVELOPMENT: ENV_CONFIG.IS_DEVELOPMENT,
      IS_PRODUCTION: ENV_CONFIG.IS_PRODUCTION,
      IS_TEST: ENV_CONFIG.IS_TEST,
      ENABLE_DEBUG_LOGS: ENV_CONFIG.ENABLE_DEBUG_LOGS,
      ENABLE_ERROR_REPORTING: ENV_CONFIG.ENABLE_ERROR_REPORTING,
    });
  }
  
  // In production, log the API URL being used (without sensitive data)
  if (ENV_CONFIG.IS_PRODUCTION) {
    console.log(`Production mode: Using API URL: ${ENV_CONFIG.API_URL}`);
  }
}

// Call validation on import
validateEnvironment();
