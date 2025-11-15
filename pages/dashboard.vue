<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts'
const kpis = ref<any>(null)
const barOptions = ref<any>({ chart: { id: 'stock-by-cat' }, xaxis: { categories: [] } })
const barSeries = ref<any>([{ name: 'Stock', data: [] }])
const donutOptions = ref<any>({ chart: { id: 'value-donut' }, labels: ['Costo', 'Venta'] })
const donutSeries = ref<number[]>([])

onMounted(async () => {
  const s:any = await $fetch('/api/dashboard/stats', { credentials: 'include' })
  kpis.value = s
  barOptions.value.xaxis.categories = s.byCategory.map((c:any) => c.name)
  barSeries.value[0].data = s.byCategory.map((c:any) => c.stock)
  donutSeries.value = [s.invCost, s.invRevenue]
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold mb-6">Dashboard</h1>
    <div v-if="!kpis">Cargando…</div>
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-xl shadow p-4">
          <div class="text-sm text-gray-600">Productos (activos)</div>
          <div class="text-3xl font-semibold mt-2">{{ kpis.products }}</div>
        </div>
        <div class="bg-white rounded-xl shadow p-4">
          <div class="text-sm text-gray-600">Bajo mínimo</div>
          <div class="text-3xl font-semibold mt-2">{{ kpis.low }}</div>
        </div>
        <div class="bg-white rounded-xl shadow p-4">
          <div class="text-sm text-gray-600">Stock total</div>
          <div class="text-3xl font-semibold mt-2">{{ kpis.totalStock }}</div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="bg-white rounded-xl shadow p-4">
          <h2 class="font-semibold mb-3">Stock por categoría</h2>
          <client-only>
            <VueApexCharts type="bar" height="320" :options="barOptions" :series="barSeries" />
          </client-only>
        </div>
        <div class="bg-white rounded-xl shadow p-4">
          <h2 class="font-semibold mb-3">Valor de inventario</h2>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <div class="text-sm text-gray-600">Costo</div>
              <div class="text-2xl font-semibold">$ {{ Number(kpis.invCost).toLocaleString() }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-600">Venta</div>
              <div class="text-2xl font-semibold">$ {{ Number(kpis.invRevenue).toLocaleString() }}</div>
            </div>
            <div class="col-span-2">
              <div class="text-sm text-gray-600">Ganancia potencial</div>
              <div class="text-2xl font-semibold" :class="kpis.invProfit >= 0 ? 'text-green-600':'text-red-600'">
                $ {{ Number(kpis.invProfit).toLocaleString() }}
              </div>
            </div>
          </div>
          <div class="mt-4">
            <client-only>
              <VueApexCharts type="donut" height="300" :options="donutOptions" :series="donutSeries" />
            </client-only>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
export default defineComponent({ components: { VueApexCharts } })
</script>
