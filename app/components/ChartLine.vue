<template>
  <apexchart type="line" height="220" :options="opts" :series="series" />
</template>
<script setup lang="ts">
const props = defineProps<{ categories: string[], series: number[] }>()
const opts = computed(()=> ({
  chart: { toolbar: { show: false } },
  xaxis: { categories: props.categories },
  stroke: { curve: 'smooth' }
}))
const series = computed(()=> [{ name: 'Movimientos netos', data: props.series }])
</script>
