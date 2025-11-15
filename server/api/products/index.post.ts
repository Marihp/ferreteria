import { requireAuth } from '../../utils/pb'
import { buildSku } from '../../utils/sku'

export default defineEventHandler(async (event) => {
  const pb = await requireAuth(event)
  const body = await readBody(event)
  const name = String(body.name || '').trim()
  if (!name) throw createError({ statusCode: 400, statusMessage: 'Nombre requerido' })

  let categoryRecord:any = null
  if (body.category) {
    try { categoryRecord = await pb.collection('categories').getOne(String(body.category), { requestKey: null }) } catch {}
  }
  const sku = await buildSku(pb, name, categoryRecord)

  const data:any = {
    sku,
    name,
    category: body.category || null,
    stock: Number(body.stock || 0),
    min_stock: Number(body.min_stock || 0),
    price: Number(body.price || 0),
    cost: Number(body.cost || 0),
    unit: String(body.unit || ''),
    location: String(body.location || ''),
    notes: String(body.notes || ''),
    active: body.active === false ? false : true
  }

  const rec = await pb.collection('inventory').create(data, { requestKey: null })
  return rec
})
