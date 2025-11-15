import { requireAuth } from '../../utils/pb'
import { secureHeaders } from '../../utils/security'

export default defineEventHandler(async (event) => {
  secureHeaders(event)
  const { pb } = await requireAuth(event)
  // Traer todo inventario (en batches) con categoría expandida
  const items = await pb.collection('inventory').getFullList({
    batch: 200, expand: 'category', sort: '-created'
  })

  const totalItems = items.length
  let totalCost = 0
  let totalValue = 0
  const lowStock: any[] = []
  const perCat: Record<string, { id: string, name: string, value: number }> = {}

  for (const it of items as any[]) {
    const cost = Number(it.cost || 0)
    const price = Number(it.price || 0)
    const stock = Number(it.stock || 0)
    const min = Number(it.min_stock || 0)

    totalCost += cost * stock
    totalValue += price * stock

    if (stock <= min) lowStock.push({ id: it.id, name: it.name, stock, min_stock: min })

    const cat = it.expand?.category
    const catId = cat?.id || 'NA'
    const catName = cat?.name || 'Sin categoría'
    perCat[catId] = perCat[catId] || { id: catId, name: catName, value: 0 }
    perCat[catId].value += price * stock
  }

  const topCategories = Object.values(perCat).sort((a,b)=> b.value - a.value).slice(0,5)

  return {
    totalItems,
    totalCost,
    totalValue,
    potentialProfit: totalValue - totalCost,
    lowStock,
    topCategories
  }
})
