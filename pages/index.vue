<script setup lang="ts">
onMounted(async () => {
  try {
    await $fetch('/api/auth/me', { credentials: 'include' })
    navigateTo('/inventario')
  } catch {
    navigateTo('/login')
  }
})
</script>
<template><p>Redirigiendo...</p></template>
