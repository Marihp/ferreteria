import dayjs from 'dayjs'
export const money = (v:number, currency='COP') =>
  new Intl.NumberFormat('es-CO', { style:'currency', currency, maximumFractionDigits:0 }).format(v||0)
export const date = (d:string|Date) => dayjs(d).format('YYYY-MM-DD HH:mm')
