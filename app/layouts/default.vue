<template>
  <div>
    <nav class="bg-white border-b sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 py-2 flex gap-4 items-center">
        <NuxtLink to="/dashboard" class="font-semibold">OpenStock Ferretería</NuxtLink>
        <NuxtLink to="/inventario" class="text-gray-600 hover:text-black">Inventario</NuxtLink>
        <NuxtLink to="/reportes" class="text-gray-600 hover:text-black">Reportes</NuxtLink>
        <div class="ml-auto">
          <button @click="logout" class="px-3 py-1 rounded bg-gray-900 text-white">Salir</button>
        </div>
      </div>
    </nav>
    <main class="max-w-7xl mx-auto">
      <slot />
    </main>
  </div>
</template>
<script setup lang="ts">
const auth = useAuth()
const logout = () => auth.logout()
</script>
