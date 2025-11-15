import PocketBase from 'pocketbase'
import type { H3Event } from 'h3'

export const getPB = (event?: H3Event) => {
  const base = process.env.BASE_URL || process.env.NUXT_PUBLIC_BASE_URL || 'http://127.0.0.1:8090'
  const pb = new PocketBase(base)
  if (event) {
    const cookie = getCookie(event, 'pb_auth')
    if (cookie) {
      pb.authStore.loadFromCookie(`pb_auth=${cookie}`)
    }
  }
  return pb
}

export const requireAuth = (event: H3Event) => {
  const pb = getPB(event)
  if (!pb.authStore.isValid) {
    throw createError({ statusCode: 401, statusMessage: 'No autenticado' })
  }
  return pb
}
