import { requireAuth } from '../../utils/pb'
export default defineEventHandler(async (event) => {
  const pb = requireAuth(event)
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)
  return await pb.collection('categories').update(id, { name: (body?.name||'').trim() })
})
