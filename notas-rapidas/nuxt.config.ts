// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-10-28',
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
      description: 'Aplicación de notas rápida y simple desarrollada por Jéraldyn Acevedo',
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
      globDirectory: '.output/public',
      globPatterns: ['**/*.{js,css,html,png,svg,ico,json,webmanifest,woff2,woff}'],
      cleanupOutdatedCaches: true,
      offlineFallback: true,
      runtimeCaching: [
        {
          urlPattern: /\.(?:js|css|html)$/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'static-resources',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 7 * 24 * 60 * 60 // 7 días
            }
          }
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 30 * 24 * 60 * 60 // 30 días
            }
          }
        },
        {
          urlPattern: /\/fonts\/.*\.(?:woff2|woff|ttf)$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'local-fonts',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 365 * 24 * 60 * 60 // 1 año
            }
          }
        }
      ]
    },

    devOptions: {
      enabled: true,
      type: 'module'
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
        { rel: 'manifest', href: '/manifest.webmanifest' },
        { rel: 'stylesheet', href: '/fonts/local-fonts.css' }
      ]
    }
  },

  nitro: {
    preset: 'node-server',
    compressPublicAssets: true
  }
})
