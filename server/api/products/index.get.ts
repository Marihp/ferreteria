import { requireAuth } from '../../utils/pb'

export default defineEventHandler(async (event) => {
  const pb = await requireAuth(event)
  const q = getQuery(event)
  const page = Number(q.page || 1)
  const perPage = Math.min(Number(q.perPage || 50), 200)
  const parts:string[] = ['active = true']
  if (q.q) parts.push(`name ~ "${q.q}" || sku ~ "${q.q}"`)
  if (q.category) parts.push(`category = "${q.category}"`)
  if (q.onlyLow === '1') parts.push('(stock <= min_stock)')
  const filter = parts.join(' && ')
  const res = await pb.collection('inventory').getList(page, perPage, { filter, expand: 'category', sort: '-updated' })
  return res
})
