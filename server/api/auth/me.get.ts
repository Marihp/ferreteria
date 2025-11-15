import { getCookie } from 'h3'
import { getPB } from '../../utils/pb'

function decodeJwt(token: string): any {
  try {
    const part = token.split('.')[1]
    const payload = Buffer.from(part, 'base64url').toString('utf8')
    return JSON.parse(payload)
  } catch {
    return null
  }
}

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'pb_auth')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'No autenticado' })

  const payload = decodeJwt(token)
  const now = Math.floor(Date.now() / 1000)
  if (!payload || (payload.exp && payload.exp <= now)) {
    throw createError({ statusCode: 401, statusMessage: 'Sesión expirada' })
  }

  const pb = getPB(event)
  try { await pb.collection('users').authRefresh() } catch {}
  let model: any = pb.authStore.model
  if (!model && payload.id) {
    try {
      model = await pb.collection('users').getOne(payload.id, { requestKey: null })
      pb.authStore.save(token, model)
    } catch {}
  }
  if (!model) throw createError({ statusCode: 401, statusMessage: 'No autenticado' })

  return {
    id: model.id,
    email: model.email,
    name: model.name,
    verified: !!model.verified,
    admin: !!model.admin
  }
})
