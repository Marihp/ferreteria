import { requireAuth } from '../../utils/pb'

export default defineEventHandler(async (event) => {
  const pb = await requireAuth(event)
  const q = getQuery(event)
  const filter = q.q ? `name ~ "${q.q}" || code ~ "${q.q}"` : ''
  const res = await pb.collection('categories').getList(1, 200, {
    filter, sort: 'name'
  })
  return res.items.map((x:any) => ({
    id: x.id, name: x.name, code: x.code, color: x.color, description: x.description
  }))
})
