<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

type Category = { id: string; name: string }
type Product = {
  id: string; sku: string; name: string; categoryId: string|null; categoryName: string|null;
  stock: number; min_stock: number; price: number; cost: number; location: string; unit: string; active: boolean
}

const loading = ref(false)
const categories = ref<Category[]>([])
const products = ref<Product[]>([])
const totalItems = ref(0)
const page = ref(1)
const perPage = ref(10)

const search = ref('')
const categoryId = ref<string | ''>('')
const inStock = ref(false)

const showForm = ref(false)
const form = ref({
  sku: '', name: '', categoryId: '', stock: 0, min_stock: 0,
  price: 0, cost: 0, location: '', unit: '', active: true, notes: ''
})

async function loadCategories() {
  categories.value = await $fetch<Category[]>('/api/categories', { credentials: 'include' })
}

async function loadProducts() {
  loading.value = true
  try {
    const res = await $fetch<any>('/api/products', {
      query: {
        search: search.value || undefined,
        categoryId: categoryId.value || undefined,
        inStock: inStock.value ? '1' : undefined,
        page: page.value,
        perPage: perPage.value
      },
      credentials: 'include'
    })
    products.value = res.items
    totalItems.value = res.totalItems
  } finally {
    loading.value = false
  }
}

function resetForm() {
  form.value = { sku:'', name:'', categoryId:'', stock:0, min_stock:0, price:0, cost:0, location:'', unit:'', active:true, notes:'' }
}

async function createProduct() {
  await $fetch('/api/products', {
    method: 'POST',
    body: form.value,
    credentials: 'include'
  })
  showForm.value = false
  resetForm()
  await loadProducts()
}

watch([search, categoryId, inStock, page, perPage], loadProducts, { immediate: true })
onMounted(loadCategories)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold">Inventario</h1>
      <button class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700" @click="showForm=true">
        Nuevo producto
      </button>
    </div>

    <!-- Filtros -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
      <input v-model="search" placeholder="Buscar por nombre o SKU" class="border rounded-lg px-3 py-2">
      <select v-model="categoryId" class="border rounded-lg px-3 py-2">
        <option value="">Todas las categorías</option>
        <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>
      <label class="inline-flex items-center gap-2">
        <input type="checkbox" v-model="inStock">
        <span>Solo con stock</span>
      </label>
      <div class="text-sm text-gray-600 self-center">{{ totalItems }} ítems</div>
    </div>

    <!-- Tabla -->
    <div class="overflow-x-auto bg-white rounded-xl shadow">
      <table class="min-w-full">
        <thead class="bg-gray-50">
          <tr class="text-left text-sm text-gray-600">
            <th class="px-4 py-3">SKU</th>
            <th class="px-4 py-3">Producto</th>
            <th class="px-4 py-3">Categoría</th>
            <th class="px-4 py-3">Stock</th>
            <th class="px-4 py-3">Mínimo</th>
            <th class="px-4 py-3">Precio</th>
            <th class="px-4 py-3">Ubicación</th>
            <th class="px-4 py-3">Activo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="8" class="px-4 py-6 text-center text-gray-500">Cargando...</td>
          </tr>
          <tr v-for="p in products" :key="p.id" class="border-t">
            <td class="px-4 py-2 font-mono">{{ p.sku }}</td>
            <td class="px-4 py-2">{{ p.name }}</td>
            <td class="px-4 py-2">{{ p.categoryName || '—' }}</td>
            <td class="px-4 py-2" :class="p.stock <= p.min_stock ? 'text-red-600 font-semibold' : ''">{{ p.stock }}</td>
            <td class="px-4 py-2">{{ p.min_stock }}</td>
            <td class="px-4 py-2">$ {{ Number(p.price||0).toLocaleString() }}</td>
            <td class="px-4 py-2">{{ p.location }}</td>
            <td class="px-4 py-2">
              <span class="px-2 py-1 text-xs rounded" :class="p.active ? 'bg-green-100 text-green-700':'bg-gray-100 text-gray-600'">
                {{ p.active ? 'Sí' : 'No' }}
              </span>
            </td>
          </tr>
          <tr v-if="!loading && products.length === 0">
            <td colspan="8" class="px-4 py-6 text-center text-gray-500">Sin resultados</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div class="flex items-center gap-3 mt-4">
      <button class="px-3 py-1 border rounded" :disabled="page<=1" @click="page--">Anterior</button>
      <span>Página {{ page }}</span>
      <button class="px-3 py-1 border rounded" :disabled="products.length < perPage" @click="page++">Siguiente</button>
      <select v-model.number="perPage" class="ml-auto border rounded px-2 py-1">
        <option :value="10">10</option>
        <option :value="20">20</option>
        <option :value="50">50</option>
      </select>
    </div>

    <!-- Modal nuevo producto -->
    <div v-if="showForm" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">Nuevo producto</h2>
          <button class="text-gray-500 hover:text-gray-700" @click="showForm=false">✕</button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="text-sm text-gray-600">Nombre *</label>
            <input v-model="form.name" class="w-full border rounded-lg px-3 py-2" placeholder="Ej: Tornillo 1/4">
          </div>
          <div>
            <label class="text-sm text-gray-600">SKU (auto si lo dejas vacío)</label>
            <input v-model="form.sku" class="w-full border rounded-lg px-3 py-2" placeholder="Se generará automáticamente">
          </div>
          <div>
            <label class="text-sm text-gray-600">Categoría</label>
            <select v-model="form.categoryId" class="w-full border rounded-lg px-3 py-2">
              <option value="">Sin categoría</option>
              <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
          <div>
            <label class="text-sm text-gray-600">Precio (venta)</label>
            <input v-model.number="form.price" type="number" min="0" step="0.01" class="w-full border rounded-lg px-3 py-2">
          </div>
          <div>
            <label class="text-sm text-gray-600">Costo</label>
            <input v-model.number="form.cost" type="number" min="0" step="0.01" class="w-full border rounded-lg px-3 py-2">
          </div>
          <div>
            <label class="text-sm text-gray-600">Stock inicial</label>
            <input v-model.number="form.stock" type="number" min="0" step="1" class="w-full border rounded-lg px-3 py-2">
          </div>
          <div>
            <label class="text-sm text-gray-600">Stock mínimo</label>
            <input v-model.number="form.min_stock" type="number" min="0" step="1" class="w-full border rounded-lg px-3 py-2">
          </div>
          <div>
            <label class="text-sm text-gray-600">Ubicación (bodega/estante)</label>
            <input v-model="form.location" class="w-full border rounded-lg px-3 py-2" placeholder="Ej: B1-E3">
          </div>
          <div>
            <label class="text-sm text-gray-600">Unidad</label>
            <input v-model="form.unit" class="w-full border rounded-lg px-3 py-2" placeholder="Ej: unidad, caja, metro">
          </div>
          <div class="flex items-center gap-2 mt-6">
            <input type="checkbox" v-model="form.active" id="activo">
            <label for="activo" class="text-sm text-gray-700">Activo</label>
          </div>
          <div class="md:col-span-2">
            <label class="text-sm text-gray-600">Notas</label>
            <textarea v-model="form.notes" class="w-full border rounded-lg px-3 py-2" rows="3"></textarea>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button class="px-4 py-2 rounded-lg border" @click="showForm=false">Cancelar</button>
          <button class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700" @click="createProduct">Guardar</button>
        </div>
      </div>
    </div>
  </div>
</template>
