<template>
  <div class="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
    <h1 class="text-2xl font-semibold mb-4">Iniciar sesión</h1>
    <form @submit.prevent="submit" class="space-y-4">
      <div>
        <label class="block mb-1 text-sm">Email</label>
        <input v-model="email" type="email" class="w-full border rounded px-3 py-2" required />
      </div>
      <div>
        <label class="block mb-1 text-sm">Contraseña</label>
        <input v-model="password" type="password" class="w-full border rounded px-3 py-2" required />
      </div>
      <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>
      <button class="bg-blue-600 text-white px-4 py-2 rounded">Entrar</button>
    </form>
  </div>
</template>

<script setup lang="ts">
const email = ref('')
const password = ref('')
const error = ref('')
const user = useState<any>('user', () => null)

const submit = async () => {
  error.value = ''
  try {
    const res:any = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value },
      credentials: 'include'
    })
    user.value = res.user
    await navigateTo('/dashboard')
  } catch (e:any) {
    error.value = e?.data?.message || 'Error de autenticación'
  }
}
</script>
