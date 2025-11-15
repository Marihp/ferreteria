export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return
  const user = useState<any>('user')
  if (to.path === '/login') return
  try {
    if (!user.value) {
      const me = await $fetch('/api/auth/me', { credentials: 'include' })
      user.value = me
    }
  } catch (e) {
    return navigateTo('/login')
  }
})
