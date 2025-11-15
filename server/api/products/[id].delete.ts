import { requireAuth } from '../../utils/pb'
export default defineEventHandler(async (event) => {
  const pb = await requireAuth(event)
  const id = event.context.params?.id as string
  await pb.collection('inventory').delete(id)
  return { ok: true }
})
