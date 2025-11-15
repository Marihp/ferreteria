import { readBody } from 'h3'
import { requireAuth } from '../../utils/pb'

function toCode(name?: string) {
  if (!name) return 'GEN'
  const letters = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z]/g, '')
  return (letters.slice(0, 3) || 'GEN')
}

export default defineEventHandler(async (event) => {
  const pb = await requireAuth(event)
  const body = await readBody(event)

  const name = String(body?.name || '').trim()
  if (!name) throw createError({ statusCode: 400, statusMessage: 'El nombre es obligatorio' })

  const categoryId = body?.categoryId || null
  let sku = String(body?.sku || '').trim()

  if (!sku) {
    let catCode = 'GEN'
    if (categoryId) {
      try {
        const cat = await pb.collection('categories').getOne(categoryId)
        catCode = toCode(cat?.name || 'GEN')
      } catch {}
    } else {
      catCode = toCode(name)
    }
    for (let i = 1; i <= 9999; i++) {
      const cand = `${catCode}-${String(i).padStart(4, '0')}`
      const exists = await pb.collection('inventory').getList(1, 1, { filter: `sku = "${cand}"` })
        .then(r => r.totalItems > 0)
        .catch(() => false)
      if (!exists) { sku = cand; break }
    }
    if (!sku) throw createError({ statusCode: 500, statusMessage: 'No fue posible generar SKU' })
  }

  const payload: any = {
    sku,
    name,
    category: categoryId || null,
    stock: Number(body?.stock ?? 0),
    min_stock: Number(body?.min_stock ?? 0),
    price: Number(body?.price ?? 0),
    cost: Number(body?.cost ?? 0),
    location: String(body?.location || ''),
    unit: String(body?.unit || ''),
    active: body?.active !== false,
    notes: String(body?.notes || '')
  }

  const created = await pb.collection('inventory').create(payload)
  return { id: created.id, sku }
})
