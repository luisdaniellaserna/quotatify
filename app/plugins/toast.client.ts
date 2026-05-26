import { useToast } from '~/composables/useToast'

export default defineNuxtPlugin((nuxtApp) => {
  const toast = useToast()
  nuxtApp.provide('toast', toast)
})
