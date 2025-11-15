<template>
  <div>
    <header class="bg-white border-b">
      <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-2 h-6 bg-blue-600 rounded"></div>
          <NuxtLink to="/" class="font-semibold">Ferretería</NuxtLink>
        </div>
        <nav class="flex gap-4 text-sm">
          <NuxtLink to="/inventario" class="hover:underline">Inventario</NuxtLink>
          <NuxtLink to="/dashboard" class="hover:underline">Dashboard</NuxtLink>
        </nav>
      </div>
    </header>
    <div class="max-w-7xl mx-auto px-4 py-6">
      <NuxtPage />
    </div>
  </div>
</template>
