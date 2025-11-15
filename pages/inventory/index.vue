<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Inventario</h1>
      <button class="bg-blue-600 text-white px-3 py-2 rounded" @click="showCreate = !showCreate">
        {{ showCreate ? 'Cerrar' : 'Nuevo producto' }}
      </button>
    </div>

    <div v-if="showCreate" class="bg-white rounded shadow p-4">
      <h2 class="font-semibold mb-3">Crear producto</h2>
      <form @submit.prevent="create" class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div class="md:col-span-2">
          <label class="block text-sm mb-1">Nombre</label>
          <input v-model="form.name" class="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label class="block text-sm mb-1">Categoría</label>
          <select v-model="form.category" class="w-full border rounded px-3 py-2">
            <option :value="''">Sin categoría</option>
            <option v-for="c in categories.items" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm mb-1">Costo</label>
          <input v-model.number="form.cost" type="number" step="0.01" class="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label class="block text-sm mb-1">Precio</label>
          <input v-model.number="form.price" type="number" step="0.01" class="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label class="block text-sm mb-1">Stock</label>
          <input v-model.number="form.stock" type="number" class="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label class="block text-sm mb-1">Stock mínimo</label>
          <input v-model.number="form.min_stock" type="number" class="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label class="block text-sm mb-1">Unidad (ej: und, caja)</label>
          <input v-model="form.unit" class="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm mb-1">Ubicación (opcional)</label>
          <input v-model="form.location" class="w-full border rounded px-3 py-2" />
        </div>
        <div class="md:col-span-3">
          <label class="block text-sm mb-1">Descripción</label>
          <textarea v-model="form.description" class="w-full border rounded px-3 py-2"></textarea>
        </div>
        <div class="md:col-span-3">
          <p class="text-sm text-gray-500">El SKU se genera automáticamente en el servidor.</p>
        </div>
        <div class="md:col-span-3">
          <button :disabled="saving" class="bg-green-600 text-white px-3 py-2 rounded">
            {{ saving ? 'Guardando...' : 'Guardar producto' }}
          </button>
        </div>
        <p v-if="error" class="text-red-600 text-sm md:col-span-3">{{ error }}</p>
      </form>
    </div>

    <div class="bg-white rounded shadow">
      <div class="p-4 grid grid-cols-1 md:grid-cols-4 gap-3 border-b">
        <input v-model="q" placeholder="Buscar por nombre o SKU" class="border rounded px-3 py-2 w-full" />
        <select v-model="categoryFilter" class="border rounded px-3 py-2 w-full">
          <option value="">Todas las categorías</option>
          <option v-for="c in categories.items" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
        <select v-model="stockFilter" class="border rounded px-3 py-2 w-full">
          <option value="">Todo stock</option>
          <option value="low">Bajo stock</option>
          <option value="ok">Stock OK</option>
        </select>
        <div class="text-sm text-gray-500 flex items-center">Total: {{ list?.totalItems || 0 }}</div>
      </div>

      <table class="w-full text-sm">
        <thead>
          <tr class="text-left border-b">
            <th class="p-3">SKU</th>
            <th class="p-3">Nombre</th>
            <th class="p-3">Categoría</th>
            <th class="p-3">Stock</th>
            <th class="p-3">Costo</th>
            <th class="p-3">Precio</th>
            <th class="p-3 w-24"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in filtered" :key="p.id" class="border-b hover:bg-gray-50">
            <td class="p-3">{{ p.sku }}</td>
            <td class="p-3">{{ p.name }}</td>
            <td class="p-3">{{ p.expand?.category?.name || '-' }}</td>
            <td class="p-3">{{ p.stock }}</td>
            <td class="p-3">${{ format(p.cost) }}</td>
            <td class="p-3">${{ format(p.price) }}</td>
            <td class="p-3 text-right">
              <button class="text-red-600 hover:underline" @click="remove(p.id)">Eliminar</button>
            </td>
          </tr>
          <tr v-if="!filtered.length">
            <td class="p-3 text-gray-500" colspan="7">Sin resultados</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
const showCreate = ref(false)
const saving = ref(false)
const error = ref('')
const q = ref('')
const categoryFilter = ref('')
const stockFilter = ref('')

const form = reactive({
  name: '',
  category: '',
  cost: 0,
  price: 0,
  stock: 0,
  min_stock: 0,
  unit: 'und',
  location: '',
  description: '',
  active: true
})

const { data: categories } = await useFetch('/api/categories', { method: 'GET' })
const { data: list, refresh } = await useFetch('/api/inventory', { method: 'GET' })

const filtered = computed(() => {
  if (!list.value) return []
  const needle = q.value.trim().toLowerCase()
  return list.value.items.filter((p: any) => {
    const okText = !needle || p.name.toLowerCase().includes(needle) || p.sku.toLowerCase().includes(needle)
    const okCat = !categoryFilter.value || p.category === categoryFilter.value || p.expand?.category?.id === categoryFilter.value
    const okStock = !stockFilter.value ||
      (stockFilter.value === 'low' && p.stock <= p.min_stock) ||
      (stockFilter.value === 'ok' && p.stock > p.min_stock)
    return okText && okCat && okStock
  })
})

async function create() {
  error.value = ''
  saving.value = true
  try {
    await $fetch('/api/inventory', { method: 'POST', body: form })
    Object.assign(form, { name: '', category: '', cost: 0, price: 0, stock: 0, min_stock: 0, unit: 'und', location: '', description: '', active: true })
    showCreate.value = false
    await refresh()
  } catch (e: any) {
    error.value = e?.data?.message || e?.statusMessage || 'No se pudo crear'
  } finally {
    saving.value = false
  }
}

async function remove(id: string) {
  if (!confirm('¿Eliminar producto?')) return
  try {
    await $fetch(`/api/inventory/${id}`, { method: 'DELETE' })
    await refresh()
  } catch {}
}

function format(n: number) {
  try { return n.toLocaleString('es-CO') } catch { return String(n) }
}

definePageMeta({ middleware: ['auth'] })
</script>
