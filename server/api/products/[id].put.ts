import { readBody } from 'h3'
import { requireAuth } from '../../utils/pb'

export default defineEventHandler(async (event) => {
  const pb = await requireAuth(event)
  const id = event.context.params?.id as string
  const body = await readBody(event)
  const payload: any = {}
  const set = (k: string, v: any) => { if (v !== undefined) payload[k] = v }

  set('sku', body.sku)
  set('name', body.name)
  set('category', body.categoryId)
  if (body.stock !== undefined) set('stock', Number(body.stock))
  if (body.min_stock !== undefined) set('min_stock', Number(body.min_stock))
  if (body.price !== undefined) set('price', Number(body.price))
  if (body.cost !== undefined) set('cost', Number(body.cost))
  set('location', body.location)
  set('unit', body.unit)
  if (body.active !== undefined) set('active', !!body.active)
  set('notes', body.notes)

  const updated = await pb.collection('inventory').update(id, payload)
  return { id: updated.id }
})
