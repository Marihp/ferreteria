<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold">Dashboard</h1>

    <div v-if="pending" class="text-gray-500">Cargando...</div>
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white p-4 rounded shadow">
          <div class="text-sm text-gray-500">Items en inventario</div>
          <div class="text-2xl font-semibold">{{ data.totalItems }}</div>
        </div>
        <div class="bg-white p-4 rounded shadow">
          <div class="text-sm text-gray-500">Costo total</div>
          <div class="text-2xl font-semibold">${{ format(data.totalCost) }}</div>
        </div>
        <div class="bg-white p-4 rounded shadow">
          <div class="text-sm text-gray-500">Valor de venta</div>
          <div class="text-2xl font-semibold">${{ format(data.totalValue) }}</div>
        </div>
        <div class="bg-white p-4 rounded shadow">
          <div class="text-sm text-gray-500">Ganancia potencial</div>
          <div class="text-2xl font-semibold">${{ format(data.potentialProfit) }}</div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div class="bg-white p-4 rounded shadow">
          <h2 class="font-semibold mb-2">Top categorías (por valor)</h2>
          <ul class="space-y-1">
            <li v-for="c in data.topCategories" :key="c.id" class="flex justify-between">
              <span>{{ c.name }}</span>
              <span>${{ format(c.value) }}</span>
            </li>
          </ul>
        </div>
        <div class="bg-white p-4 rounded shadow">
          <h2 class="font-semibold mb-2">Bajo stock</h2>
          <ul class="space-y-1">
            <li v-for="p in data.lowStock.slice(0,10)" :key="p.id" class="flex justify-between">
              <span>{{ p.name }} ({{ p.stock }})</span>
              <span>min {{ p.min_stock }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data, pending } = await useFetch('/api/dashboard/stats', { method: 'GET' })
function format(n: number) {
  try { return n.toLocaleString('es-CO') } catch { return String(n) }
}
definePageMeta({ middleware: ['auth'] })
</script>
