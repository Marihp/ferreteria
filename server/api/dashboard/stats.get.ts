import { requireAuth } from '../../utils/pb'

export default defineEventHandler(async (event) => {
  const pb = await requireAuth(event)
  let page = 1
  const perPage = 200
  const byCat = new Map<string, { name: string; products: number; stock: number; cost: number; revenue: number }>()

  let products = 0, low = 0, totalStock = 0, invCost = 0, invRevenue = 0

  while (true) {
    const res = await pb.collection('inventory').getList(page, perPage, {
      filter: 'active = true',
      expand: 'category'
    })

    for (const it of res.items) {
      const stock = Number(it.stock ?? 0)
      const minStock = Number(it.min_stock ?? 0)
      const cost = Number(it.cost ?? 0)
      const price = Number(it.price ?? 0)

      products += 1
      if (stock <= minStock) low += 1
      totalStock += stock
      invCost += stock * cost
      invRevenue += stock * price

      const catId = it.category ?? null
      const catName = it.expand?.category?.name ?? 'Sin categoría'
      const key = catId || 'none'
      if (!byCat.has(key)) byCat.set(key, { name: catName, products: 0, stock: 0, cost: 0, revenue: 0 })
      const bucket = byCat.get(key)!
      bucket.products += 1
      bucket.stock += stock
      bucket.cost += stock * cost
      bucket.revenue += stock * price
    }

    if (page >= res.totalPages) break
    page++
  }

  const invProfit = invRevenue - invCost
  const byCategory = Array.from(byCat.entries()).map(([id, v]) => ({ id: id === 'none' ? null : id, name: v.name, ...v }))
    .sort((a,b) => b.stock - a.stock)

  return { products, low, totalStock, invCost, invRevenue, invProfit, byCategory }
})
