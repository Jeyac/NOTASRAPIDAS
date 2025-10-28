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
      name: 'Notas Rápidas',
      short_name: 'Notas',
      start_url: '/',
      display: 'standalone',
      background_color: '#FFFFCC',
      theme_color: '#FFD700',
      icons: [
        {
          src: '/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable'
        },
        {
          src: '/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      navigateFallback: '/',
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
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-stylesheets',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
            }
          }
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
            }
          }
        },
        {
          urlPattern: /\.(?:js|css)$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'static-resources',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
            }
          }
        },
        {
          urlPattern: /^\/.*$/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'pages',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 24 * 60 * 60 // 1 day
            },
            networkTimeoutSeconds: 3
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
      title: 'Notas Rápidas',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Aplicación de notas rápida y simple desarrollada por Jéraldyn Acevedo' },
        { name: 'theme-color', content: '#FFD700' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'manifest', href: '/manifest.json' }
      ]
    }
  }
})
