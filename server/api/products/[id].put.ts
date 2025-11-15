import { requireAuth } from '../../utils/pb'

export default defineEventHandler(async (event) => {
  const pb = await requireAuth(event)
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)
  const data:any = { ...body }
  delete data.id
  delete data.sku // SKU no editable aquí
  const rec = await pb.collection('inventory').update(id, data, { requestKey: null })
  return rec
})
