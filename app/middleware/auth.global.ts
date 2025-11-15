export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/login') return
  const { data, error } = await useFetch('/api/auth/me', { credentials: 'include' })
  if (error.value) return navigateTo('/login')
})
