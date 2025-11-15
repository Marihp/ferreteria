import PocketBase from 'pocketbase'
import type { H3Event } from 'h3'
import { getCookie, getHeader, createError } from 'h3'

function decodeJwt(token: string): any {
  try {
    const part = token.split('.')[1]
    const payload = Buffer.from(part, 'base64url').toString('utf8')
    return JSON.parse(payload)
  } catch {
    return null
  }
}

export const getPB = () => {
  const base = process.env.BASE_URL || process.env.NUXT_PUBLIC_BASE_URL || 'http://127.0.0.1:8090'
  return new PocketBase(base)
}

export const requireAuth = async (event: H3Event) => {
  // Leer cookie de forma robusta
  const token = getCookie(event, 'pb_auth')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'No autenticado' })

  const payload = decodeJwt(token)
  const now = Math.floor(Date.now() / 1000)
  if (!payload || (payload.exp && payload.exp <= now)) {
    throw createError({ statusCode: 401, statusMessage: 'Sesión expirada' })
  }

  const pb = getPB()
  // Cargar token manualmente
  pb.authStore.save(token, null)

  // Best-effort refresh y modelo de usuario
  try { await pb.collection('users').authRefresh() } catch {}
  let user: any = pb.authStore.model
  if (!user && payload?.id) {
    try {
      user = await pb.collection('users').getOne(payload.id, { requestKey: null })
      pb.authStore.save(token, user)
    } catch {}
  }
  if (!user) throw createError({ statusCode: 401, statusMessage: 'No autenticado' })

  return { pb, user, token }
}
