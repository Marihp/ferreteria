import { requireAuth } from '../../utils/pb'
import { createError } from 'h3'
import { secureHeaders } from '../../utils/security'

export default defineEventHandler( async (event) => {
  secureHeaders(event)
  const { pb } = await requireAuth(event)
  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID requerido' })
  try {
    await pb.collection('inventory').delete(id)
    return { ok: true }
  } catch (e: any) {
    throw createError({ statusCode: 400, statusMessage: 'No se pudo eliminar' })
  }
})
