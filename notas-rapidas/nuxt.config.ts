// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  modules: ['@vite-pwa/nuxt'],
  
  pwa: {
    registerType: 'autoUpdate',
    injectRegister: 'script',
    strategies: 'generateSW',
    manifest: {
      name: 'Notas Rápidas - Aplicación de Notas',
      short_name: 'Notas Rápidas',
      description: 'Aplicación de notas rápida y simple desarrollada por Jéraldyn Acevedo. Funciona offline y se puede instalar como aplicación nativa.',
      theme_color: '#FFD700',
      background_color: '#FFFFCC',
      display: 'standalone',
      start_url: '/',
      orientation: 'portrait',
      scope: '/',
      lang: 'es',
      categories: ['productivity', 'utilities'],
      icons: [
        {
          src: '/favicon.ico',
          sizes: '64x64',
          type: 'image/x-icon',
          purpose: 'any'
        },
        {
          src: '/icon-192x192.svg',
          sizes: '192x192',
          type: 'image/svg+xml',
          purpose: 'any maskable'
        },
        {
          src: '/icon-512x512.svg',
          sizes: '512x512',
          type: 'image/svg+xml',
          purpose: 'any maskable'
        },
        {
          src: '/favicon.svg',
          sizes: '192x192',
          type: 'image/svg+xml',
          purpose: 'any maskable'
        },
        {
          src: '/favicon.svg',
          sizes: '512x512',
          type: 'image/svg+xml',
          purpose: 'any maskable'
        }
      ]
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      navigateFallback: null,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
            }
          }
        },
        {
          urlPattern: '/.*',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'notas-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 30 * 24 * 60 * 60 // 30 días
            },
            networkTimeoutSeconds: 10
          }
        }
      ]
    },
    devOptions: {
      enabled: true,
      type: 'module',
      navigateFallback: '/'
    }
  },
  
  app: {
    head: {
      title: 'Notas Rápidas -JA',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Aplicación de notas rápida y simple' },
        { name: 'theme-color', content: '#FFD700' }
      ]
    }
  }
})
