// Environment configuration for epimodel-next
// This file centralizes all environment-related configuration

export const ENV_CONFIG = {
  // API Configuration
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  API_TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
  API_RETRY_ATTEMPTS: parseInt(process.env.NEXT_PUBLIC_API_RETRY_ATTEMPTS || '3'),
  
  // Environment flags
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_TEST: process.env.NODE_ENV === 'test',
  
  // Feature flags
  ENABLE_DEBUG_LOGS: process.env.NEXT_PUBLIC_DEBUG_LOGS === 'true',
  ENABLE_ERROR_REPORTING: process.env.NEXT_PUBLIC_ERROR_REPORTING === 'true',
} as const;

// Validation function to ensure required environment variables are set
export function validateEnvironment(): void {
  const requiredVars = ['NEXT_PUBLIC_API_URL'];
  
  const missingVars = requiredVars.filter(
    (varName) => !process.env[varName]
  );
  
  if (missingVars.length > 0 && ENV_CONFIG.IS_PRODUCTION) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
  
  // Log configuration in development
  if (ENV_CONFIG.IS_DEVELOPMENT && ENV_CONFIG.ENABLE_DEBUG_LOGS) {
    console.log('Environment Configuration:', ENV_CONFIG);
  }
}

// Call validation on import
validateEnvironment();
