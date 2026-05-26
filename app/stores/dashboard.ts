export interface ModelUsage {
  name: string
  requests: number
}

export interface AgentDashboard {
  id: string
  name: string
  enabled: boolean
  apiKeyConfigured: boolean
  error: string | null
  totalRequests: number
  availableCredits: number
  usableRequests: number
  usableLimit: number
  percentage: number | null
  weeklyPercentage: number | null
  monthlyUsed: number
  monthlyTotal: number
  monthlyRemaining: number
  resetsIn: string
  models: ModelUsage[]
}

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
