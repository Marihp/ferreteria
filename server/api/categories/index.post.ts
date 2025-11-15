import { requireAuth } from '../../utils/pb'
export default defineEventHandler(async (event) => {
  const pb = requireAuth(event)
  const body = await readBody(event)
  const data = { name: (body?.name||'').trim() }
  if (!data.name) throw createError({ statusCode: 400, statusMessage: 'Nombre requerido' })
  return await pb.collection('categories').create(data)
})
