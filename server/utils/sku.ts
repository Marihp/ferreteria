export function normalizeCode(input: string) {
  return (input || 'GEN').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6) || 'GEN'
}

export function randomSuffix(len=5) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = ''
  for (let i=0;i<len;i++) out += chars[Math.floor(Math.random()*chars.length)]
  return out
}

export async function buildSku(pb:any, name:string, categoryRecord:any) {
  const code = normalizeCode(categoryRecord?.code || categoryRecord?.name || 'GEN')
  for (let attempt=0; attempt<5; attempt++) {
    const sku = `${code}-${randomSuffix(6)}`
    try {
      const exist = await pb.collection('inventory').getFirstListItem(`sku = "${sku}"`, { requestKey: null })
      if (!exist) return sku
    } catch {
      // not found => ok to use
      return sku
    }
  }
  // fallback using timestamp
  return `${code}-${Date.now().toString().slice(-6)}`
}
