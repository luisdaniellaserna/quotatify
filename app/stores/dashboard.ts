import type { ProviderMetric, ProviderSummary } from '#shared/types/provider'

export type { ProviderMetric, ProviderSummary }

export type AgentDashboard = ProviderSummary

export const useDashboardStore = defineStore('dashboard', () => {
  const agents = ref<AgentDashboard[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  async function fetch() {
    loading.value = true
    error.value = null
    try {
      agents.value = await $fetch<AgentDashboard[]>('/api/dashboard')
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch dashboard'
    } finally {
      loading.value = false
    }
  }

  return { agents, loading, error, fetch }
})
