export default defineEventHandler( async (event) => {
  const body = await readBody(event)
  const email = String(body.email || '')
  const password = String(body.password || '')

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email y password son requeridos' })
  }

  const pb = (await import('../../utils/pb')).getPB(event)

  const authData:any = await pb.collection('users').authWithPassword(email, password)

  // cookie segura solo si así lo configuran explícitamente
  const config = useRuntimeConfig()
  const secure = (config.AUTH_COOKIE_SECURE || 'false') === 'true'

  setCookie(event, 'pb_auth', pb.authStore.token, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
    path: '/',
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
})
