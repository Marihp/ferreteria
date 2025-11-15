import { requireAuth } from '../utils/pb'
import dayjs from 'dayjs'

export default defineEventHandler( async (event) => {
  const pb = requireAuth(event)

  // products list (for metrics)
  const products = await pb.collection('products').getFullList({ expand: 'category', requestKey: null })

  const totalProducts = products.length
  const inventoryValue = products.reduce((acc:any, p:any) => acc + Number(p.stock||0)*Number(p.cost||0), 0)
  const lowItems = products.filter((p:any) => Number(p.stock||0) <= Number(p.min_stock||0)).slice(0, 10)

  // movements last 30 days
  const since = dayjs().subtract(30,'day').toISOString()
  const movements = await pb.collection('stock_movements').getFullList({
    filter: `created >= '${since}'`,
    requestKey: null
  })

  // Aggregate daily net movement
  const byDay:Record<string, number> = {}
  movements.forEach((m:any) => {
    const d = dayjs(m.created).format('YYYY-MM-DD')
    byDay[d] = (byDay[d] || 0) + Number(m.quantity||0)
  })
  const days = Array.from({length: 30}).map((_,i)=> dayjs().subtract(29-i,'day').format('YYYY-MM-DD'))
  const series = days.map(d => byDay[d] || 0)

  // Category breakdown by inventory value
  const catValue:Record<string, number> = {}
  products.forEach((p:any) => {
    const cat = p.expand?.category?.name || 'Sin categoría'
    const val = Number(p.stock||0)*Number(p.cost||0)
    catValue[cat] = (catValue[cat] || 0) + val
  })
  const categoryLabels = Object.keys(catValue)
  const categorySeries = categoryLabels.map(k => Math.round(catValue[k]))

  return {
    kpis: {
      totalProducts,
      inventoryValue,
      lowStockCount: lowItems.length
    },
    lowStock: lowItems.map((p:any)=>({ id:p.id, name:p.name, sku:p.sku, stock:p.stock, min_stock:p.min_stock })),
    movementChart: { categories: days, series },
    categoryChart: { labels: categoryLabels, series: categorySeries }
  }
})
