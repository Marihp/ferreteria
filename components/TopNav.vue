<template>
  <nav class="bg-white shadow">
    <div class="container mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <NuxtLink to="/" class="font-semibold">🏪 {{ appName }}</NuxtLink>
        <NuxtLink to="/dashboard" class="hover:underline">Dashboard</NuxtLink>
        <NuxtLink to="/inventory" class="hover:underline">Inventario</NuxtLink>
        <NuxtLink to="/categories" class="hover:underline">Categorías</NuxtLink>
      </div>
      <div class="flex items-center gap-3">
        <span v-if="user">{{ user.email }}</span>
        <NuxtLink to="/login" v-if="!user" class="text-blue-600 hover:underline">Ingresar</NuxtLink>
        <button v-else class="text-red-600" @click="logout">Salir</button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const appName = config.public.appName
const user = useState<any>('user', () => null)

const logout = async () => {
  await $fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
  user.value = null
  await navigateTo('/login')
}
</script>
