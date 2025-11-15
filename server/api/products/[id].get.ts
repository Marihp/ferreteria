import { requireAuth } from '../../utils/pb'
export default defineEventHandler(async (event) => {
  const pb = await requireAuth(event)
  const id = event.context.params?.id as string
  const it = await pb.collection('inventory').getOne(id, { expand: 'category' })
  return {
    id: it.id,
    sku: it.sku,
    name: it.name,
    categoryId: it.category,
    categoryName: it.expand?.category?.name || null,
    stock: it.stock ?? 0,
    min_stock: it.min_stock ?? 0,
    price: it.price ?? 0,
    cost: it.cost ?? 0,
    location: it.location || '',
    unit: it.unit || '',
    active: !!it.active,
    notes: it.notes || ''
  }
})
