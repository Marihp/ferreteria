export default defineNuxtConfig({
  compatibilityDate: '2025-11-15',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
  runtimeConfig: {
    public: {
      // Usado por el cliente (si lo necesitas).
      appName: 'OpenStock Ferretería'
    }
  },
  app: {
    head: {
      title: 'OpenStock | Ferretería',
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }]
    }
  },
  nitro: {
    routeRules: {
      '/api/**': { cors: false }
    }
  }
})
