import PocketBase from 'pocketbase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const email = (body?.email || '').trim()
  const password = body?.password || ''
  if (!email || !password) throw createError({ statusCode: 400, statusMessage: 'Email y contraseña requeridos' })

  const base = process.env.BASE_URL || 'http://127.0.0.1:8090'
  const pb = new PocketBase(base)

  try {
    const { token, record } = await pb.collection('users').authWithPassword(email, password)

    setCookie(event, 'pb_auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24
    })

    return {
      user: {
        id: record.id, email: record.email, name: record.name,
        verified: record.verified, admin: record.admin ?? false
      },
      token
    }
  } catch (e:any) {
    throw createError({ statusCode: 401, statusMessage: 'Credenciales inválidas' })
  }
})
