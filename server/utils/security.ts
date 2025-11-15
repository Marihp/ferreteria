import { H3Event, setHeader } from 'h3'

export function secureHeaders(event: H3Event) {
  setHeader(event, 'X-Frame-Options', 'DENY')
  setHeader(event, 'X-Content-Type-Options', 'nosniff')
  setHeader(event, 'Referrer-Policy', 'no-referrer')
  setHeader(event, 'Content-Security-Policy', "script-src 'none'; frame-ancestors 'none';")
}

export function sanitizeText(s: any) {
  if (typeof s !== 'string') return ''
  return s.replace(/[<>]/g, '').trim()
}

export function toNumber(n: any, def = 0) {
  const v = Number(n)
  return Number.isFinite(v) ? v : def
}
