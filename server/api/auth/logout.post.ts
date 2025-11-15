export default defineEventHandler((event) => {
  deleteCookie(event, 'pb_auth', { path: '/' })
  return { ok: true }
})
