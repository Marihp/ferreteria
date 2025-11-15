import { setCookie, createError, readBody, getHeader } from 'h3'
import { getPB } from '../../utils/pb'
import { secureHeaders } from '../../utils/security'

export default defineEventHandler( async (event) => {
  secureHeaders(event)
  const body = await readBody(event)
  const email = String(body?.email || '').trim()
  const password = String(body?.password || '')

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email y contraseña requeridos' })
  }

  const pb = getPB()
  try {
    const authData = await pb.collection('users').authWithPassword(email, password)

    // Detectar si la request llegó como HTTPS detrás de Nginx
    const xfproto = getHeader(event, 'x-forwarded-proto') || ''
    const isHttps = (xfproto || '').toLowerCase() === 'https'

    setCookie(event, 'pb_auth', pb.authStore.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isHttps, // no marcar secure si llega por http
      maxAge: 60 * 60 * 24,
      path: '/'
    })

    return {
      user: {
        id: authData.record.id,
        email: authData.record.email,
        name: authData.record.name,
        verified: !!authData.record.verified,
        admin: !!authData.record.admin
      },
      token: authData.token
    }
  } catch (e: any) {
    throw createError({ statusCode: 401, statusMessage: 'Autenticación fallida' })
  }
})
