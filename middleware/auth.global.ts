export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return
  const publicPages = ['/login']
  if (publicPages.includes(to.path)) return
  try {
    await $fetch('/api/auth/me', { credentials: 'include' })
  } catch {
    return navigateTo('/login')
  }
})
