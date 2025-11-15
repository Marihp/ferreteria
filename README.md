# OpenStock Ferretería (Refined)

## Variables de entorno (servidor Nuxt)
- `BASE_URL` → URL del PocketBase (ej: `http://127.0.0.1:8090`)

## Scripts
- `npm run dev` → desarrollo
- `npm run build:node && npm start` → producción (node server)

## Endpoints clave
- `POST /api/auth/login` → establece cookie `pb_auth` (SameSite=Lax, Secure sólo si viene HTTPS)
- `GET /api/auth/me` → info de usuario autenticado
- `GET/POST /api/categories`, `DELETE /api/categories/:id`
- `GET/POST /api/inventory`, `DELETE /api/inventory/:id`
- `GET /api/dashboard/stats` → métricas

## Notas
- El SKU se genera automáticamente en el servidor al crear un producto.
- Las páginas `/dashboard`, `/inventory`, `/categories` están protegidas con middleware.
