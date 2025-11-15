import PocketBase from 'pocketbase'
import type { H3Event } from 'h3'
import { getHeader, createError } from 'h3'

function decodeJwt(token: string): any {
  try {
    const part = token.split('.')[1]
    const payload = Buffer.from(part, 'base64url').toString('utf8')
    return JSON.parse(payload)
  } catch {
    return null
  }
}

export const getPB = (event?: H3Event) => {
  const config = useRuntimeConfig()
  const base = config.BASE_URL || 'http://127.0.0.1:8090'
  const pb = new PocketBase(base)
  if (event) {
    const raw = getHeader(event, 'cookie') || ''
    pb.authStore.loadFromCookie(raw)
  }
  return pb
}

export const requireAuth = async (event: H3Event) => {
  const pb = getPB(event)
  const token = pb.authStore.token
  if (!token) throw createError({ statusCode: 401, statusMessage: 'No autenticado' })
  const payload = decodeJwt(token)
  const now = Math.floor(Date.now() / 1000)
  if (!payload || (payload.exp && payload.exp <= now)) {
    throw createError({ statusCode: 401, statusMessage: 'Sesión expirada' })
  }
  try { await pb.collection('users').authRefresh() } catch {}
  if (!pb.authStore.model && payload.id) {
    try {
      const user = await pb.collection('users').getOne(payload.id, { requestKey: null })
      pb.authStore.save(token, user)
    } catch {}
  }
  return pb
}
