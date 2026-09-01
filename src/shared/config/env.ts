/**
 * En dev (serveur Vite), on passe par le proxy same-origin `/api/v1` défini
 * dans vite.config.ts : pas de préflight CORS. En build de production, on
 * utilise l'URL absolue de l'API (VITE_API_BASE_URL).
 */
function resolveApiBaseUrl(): string {
  if (import.meta.env.DEV) return '/api/v1';
  return import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1';
}

export const env = {
  apiBaseUrl: resolveApiBaseUrl(),
  appName: import.meta.env.VITE_APP_NAME ?? 'FasoViva Admin',
} as const;
