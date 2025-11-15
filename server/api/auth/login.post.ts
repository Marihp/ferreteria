import { readBody } from 'h3'
import { getPB } from '../../utils/pb'

function sanitize(v: string) { return (v || '').trim() }

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const email = sanitize(body?.email || '')
  const password = body?.password || ''
  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email y contraseña son requeridos' })
  }
  const pb = getPB(event)
  const authData = await pb.collection('users').authWithPassword(email, password)

  setCookie(event, 'pb_auth', pb.authStore.token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
    path: '/'
  })

  return {
    user: {
      id: authData.record.id,
      email: authData.record.email,
      name: authData.record.name,
      verified: authData.record.verified,
      admin: !!authData.record.admin
    },
    token: authData.token
  }
})
