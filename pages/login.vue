<script setup lang="ts">
import { ref } from 'vue'
const email = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)

async function submit() {
  errorMsg.value = ''
  loading.value = true
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value },
      credentials: 'include'
    })
    navigateTo('/inventario')
  } catch (e: any) {
    errorMsg.value = e?.data?.message || 'Error de autenticación'
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <div class="min-h-[calc(100vh-56px)] grid place-items-center">
    <div class="bg-white rounded-2xl shadow p-8 w-full max-w-md">
      <h1 class="text-xl font-semibold mb-4">Ingresar</h1>
      <div class="space-y-3">
        <div>
          <label class="text-sm text-gray-600">Correo</label>
          <input v-model="email" class="w-full border rounded-lg px-3 py-2" placeholder="usuario@ejemplo.com" />
        </div>
        <div>
          <label class="text-sm text-gray-600">Contraseña</label>
          <input v-model="password" type="password" class="w-full border rounded-lg px-3 py-2" />
        </div>
        <p v-if="errorMsg" class="text-red-600 text-sm">{{ errorMsg }}</p>
        <button :disabled="loading" @click="submit"
                class="w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
          {{ loading ? 'Ingresando...' : 'Ingresar' }}
        </button>
      </div>
    </div>
  </div>
</template>
