<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Categorías</h1>
      <button class="bg-blue-600 text-white px-3 py-2 rounded" @click="showCreate = !showCreate">
        {{ showCreate ? 'Cerrar' : 'Nueva categoría' }}
      </button>
    </div>

    <div v-if="showCreate" class="bg-white rounded shadow p-4">
      <h2 class="font-semibold mb-3">Crear categoría</h2>
      <form @submit.prevent="create" class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label class="block text-sm mb-1">Nombre</label>
          <input v-model="form.name" class="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label class="block text-sm mb-1">Código</label>
          <input v-model="form.code" class="w-full border rounded px-3 py-2" required />
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm mb-1">Descripción</label>
          <textarea v-model="form.description" class="w-full border rounded px-3 py-2"></textarea>
        </div>
        <div>
          <label class="block text-sm mb-1">Color (opcional)</label>
          <input v-model="form.color" class="w-full border rounded px-3 py-2" placeholder="#FF0000 o texto" />
        </div>
        <div class="flex items-end gap-2">
          <label class="text-sm">Activa</label>
          <input type="checkbox" v-model="form.isActive" class="ml-2" />
        </div>
        <div class="md:col-span-2">
          <button :disabled="saving" class="bg-green-600 text-white px-3 py-2 rounded">
            {{ saving ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
        <p v-if="error" class="text-red-600 text-sm md:col-span-2">{{ error }}</p>
      </form>
    </div>

    <div class="bg-white rounded shadow">
      <div class="p-4 border-b">
        <input v-model="q" placeholder="Buscar por nombre o código" class="w-full border rounded px-3 py-2" />
      </div>
      <table class="w-full text-sm">
        <thead>
          <tr class="text-left border-b">
            <th class="p-3">Nombre</th>
            <th class="p-3">Código</th>
            <th class="p-3">Activa</th>
            <th class="p-3 w-24"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in filtered" :key="c.id" class="border-b hover:bg-gray-50">
            <td class="p-3">{{ c.name }}</td>
            <td class="p-3">{{ c.code }}</td>
            <td class="p-3">{{ c.isActive ? 'Sí' : 'No' }}</td>
            <td class="p-3 text-right">
              <button class="text-red-600 hover:underline" @click="remove(c.id)">Eliminar</button>
            </td>
          </tr>
          <tr v-if="!filtered.length">
            <td class="p-3 text-gray-500" colspan="4">Sin resultados</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
const showCreate = ref(false)
const saving = ref(false)
const error = ref('')
const q = ref('')
const form = reactive({ name: '', code: '', description: '', color: '', isActive: true })

const { data: list, refresh } = await useFetch('/api/categories', { method: 'GET' })

const filtered = computed(() => {
  if (!list.value) return []
  const needle = q.value.trim().toLowerCase()
  if (!needle) return list.value.items
  return list.value.items.filter((c: any) => 
    c.name.toLowerCase().includes(needle) || c.code.toLowerCase().includes(needle)
  )
})

async function create() {
  error.value = ''
  saving.value = true
  try {
    await $fetch('/api/categories', { method: 'POST', body: form })
    Object.assign(form, { name: '', code: '', description: '', color: '', isActive: true })
    showCreate.value = false
    await refresh()
  } catch (e: any) {
    error.value = e?.data?.message || e?.statusMessage || 'No se pudo crear'
  } finally {
    saving.value = false
  }
}

async function remove(id: string) {
  if (!confirm('¿Eliminar categoría?')) return
  try {
    await $fetch(`/api/categories/${id}`, { method: 'DELETE' })
    await refresh()
  } catch {}
}

definePageMeta({ middleware: ['auth'] })
</script>
