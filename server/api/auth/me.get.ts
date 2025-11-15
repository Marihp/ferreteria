import { createError } from 'h3'
import { requireAuth } from '../../utils/pb'
import { secureHeaders } from '../../utils/security'

export default defineEventHandler(async (event) => {
  secureHeaders(event)
  const { user } = await requireAuth(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'No autenticado' })
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    verified: !!user.verified,
    admin: !!user.admin
  }
})
