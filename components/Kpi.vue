<script setup lang="ts">
defineProps<{ value: number | string }>()
</script>
<template>
  <div class="text-3xl font-semibold mt-2">
    {{ value }}
  </div>
</template>
