import { requireAuth } from '../../utils/pb'
export default defineEventHandler( async (event) => {
  const pb = requireAuth(event)
  const b = await readBody(event)
  const productId = String(b?.productId || '')
  const type = String(b?.type || '').toLowerCase() as 'in'|'out'|'adjust'
  const qty = Number(b?.quantity ?? 0)
  const note = (b?.note || '').toString()

  if (!productId || !['in','out','adjust'].includes(type) || isNaN(qty) || qty === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Datos inválidos' })
  }

  // get product
  const product = await pb.collection('products').getOne(productId, { requestKey: null })
  let delta = 0
  if (type === 'in') delta = Math.abs(qty)
  else if (type === 'out') delta = -Math.abs(qty)
  else delta = qty // adjust allows +/-

  const newStock = Math.max(0, Number(product.stock || 0) + delta)

  // create movement
  const movement = await pb.collection('stock_movements').create({
    product: productId,
    quantity: delta,
    type,
    note
  })

  // update product stock
  const updated = await pb.collection('products').update(productId, { stock: newStock })

  return { movement, product: updated }
})
