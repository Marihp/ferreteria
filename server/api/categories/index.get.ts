import { requireAuth } from '../../utils/pb'
export default defineEventHandler(async (event) => {
  const pb = requireAuth(event)
  const items = await pb.collection('categories').getFullList({ sort: '+name', requestKey: null })
  return items
})
