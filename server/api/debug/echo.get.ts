export default defineEventHandler((event) => ({
  cookieHeader: getHeader(event, 'cookie') || null,
  pbCookie: getCookie(event, 'pb_auth') || null
}))
