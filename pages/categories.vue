<template>
  <div>
    <h1 class="text-2xl font-semibold mb-4">Categorías</h1>

    <form @submit.prevent="create" class="bg-white p-4 rounded-xl shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
      <div>
        <label class="text-sm">Nombre</label>
        <input v-model="form.name" class="w-full border rounded px-3 py-2" required/>
      </div>
      <div>
        <label class="text-sm">Código</label>
        <input v-model="form.code" class="w-full border rounded px-3 py-2" placeholder="Ej: TORN" />
      </div>
      <div>
        <label class="text-sm">Color</label>
        <input v-model="form.color" class="w-full border rounded px-3 py-2" placeholder="#RRGGBB o texto" />
      </div>
      <div class="md:pt-6">
        <button class="bg-blue-600 text-white px-4 py-2 rounded">Crear</button>
      </div>
      <div class="md:col-span-4">
        <label class="text-sm">Descripción</label>
        <textarea v-model="form.description" class="w-full border rounded px-3 py-2" rows="2"></textarea>
      </div>
    </form>

    <div class="bg-white rounded-xl shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 text-left">
          <tr>
            <th class="p-3">Nombre</th>
            <th class="p-3">Código</th>
            <th class="p-3">Color</th>
            <th class="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in items" :key="c.id" class="border-t">
            <td class="p-3">{{ c.name }}</td>
            <td class="p-3">{{ c.code }}</td>
            <td class="p-3">
              <span v-if="c.color" class="inline-flex items-center gap-2">
                <span class="w-4 h-4 rounded inline-block" :style="{ background: c.color }"></span>{{ c.color }}
              </span>
            </td>
            <td class="p-3">
              <button class="text-red-600" @click="del(c)">Eliminar</button>
            </td>
          </tr>
          <tr v-if="!items.length">
            <td colspan="4" class="p-4 text-center text-gray-500">Sin categorías</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
const items = ref<any[]>([])
const form = ref<any>({ name: '', code: '', color: '', description: '' })

const load = async () => {
  items.value = await $fetch('/api/categories', { credentials: 'include' })
}
const create = async () => {
  await $fetch('/api/categories', { method: 'POST', body: form.value, credentials: 'include' })
  form.value = { name: '', code: '', color: '', description: '' }
  await load()
}
const del = async (c:any) => {
  if (!confirm(`Eliminar categoría "${c.name}"?`)) return
  await $fetch(`/api/categories/${c.id}`, { method: 'DELETE', credentials: 'include' })
  await load()
}

onMounted(load)
</script>
