import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Backend visé par le proxy de dev. On dérive l'origine depuis
  // VITE_API_BASE_URL (ex: https://178-238-230-82.nip.io/api/v1 -> https://178-238-230-82.nip.io).
  const apiBase = env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1'
  let proxyTarget = 'http://localhost:8000'
  try {
    proxyTarget = new URL(apiBase).origin
  } catch {
    /* garde la valeur par défaut */
  }

  return {
    plugins: [react()],
    server: {
      // En dev, le front appelle /api/... (même origine) : aucun préflight CORS.
      // Vite relaie vers le vrai backend. En prod, ce proxy n'existe pas et
      // l'app utilise VITE_API_BASE_URL directement.
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: true,
        },
      },
    },
  }
})
