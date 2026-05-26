export interface ApiKeyStatus {
  id: string
  name: string
  maskedKey: string
  configured: boolean
}

export function useApiKeys() {
  const keys = ref<ApiKeyStatus[]>([])
  const loading = ref(false)
  const saving = ref(false)

  async function fetch() {
    loading.value = true
    try {
      keys.value = await $fetch<ApiKeyStatus[]>('/api/keys')
    } catch (e: any) {
      console.error('Failed to fetch API keys:', e)
    } finally {
      loading.value = false
    }
  }

  async function save(agentKeys: { id: string; apiKey: string }[]) {
    saving.value = true
    try {
      await $fetch('/api/keys', {
        method: 'PUT',
        body: { agents: agentKeys },
      })
      await fetch()
      return true
    } catch (e: any) {
      console.error('Failed to save API keys:', e)
      return false
    } finally {
      saving.value = false
    }
  }

  return { keys, loading, saving, fetch, save }
}
