import { requireAuth } from '../../utils/pb'

export default defineEventHandler(async (event) => {
  const pb = await requireAuth(event)
  const id = getRouterParam(event, 'id')!
  // Opcional: evitar borrar si hay inventario ligado
  try {
    const count = await pb.collection('inventory').getList(1,1,{ filter: `category = "${id}"` })
    if (count.totalItems > 0) {
      throw createError({ statusCode: 409, statusMessage: 'La categoría tiene productos asociados' })
    }
  } catch {}
  await pb.collection('categories').delete(id)
  return { ok: true }
})
