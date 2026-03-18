/**
 * Centralized application configuration.
 * All environment variables are read here — never import.meta.env directly elsewhere.
 */
export const config = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:4000',
  gtmId: import.meta.env.VITE_GTM_ID ?? '',
  appEnv: (import.meta.env.VITE_APP_ENV ?? 'development') as 'development' | 'production' | 'qa',
  appVersion: import.meta.env.VITE_APP_VERSION ?? '2.0.0',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;

export type AppConfig = typeof config;
