import { defineEventHandler } from 'h3'
import { readAgentsConfig } from '../utils/storage'
import { fetchAgentQuota } from '../utils/fetchers'

export default defineEventHandler(async () => {
  const config = await readAgentsConfig()
  const results = await Promise.all(
    config.agents.map((agent: any) => fetchAgentQuota(agent)),
  )

  return results.map((r) => ({
    id: r.id,
    name: r.name,
    enabled: r.enabled,
    apiKeyConfigured: r.apiKeyConfigured,
    error: r.error,
    totalRequests: r.totalRequests,
    availableCredits: r.availableCredits,
    usableRequests: r.usableRequests,
    usableLimit: r.usableLimit,
    percentage: r.percentage,
    weeklyPercentage: r.weeklyPercentage,
    monthlyUsed: r.monthlyUsed,
    monthlyTotal: r.monthlyTotal,
    monthlyRemaining: r.monthlyRemaining,
    resetsIn: r.resetsIn,
    models: r.models,
  }))
})
