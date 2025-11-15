import { getQuery } from 'h3'
import { requireAuth } from '../../utils/pb'
import { secureHeaders } from '../../utils/security'

export default defineEventHandler(async (event) => {
  secureHeaders(event)
  const { pb } = await requireAuth(event)
  const q = getQuery(event)
  const page = Number(q.page || 1)
  const perPage = Number(q.perPage || 200)
  const filter = ''

  const list = await pb.collection('inventory').getList(page, perPage, {
    filter,
    sort: '-created',
    expand: 'category'
  })
  return list
})
