<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts'
const chartOpts = reactive({
  chart: { id: 'inv' },
  xaxis: { categories: [] as string[] }
})
const chartSeries = ref([{ name: 'Stock', data: [] as number[] }])

onMounted(async () => {
  const res: any = await $fetch('/api/products?perPage=10', { credentials: 'include' })
  chartOpts.xaxis.categories = res.items.map((p: any) => p.name)
  chartSeries.value[0].data = res.items.map((p: any) => p.stock || 0)
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold mb-6">Dashboard</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white rounded-xl shadow p-4">
        <div class="text-sm text-gray-600">Productos</div>
        <Kpi :value="kpis.products" />
      </div>
      <div class="bg-white rounded-xl shadow p-4">
        <div class="text-sm text-gray-600">Bajo mínimo</div>
        <Kpi :value="kpis.low" />
      </div>
      <div class="bg-white rounded-xl shadow p-4">
        <div class="text-sm text-gray-600">Stock total</div>
        <Kpi :value="kpis.totalStock" />
      </div>
    </div>

    <div class="bg-white rounded-xl shadow p-4">
      <client-only>
        <VueApexCharts type="bar" height="320" :options="chartOpts" :series="chartSeries" />
      </client-only>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive } from 'vue'
import Kpi from '@/components/Kpi.vue'
import VueApexCharts from 'vue3-apexcharts'

export default defineComponent({
  components: { Kpi, VueApexCharts },
  setup() {
    const kpis = ref({ products: 0, low: 0, totalStock: 0 })
    onMounted(async () => {
      const res: any = await $fetch('/api/products?perPage=200', { credentials: 'include' })
      kpis.value.products = res.totalItems
      kpis.value.low = res.items.filter((p: any) => (p.stock || 0) <= (p.min_stock || 0)).length
      kpis.value.totalStock = res.items.reduce((s: number, p: any) => s + (p.stock || 0), 0)
    })
    return { kpis }
  }
})
</script>
