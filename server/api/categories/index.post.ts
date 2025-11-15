import { readBody } from 'h3'
import { requireAuth } from '../../utils/pb'
export default defineEventHandler(async (event) => {
  const pb = await requireAuth(event)
  const body = await readBody(event)
  const name = String(body?.name || '').trim()
  if (!name) throw createError({ statusCode: 400, statusMessage: 'El nombre es obligatorio' })
  const c = await pb.collection('categories').create({ name })
  return { id: c.id }
})
