import { requireAuth } from '../../utils/pb'
export default defineEventHandler( async (event) => {
  const pb = requireAuth(event)
  const b = await readBody(event)
  const data = {
    name: (b?.name || '').trim(),
    sku: (b?.sku || '').trim(),
    category: b?.category || null,
    cost: Number(b?.cost ?? 0),
    price: Number(b?.price ?? 0),
    stock: Number(b?.stock ?? 0),
    min_stock: Number(b?.min_stock ?? 0),
    active: typeof b?.active === 'boolean' ? b.active : true
  }
  if (!data.name || !data.sku) {
    throw createError({ statusCode: 400, statusMessage: 'Nombre y SKU son requeridos' })
  }
  return await pb.collection('products').create(data)
})
