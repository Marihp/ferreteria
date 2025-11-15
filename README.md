# OpenStock Ferretería (Nuxt 3 + PocketBase)

Español, mínimo pero funcional para inventario, dashboard y reportes. Conecta a PocketBase vía `BASE_URL`.

## Requisitos
- Node 18+
- PocketBase v0.23+ corriendo en `http://127.0.0.1:8090`
- Nginx proxy en :80 a Nuxt y (opcional) :8080 a PocketBase UI/API

## Variables de entorno
Crea `.env` con:
```env
BASE_URL=http://127.0.0.1:8090
NUXT_PUBLIC_APP_NAME=OpenStock Ferretería
NUXT_PUBLIC_CURRENCY=COP
```

## Instalación y build
```bash
npm ci || npm install
npm run build:node
node .output/server/index.mjs  # o systemd con tu openstock.service
```

## Endpoints
- Auth: `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- Productos: `GET/POST /api/products`, `PATCH/DELETE /api/products/:id`
- Categorías: `GET/POST /api/categories`, `PATCH/DELETE /api/categories/:id`
- Movimientos: `POST /api/stock/move`
- Dashboard: `GET /api/dashboard`
- Reportes: `GET /api/reports/inventory`, `GET /api/reports/movements?from=&to=`

## Migración de PocketBase
Copia `pb_migrations/20251115_ferreteria_schema.js` al directorio de migraciones de tu PocketBase y ejecuta:
```bash
sudo -u pocketbase /opt/pocketbase/pocketbase --dir /var/lib/pocketbase migrate up
sudo systemctl restart pocketbase
```

## Navegación
- `/login` → Iniciar sesión
- `/dashboard` → KPIs, movimientos últimos 30 días, valor por categoría
- `/inventario` → CRUD productos + ajustes de stock
- `/reportes` → Valor inventario y movimientos por fecha
