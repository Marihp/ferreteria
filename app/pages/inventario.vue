<template>
  <div class="p-6 space-y-4">
    <div class="flex justify-between items-center">
      <h1 class="text-xl font-bold">Inventario</h1>
      <div class="flex gap-2">
        <input v-model="search" placeholder="Buscar SKU o nombre..." class="border rounded px-3 py-1" />
        <button @click="openNew" class="px-3 py-1 rounded bg-gray-900 text-white">Nuevo producto</button>
        <button @click="reload" class="px-3 py-1 rounded bg-gray-200">Actualizar</button>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow p-4 overflow-x-auto">
      <table class="min-w-full text-sm">
        <thead>
          <tr class="text-left text-gray-600">
            <th class="p-2">SKU</th><th class="p-2">Producto</th><th class="p-2">Categoría</th>
            <th class="p-2">Costo</th><th class="p-2">Precio</th><th class="p-2">Stock</th><th class="p-2">Mínimo</th><th class="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in items" :key="p.id" class="border-t">
            <td class="p-2">{{ p.sku }}</td>
            <td class="p-2">{{ p.name }}</td>
            <td class="p-2">{{ p.expand?.category?.name || '—' }}</td>
            <td class="p-2">{{ money(p.cost, cfg.public.currency) }}</td>
            <td class="p-2">{{ money(p.price, cfg.public.currency) }}</td>
            <td class="p-2">{{ p.stock }}</td>
            <td class="p-2">{{ p.min_stock }}</td>
            <td class="p-2 flex gap-2">
              <button class="text-blue-600" @click="edit(p)">Editar</button>
              <button class="text-amber-600" @click="adjust(p)">Ajuste</button>
              <button class="text-red-600" @click="remove(p)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- modal producto -->
    <dialog ref="dlg" class="rounded-xl p-0 w-full max-w-lg">
      <form @submit.prevent="saveProduct" class="bg-white rounded-xl shadow p-6 space-y-3">
        <h2 class="text-lg font-semibold">{{ form.id ? 'Editar' : 'Nuevo' }} producto</h2>
        <div class="grid grid-cols-2 gap-3">
          <input v-model="form.sku" placeholder="SKU" class="border rounded px-3 py-2 col-span-1" required/>
          <input v-model="form.name" placeholder="Nombre" class="border rounded px-3 py-2 col-span-1" required/>
          <input v-model.number="form.cost" type="number" placeholder="Costo" class="border rounded px-3 py-2 col-span-1" min="0"/>
          <input v-model.number="form.price" type="number" placeholder="Precio" class="border rounded px-3 py-2 col-span-1" min="0"/>
          <input v-model.number="form.stock" type="number" placeholder="Stock" class="border rounded px-3 py-2 col-span-1" min="0"/>
          <input v-model.number="form.min_stock" type="number" placeholder="Mínimo" class="border rounded px-3 py-2 col-span-1" min="0"/>
          <input v-model="form.category" placeholder="ID Categoría (opcional)" class="border rounded px-3 py-2 col-span-2"/>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" @click="closeDlg" class="px-3 py-1 rounded bg-gray-200">Cancelar</button>
          <button class="px-3 py-1 rounded bg-gray-900 text-white">Guardar</button>
        </div>
      </form>
    </dialog>

    <!-- modal ajuste -->
    <dialog ref="dlgAdj" class="rounded-xl p-0 w-full max-w-md">
      <form @submit.prevent="saveAdjust" class="bg-white rounded-xl shadow p-6 space-y-3">
        <h2 class="text-lg font-semibold">Ajuste de stock - {{ current?.name }}</h2>
        <select v-model="adj.type" class="border rounded px-3 py-2 w-full">
          <option value="in">Entrada (+)</option>
          <option value="out">Salida (-)</option>
          <option value="adjust">Ajuste (+/-)</option>
        </select>
        <input v-model.number="adj.quantity" type="number" placeholder="Cantidad" class="border rounded px-3 py-2 w-full"/>
        <input v-model="adj.note" placeholder="Nota (opcional)" class="border rounded px-3 py-2 w-full"/>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" @click="closeAdj" class="px-3 py-1 rounded bg-gray-200">Cancelar</button>
          <button class="px-3 py-1 rounded bg-gray-900 text-white">Aplicar</button>
        </div>
      </form>
    </dialog>
  </div>
</template>
<script setup lang="ts">
import { money } from '~/app/utils/format'
const cfg = useRuntimeConfig()
const search = ref('')
const page = ref(1)
const items = ref<any[]>([])

const fetchItems = async () => {
  const { data } = await useFetch(`/api/products?page=${page.value}&perPage=100&search=${encodeURIComponent(search.value)}`, { credentials: 'include' })
  items.value = (data.value as any)?.items || []
}
const reload = () => fetchItems()
watch(search, () => fetchItems())
onMounted(fetchItems)

// modal producto
const form = reactive<any>({ id: null, sku:'', name:'', cost:0, price:0, stock:0, min_stock:0, category:'' })
const dlg = ref<HTMLDialogElement>() as any
const openNew = () => { Object.assign(form, { id:null, sku:'', name:'', cost:0, price:0, stock:0, min_stock:0, category:'' }); dlg.value.showModal() }
const edit = (p:any) => { Object.assign(form, { ...p, category: p.category || p.expand?.category?.id || '' }); dlg.value.showModal() }
const closeDlg = () => dlg.value.close()
const saveProduct = async () => {
  if (!form.id) await $fetch('/api/products', { method: 'POST', body: form, credentials: 'include' })
  else await $fetch(`/api/products/${form.id}`, { method: 'PATCH', body: form, credentials: 'include' })
  closeDlg(); fetchItems()
}

// ajuste
const current = ref<any>(null)
const adj = reactive<any>({ type: 'in', quantity: 0, note: '' })
const dlgAdj = ref<HTMLDialogElement>() as any
const adjust = (p:any) => { current.value = p; Object.assign(adj, { type:'in', quantity:0, note:'' }); dlgAdj.value.showModal() }
const closeAdj = () => dlgAdj.value.close()
const saveAdjust = async () => {
  await $fetch('/api/stock/move', {
    method: 'POST', credentials: 'include',
    body: { productId: current.value.id, type: adj.type, quantity: adj.quantity, note: adj.note }
  })
  closeAdj(); fetchItems()
}
</script>
