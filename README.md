# Ferretería - Inventario (Nuxt 3 + PocketBase)

Inventario simple para ferretería con:
- Autenticación contra colección `users` de PocketBase
- Inventario en colección `inventory`
- Categorías en colección `categories`
- SKU automático (`CAT-0001`, `CAT-0002`, ...) asegurando unicidad
- Filtros por categoría, búsqueda y stock
- Dashboard básico (KPIs + gráfico)

## Requisitos
- Node.js >= 18.17 (recomendado 20.x)
- PocketBase corriendo y accesible (BASE_URL)

## Variables
Crear `.env` (opcional) o exportar en el servicio:
```
BASE_URL=http://127.0.0.1:8090
NODE_ENV=production
PORT=3000
```

## Scripts
```
npm install
npm run build:node
npm start
```

Para systemd, apunta a `node .output/server/index.mjs` (puerto 3000).

## Esquema PocketBase
Colecciones esperadas:

### categories
- `name` (text, required)

### inventory
- `sku` (text, unique opcional)
- `name` (text, required)
- `category` (relation -> categories, optional)
- `stock` (number)
- `min_stock` (number)
- `price` (number)
- `cost` (number)
- `location` (text)
- `unit` (text)
- `active` (bool, default true)
- `notes` (text)

### users (autenticación nativa de PB)

## Endpoints principales
- `POST /api/auth/login` -> set cookie `pb_auth`
- `GET /api/auth/me`
- `GET /api/categories` / `POST /api/categories`
- `GET /api/products` (filtros: `search`, `categoryId`, `inStock`, `page`, `perPage`)
- `POST /api/products` (SKU automático si se omite)
- `GET /api/products/:id`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

## UI
- `/login`
- `/inventario`
- `/dashboard`
