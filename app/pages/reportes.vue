<template>
  <div class="p-6 space-y-4">
    <h1 class="text-xl font-bold">Reportes</h1>
    <div class="bg-white rounded-xl shadow p-4">
      <div class="font-semibold mb-2">Valor de Inventario</div>
      <button @click="loadInv" class="px-3 py-1 rounded bg-gray-900 text-white mb-3">Calcular</button>
      <div v-if="inv">
        <div class="mb-2 font-semibold">Total: {{ money(inv.totalValue, cfg.public.currency) }}</div>
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead><tr class="text-left text-gray-600">
              <th class="p-2">SKU</th><th class="p-2">Producto</th><th class="p-2">Categoría</th>
              <th class="p-2">Stock</th><th class="p-2">Costo</th><th class="p-2">Valor</th>
            </tr></thead>
            <tbody>
              <tr v-for="r in inv.rows" :key="r.id" class="border-t">
                <td class="p-2">{{ r.sku }}</td>
                <td class="p-2">{{ r.name }}</td>
                <td class="p-2">{{ r.category }}</td>
                <td class="p-2">{{ r.stock }}</td>
                <td class="p-2">{{ money(r.cost, cfg.public.currency) }}</td>
                <td class="p-2">{{ money(r.value, cfg.public.currency) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow p-4">
      <div class="font-semibold mb-2">Movimientos</div>
      <div class="flex gap-2 mb-3">
        <input v-model="from" type="date" class="border rounded px-2 py-1"/>
        <input v-model="to" type="date" class="border rounded px-2 py-1"/>
        <button @click="loadMovs" class="px-3 py-1 rounded bg-gray-900 text-white">Consultar</button>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead><tr class="text-left text-gray-600">
            <th class="p-2">Fecha</th><th class="p-2">Producto</th><th class="p-2">SKU</th><th class="p-2">Tipo</th><th class="p-2">Cantidad</th><th class="p-2">Nota</th>
          </tr></thead>
          <tbody>
            <tr v-for="m in movs" :key="m.id" class="border-t">
              <td class="p-2">{{ m.created.slice(0,16).replace('T',' ') }}</td>
              <td class="p-2">{{ m.product?.name }}</td>
              <td class="p-2">{{ m.product?.sku }}</td>
              <td class="p-2">{{ m.type }}</td>
              <td class="p-2">{{ m.quantity }}</td>
              <td class="p-2">{{ m.note }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { money } from '~/app/utils/format'
const cfg = useRuntimeConfig()
const inv = ref<any|null>(null)
const from = ref('')
const to = ref('')
const movs = ref<any[]>([])
const loadInv = async () => { const { data } = await useFetch('/api/reports/inventory', { credentials:'include' }); inv.value = data.value as any }
const loadMovs = async () => {
  const qs = new URLSearchParams()
  if (from.value) qs.set('from', from.value)
  if (to.value) qs.set('to', to.value)
  const { data } = await useFetch('/api/reports/movements?'+qs.toString(), { credentials:'include' })
  movs.value = (data.value as any) || []
}
</script>
