import { requireAuth } from '../../utils/pb'

export default defineEventHandler(async (event) => {
  const pb = await requireAuth(event)
  const body = await readBody(event)
  const data = {
    name: String(body.name || '').trim(),
    code: String(body.code || '').trim().toUpperCase() || null,
    color: String(body.color || '').trim() || null,
    description: String(body.description || '').trim() || null,
    isActive: true
  }
  if (!data.name) throw createError({ statusCode: 400, statusMessage: 'Nombre requerido' })
  const rec = await pb.collection('categories').create(data, { requestKey: null })
  return rec
})
