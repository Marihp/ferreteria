<template>
  <div class="bg-white rounded-xl shadow p-4">
    <div class="text-sm text-gray-500">{{ label }}</div>
    <div class="text-2xl font-semibold mt-1"><slot /></div>
  </div>
</template>
<script setup lang="ts">
defineProps<{ label: string }>()
</script>
