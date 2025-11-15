<template>
  <apexchart type="donut" height="260" :options="{ labels }" :series="series" />
</template>
<script setup lang="ts">
defineProps<{ labels: string[], series: number[] }>()
</script>
