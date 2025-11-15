// Nuxt config for OpenStock Ferretería
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss'
  ],
  runtimeConfig: {
    public: {
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'OpenStock Ferretería',
      currency: process.env.NUXT_PUBLIC_CURRENCY || 'COP'
    }
  },
  nitro: {
    preset: 'node-server'
  },
  components: true,
  typescript: {
    strict: false
  }
})
