<template>
  <div>
    <h1 class="text-2xl font-semibold mb-4">Inventario</h1>

    <div class="bg-white rounded-xl shadow p-4 mb-6">
      <form @submit.prevent="create" class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label class="text-sm">Nombre</label>
          <input v-model="form.name" required class="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label class="text-sm">Categoría</label>
          <select v-model="form.category" class="w-full border rounded px-3 py-2">
            <option :value="null">Sin categoría</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
        <div>
          <label class="text-sm">Unidad</label>
          <input v-model="form.unit" class="w-full border rounded px-3 py-2" placeholder="unidad, caja, metro…" />
        </div>
        <div>
          <label class="text-sm">Stock</label>
          <input v-model.number="form.stock" type="number" min="0" class="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label class="text-sm">Mínimo</label>
          <input v-model.number="form.min_stock" type="number" min="0" class="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label class="text-sm">Costo</label>
          <input v-model.number="form.cost" type="number" min="0" step="0.01" class="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label class="text-sm">Precio</label>
          <input v-model.number="form.price" type="number" min="0" step="0.01" class="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label class="text-sm">Ubicación</label>
          <input v-model="form.location" class="w-full border rounded px-3 py-2" placeholder="Pasillo A, repisa 4…" />
        </div>
        <div class="md:pt-6">
          <button class="bg-green-600 text-white px-4 py-2 rounded">Agregar</button>
        </div>
        <div class="md:col-span-3">
          <label class="text-sm">Notas</label>
          <textarea v-model="form.notes" rows="2" class="w-full border rounded px-3 py-2"></textarea>
        </div>
      </form>
    </div>

    <div class="bg-white rounded-xl shadow p-4 mb-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input v-model="q" @input="load" placeholder="Buscar…" class="border rounded px-3 py-2" />
        <select v-model="cat" @change="load" class="border rounded px-3 py-2">
          <option value="">Todas las categorías</option>
          <option v-for="c in categories" :value="c.id" :key="c.id">{{ c.name }}</option>
        </select>
        <label class="inline-flex items-center gap-2">
          <input type="checkbox" v-model="onlyLow" @change="load" />
          <span>Solo bajo mínimo</span>
        </label>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 text-left">
          <tr>
            <th class="p-3">SKU</th>
            <th class="p-3">Nombre</th>
            <th class="p-3">Categoría</th>
            <th class="p-3">Stock</th>
            <th class="p-3">Costo</th>
            <th class="p-3">Precio</th>
            <th class="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in items" :key="p.id" class="border-t">
            <td class="p-3">{{ p.sku }}</td>
            <td class="p-3">{{ p.name }}</td>
            <td class="p-3">{{ p.expand?.category?.name || '—' }}</td>
            <td class="p-3" :class="(p.stock||0) <= (p.min_stock||0) ? 'text-red-600 font-semibold' : ''">{{ p.stock ?? 0 }}</td>
            <td class="p-3">$ {{ Number(p.cost||0).toLocaleString() }}</td>
            <td class="p-3">$ {{ Number(p.price||0).toLocaleString() }}</td>
            <td class="p-3">
              <button class="text-red-600" @click="del(p)">Eliminar</button>
            </td>
          </tr>
          <tr v-if="!items.length">
            <td colspan="7" class="p-4 text-center text-gray-500">Sin productos</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
const categories = ref<any[]>([])
const items = ref<any[]>([])

const q = ref('')
const cat = ref('')
const onlyLow = ref(false)

const form = ref<any>({
  name: '', category: null, unit: '', stock: 0, min_stock: 0,
  cost: 0, price: 0, location: '', notes: '', active: true
})

const loadCats = async () => {
  categories.value = await $fetch('/api/categories', { credentials: 'include' })
}
const load = async () => {
  const url = new URL('/api/products', window.location.origin)
  if (q.value) url.searchParams.set('q', q.value)
  if (cat.value) url.searchParams.set('category', cat.value)
  if (onlyLow.value) url.searchParams.set('onlyLow', '1')
  const res:any = await $fetch(url.toString(), { credentials: 'include' })
  items.value = res.items
}
const create = async () => {
  await $fetch('/api/products', { method: 'POST', body: form.value, credentials: 'include' })
  form.value = { name: '', category: null, unit: '', stock: 0, min_stock: 0, cost: 0, price: 0, location: '', notes: '', active: true }
  await load()
}
const del = async (p:any) => {
  if (!confirm(`Eliminar "${p.name}"?`)) return
  await $fetch(`/api/products/${p.id}`, { method: 'DELETE', credentials: 'include' })
  await load()
}

onMounted(async () => { await loadCats(); await load() })
</script>
