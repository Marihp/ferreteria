import { requireAuth } from '../../utils/pb'
export default defineEventHandler( async (event) => {
  const pb = requireAuth(event)
  const products = await pb.collection('products').getFullList({ expand: 'category', requestKey: null })
  const rows = products.map((p:any) => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    category: p.expand?.category?.name || 'Sin categoría',
    stock: Number(p.stock||0),
    cost: Number(p.cost||0),
    price: Number(p.price||0),
    value: Number(p.stock||0)*Number(p.cost||0)
  }))
  const totalValue = rows.reduce((a,r)=>a+r.value,0)
  return { totalValue, rows }
})
