import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMainStore = defineStore('main', () => {
  const isMainLoading = ref(false)

  return {
    isMainLoading
  }
})
