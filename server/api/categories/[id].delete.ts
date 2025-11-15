import { requireAuth } from '../../utils/pb'
export default defineEventHandler(async (event) => {
  const pb = requireAuth(event)
  const id = getRouterParam(event, 'id')!
  await pb.collection('categories').delete(id)
  return { ok: true }
})
