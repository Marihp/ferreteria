import { requireAuth } from '../../utils/pb'
export default defineEventHandler(async (event) => {
  const pb = requireAuth(event)
  const q = getQuery(event)
  const page = Number(q.page || 1)
  const perPage = Math.min(Number(q.perPage || 20), 100)
  const search = (q.search || '').toString().trim()
  const category = (q.category || '').toString().trim()
  const filterParts = []
  if (search) filterParts.push(`(name~"${search}" || sku~"${search}")`)
  if (category) filterParts.push(`category="${category}"`)
  const filter = filterParts.join(' && ')
  const res = await pb.collection('products').getList(page, perPage, {
    filter: filter || undefined,
    sort: '+name',
    expand: 'category',
    requestKey: null
  })
  return res
})
