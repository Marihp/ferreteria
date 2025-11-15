<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <header class="bg-white shadow">
      <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div class="font-semibold">OpenStock Ferretería</div>
        <div class="flex items-center gap-4">
          <NuxtLink to="/dashboard" class="hover:underline">Dashboard</NuxtLink>
          <NuxtLink to="/inventory" class="hover:underline">Inventario</NuxtLink>
          <NuxtLink to="/categories" class="hover:underline">Categorías</NuxtLink>
          <button class="text-sm text-red-600 hover:underline" @click="logout">Salir</button>
        </div>
      </nav>
    </header>
    <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
async function logout() {
  try {
    // limpiar cookie del lado servidor (opcional). Por simplicidad solo expiramos cookie en cliente.
    document.cookie = 'pb_auth=; Max-Age=0; path=/'
    await navigateTo('/login')
  } catch {}
}
</script>
