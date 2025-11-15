import { getQuery } from 'h3'
import { requireAuth } from '../../utils/pb'

export default defineEventHandler(async (event) => {
  const pb = await requireAuth(event)
  const q = getQuery(event)

  const page = Math.max(1, Number(q.page || 1))
  const perPage = Math.min(100, Math.max(1, Number((q.perPage as string) || 20)))
  const search = (q.search as string) || ''
  const categoryId = (q.categoryId as string) || ''
  const inStock = q.inStock === '1' || q.inStock === 'true'

  const filters: string[] = []
  filters.push('active = true')

  if (search) {
    const s = search.replace(/"/g, '\"')
    filters.push(`(name ~ \"${s}\" || sku ~ \"${s}\")`)
  }
  if (categoryId) {
    const c = categoryId.replace(/"/g, '\"')
    filters.push(`category = \"${c}\"`)
  }
  if (inStock) {
    filters.push('stock > 0')
  }

  const filter = filters.join(' && ')
  const res = await pb.collection('inventory').getList(page, perPage, {
    filter,
    sort: '-updated',
    expand: 'category'
  })

  return {
    page: res.page,
    perPage: res.perPage,
    totalPages: res.totalPages,
    totalItems: res.totalItems,
    items: res.items.map((it: any) => ({
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
      notes: it.notes || '',
      updated: it.updated
    }))
  }
})
