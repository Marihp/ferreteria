import { requireAuth } from '../../utils/pb'
export default defineEventHandler( async (event) => {
  const pb = requireAuth(event)
  const q = getQuery(event)
  const from = (q.from || '').toString()
  const to = (q.to || '').toString()
  let filter = ''
  if (from) filter += `created >= '${from}'`
  if (to) filter += (filter ? ' && ' : '') + `created <= '${to}'`
  const items = await pb.collection('stock_movements').getFullList({
    filter: filter || undefined,
    expand: 'product',
    sort: '-created',
    requestKey: null
  })
  return items.map((m:any)=> ({
    id: m.id,
    created: m.created,
    type: m.type,
    quantity: m.quantity,
    note: m.note || '',
    product: { id: m.product, name: m.expand?.product?.name, sku: m.expand?.product?.sku }
  }))
})
