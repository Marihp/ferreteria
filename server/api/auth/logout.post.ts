export default defineEventHandler( async (event) => {
  deleteCookie(event, 'pb_auth', { path: '/' })
  return { ok: true }
})
