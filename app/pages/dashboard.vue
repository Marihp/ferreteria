<template>
  <div class="p-6 space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-xl font-bold">Dashboard</h1>
      <button @click="refresh" class="px-3 py-1 rounded bg-gray-900 text-white">Actualizar</button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <KpiCard label="Productos">
        {{ data?.kpis.totalProducts }}
      </KpiCard>
      <KpiCard label="Valor de Inventario">
        {{ money(data?.kpis.inventoryValue || 0, cfg.public.currency) }}
      </KpiCard>
      <KpiCard label="Con stock bajo">
        {{ data?.kpis.lowStockCount }}
      </KpiCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="bg-white rounded-xl shadow p-4">
        <div class="font-semibold mb-2">Movimientos últimos 30 días</div>
        <ChartLine :categories="data?.movementChart.categories || []" :series="data?.movementChart.series || []"/>
      </div>
      <div class="bg-white rounded-xl shadow p-4">
        <div class="font-semibold mb-2">Valor por categoría</div>
        <ChartDonut :labels="data?.categoryChart.labels || []" :series="data?.categoryChart.series || []"/>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow p-4">
      <div class="font-semibold mb-3">Stock bajo (Top 10)</div>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="text-left text-gray-600">
              <th class="p-2">SKU</th><th class="p-2">Producto</th><th class="p-2">Stock</th><th class="p-2">Mínimo</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in data?.lowStock || []" :key="i.id" class="border-t">
              <td class="p-2">{{ i.sku }}</td>
              <td class="p-2">{{ i.name }}</td>
              <td class="p-2">{{ i.stock }}</td>
              <td class="p-2">{{ i.min_stock }}</td>
            </tr>
            <tr v-if="!data?.lowStock?.length"><td class="p-2" colspan="4" class="text-gray-500">Sin alertas</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { money } from '~/app/utils/format'
const cfg = useRuntimeConfig()
const { data, refresh } = await useFetch('/api/dashboard', { credentials: 'include' })
</script>
