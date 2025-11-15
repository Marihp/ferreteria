import { requireAuth } from '../../utils/pb'
export default defineEventHandler( async (event) => {
  const pb = requireAuth(event)
  const id = getRouterParam(event, 'id')!
  const b = await readBody(event)
  const data:any = {}
  ;['name','sku','category','cost','price','stock','min_stock','active'].forEach(k => {
    if (b?.[k] !== undefined) data[k] = b[k]
  })
  if (data.name) data.name = String(data.name).trim()
  if (data.sku) data.sku = String(data.sku).trim()
  if ('cost' in data) data.cost = Number(data.cost)
  if ('price' in data) data.price = Number(data.price)
  if ('stock' in data) data.stock = Number(data.stock)
  if ('min_stock' in data) data.min_stock = Number(data.min_stock)
  return await pb.collection('products').update(id, data)
})
