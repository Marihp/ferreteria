// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-11-15',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
  runtimeConfig: {
    // Private
    BASE_URL: process.env.BASE_URL || 'http://127.0.0.1:8090',
    AUTH_COOKIE_SECURE: process.env.AUTH_COOKIE_SECURE || 'false',
    // Public
    public: {
      appName: 'OpenStock Ferretería'
    }
  },
  nitro: {
    preset: 'node-server',
    routeRules: {
      '/api/**': { cors: true }
    }
  },
  app: {
    head: {
      title: 'OpenStock Ferretería',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  }
})
