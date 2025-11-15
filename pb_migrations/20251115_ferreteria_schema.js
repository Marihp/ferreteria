/// PocketBase migration for Ferretería schema
migrate((app) => {
  const collections = [
    {
      "name": "categories",
      "type": "base",
      "system": false,
      "listRule": "@request.auth.id != ''",
      "viewRule": "@request.auth.id != ''",
      "createRule": "@request.auth.id != ''",
      "updateRule": "@request.auth.id != ''",
      "deleteRule": "@request.auth.id != ''",
      "indexes": ["CREATE UNIQUE INDEX idx_categories_name ON categories (name)"],
      "schema": [
        { "name": "name", "type": "text", "required": true, "unique": true, "options": { "min": 1, "max": 120 } }
      ]
    },
    {
      "name": "products",
      "type": "base",
      "system": false,
      "listRule": "@request.auth.id != ''",
      "viewRule": "@request.auth.id != ''",
      "createRule": "@request.auth.id != ''",
      "updateRule": "@request.auth.id != ''",
      "deleteRule": "@request.auth.id != ''",
      "indexes": ["CREATE UNIQUE INDEX idx_products_sku ON products (sku)"],
      "schema": [
        { "name": "name", "type": "text", "required": true, "unique": false, "options": { "min": 1, "max": 200 } },
        { "name": "sku", "type": "text", "required": true, "unique": true, "options": { "min": 1, "max": 120 } },
        { "name": "category", "type": "relation", "options": { "collectionId": "categories", "maxSelect": 1, "cascadeDelete": false } },
        { "name": "cost", "type": "number", "options": { "min": 0 } },
        { "name": "price", "type": "number", "options": { "min": 0 } },
        { "name": "stock", "type": "number", "options": { "min": 0 } },
        { "name": "min_stock", "type": "number", "options": { "min": 0 } },
        { "name": "active", "type": "bool", "options": {} }
      ]
    },
    {
      "name": "stock_movements",
      "type": "base",
      "system": false,
      "listRule": "@request.auth.id != ''",
      "viewRule": "@request.auth.id != ''",
      "createRule": "@request.auth.id != ''",
      "updateRule": null,
      "deleteRule": null,
      "indexes": [],
      "schema": [
        { "name": "product", "type": "relation", "required": true, "options": { "collectionId": "products", "maxSelect": 1, "cascadeDelete": false } },
        { "name": "quantity", "type": "number", "required": true, "options": {} },
        { "name": "type", "type": "select", "required": true, "options": { "maxSelect": 1, "values": ["in","out","adjust"] } },
        { "name": "note", "type": "text", "required": false, "options": { "max": 500 } }
      ]
    }
  ];

  app.importCollections(collections, false);
}, (app) => {
  // rollback: optional (no-op)
});
