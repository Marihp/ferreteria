import { requireAuth } from '../../utils/pb'
export default defineEventHandler(async (event) => {
  const pb = await requireAuth(event)
  const list = await pb.collection('categories').getFullList({ sort: 'name' })
  return list.map((c: any) => ({ id: c.id, name: c.name }))
})
