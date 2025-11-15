<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="w-full max-w-md bg-white rounded-xl shadow p-6 space-y-4">
      <h1 class="text-2xl font-bold text-center">{{ appName }}</h1>
      <p class="text-sm text-gray-500 text-center">Iniciar sesión</p>
      <form @submit.prevent="onLogin" class="space-y-3">
        <input v-model="email" type="email" placeholder="Correo" class="w-full border rounded-lg px-3 py-2" required/>
        <input v-model="password" type="password" placeholder="Contraseña" class="w-full border rounded-lg px-3 py-2" required/>
        <button :disabled="loading" class="w-full py-2 rounded-lg bg-black text-white hover:bg-gray-800 disabled:opacity-60">
          {{ loading ? 'Ingresando...' : 'Entrar' }}
        </button>
      </form>
      <p v-if="err" class="text-red-600 text-sm">{{ err }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
const cfg = useRuntimeConfig()
const appName = cfg.public.appName || 'OpenStock Ferretería'
const email = ref('')
const password = ref('')
const loading = ref(false)
const err = ref('')
const auth = useAuth()
const onLogin = async () => {
  loading.value = true; err.value=''
  try {
    await auth.login(email.value, password.value)
    navigateTo('/dashboard')
  } catch(e:any) {
    err.value = 'Credenciales inválidas'
  } finally {
    loading.value = false
  }
}
</script>
