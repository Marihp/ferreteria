export default defineNuxtRouteMiddleware(async (to) => {
  // Rutas públicas:
  if (['/login'].includes(to.path)) return
  // Proteger todo lo demás:
  try {
    const me = await $fetch('/api/auth/me', { method: 'GET' })
    if (!me?.id) {
      return navigateTo('/login')
    }
  } catch {
    return navigateTo('/login')
  }
})
