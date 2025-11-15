# OpenStock Ferretería (Nuxt 3 + PocketBase)

## Variables
- `BASE_URL` = URL de PocketBase (por defecto `http://127.0.0.1:8090`)
- `AUTH_COOKIE_SECURE` = `true|false` (por defecto `false` para HTTP)

## Comandos
```bash
npm install
npm run build:node
node .output/server/index.mjs  # o systemd + nginx
```

Asegúrate de importar las colecciones en PocketBase (ver `pocketbase_collections_min.json`).
