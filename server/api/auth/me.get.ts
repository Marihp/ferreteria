import { requireAuth } from '../../utils/pb'
export default defineEventHandler( async (event) => {
  const pb = await requireAuth(event)
  const model:any = pb.authStore.model
  return {
    id: model.id, email: model.email, name: model.name,
    verified: !!model.verified, admin: !!model.admin
  }
})
