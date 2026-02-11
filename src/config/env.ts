/**
 * Environment configuration
 * 
 * Create .env.development and .env.production files in the project root:
 * 
 * .env.development:
 *   VITE_API_BASE_URL=http://127.0.0.1:8000
 * 
 * .env.production:
 *   VITE_API_BASE_URL=https://api.yourdomain.com
 */
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
} as const

export type Config = typeof config

