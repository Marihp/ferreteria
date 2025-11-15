import { requireAuth } from '../../utils/pb'
export default defineEventHandler((event) => {
  const pb = requireAuth(event)
  const model = pb.authStore.model
  return {
    id: model?.id,
    email: (model as any)?.email,
    name: (model as any)?.name,
    verified: (model as any)?.verified,
    admin: (model as any)?.admin ?? false
  }
})
