import { defineStore } from 'pinia'

interface User {
  id: string
  email: string
  name: string
  verified: boolean
  admin?: boolean
}

export const useAuth = defineStore('auth', {
  state: () => ({
    user: null as User | null
  }),
  actions: {
    async fetchMe() {
      const { data, error } = await useFetch('/api/auth/me', { credentials:'include' })
      if (!error.value) this.user = data.value as any
    },
    async login(email:string, password:string) {
      const { data, error } = await useFetch('/api/auth/login', {
        method: 'POST',
        body: { email, password },
        credentials: 'include'
      })
      if (error.value) throw error.value
      await this.fetchMe()
    },
    async logout() {
      await $fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
      this.user = null
      navigateTo('/login')
    }
  }
})
