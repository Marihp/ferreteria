export default defineNuxtConfig({
  compatibilityDate: '2025-11-15',
  modules: ['@nuxtjs/tailwindcss'],
  css: ['@/assets/tailwind.css'],
  nitro: {
    preset: 'node-server',
    compatibilityDate: '2025-11-15'
  },
  runtimeConfig: {
    BASE_URL: process.env.BASE_URL || 'http://127.0.0.1:8090',
    public: {}
  },
  app: {
    head: {
      title: 'Ferretería - Inventario',
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }]
    }
  }
})
