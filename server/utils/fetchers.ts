export interface AgentConfig {
  id: string
  name: string
  envKey: string
  apiKey: string
  enabled: boolean
  quotaUrl: string
  authType: string
}

export interface ModelUsage {
  name: string
  requests: number
}

export interface QuotaResult {
  id: string
  name: string
  enabled: boolean
  apiKeyConfigured: boolean
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
  error: string | null
}

function formatResetTime(ts: number): string {
  const d = new Date(ts)
  const h = d.getHours()
  const m = d.getMinutes()
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
}

async function fetchCrofQuota(agent: AgentConfig, apiKey: string): Promise<QuotaResult> {
  const res: any = await $fetch(agent.quotaUrl, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })

  return {
    id: agent.id,
    name: agent.name,
    enabled: agent.enabled,
    apiKeyConfigured: true,
    totalRequests: res?.requests_plan ? res.requests_plan - (res?.usable_requests ?? 0) : 0,
    availableCredits: res?.credits ?? 0,
    usableRequests: res?.usable_requests ?? 0,
    usableLimit: res?.requests_plan ?? 1000,
    percentage: null,
    weeklyPercentage: null,
    monthlyUsed: 0,
    monthlyTotal: 0,
    monthlyRemaining: 0,
    resetsIn: '1:00 PM',
    models: [],
    error: null,
  }
}

async function fetchZaiQuota(agent: AgentConfig, apiKey: string): Promise<QuotaResult> {
  const res: any = await $fetch(agent.quotaUrl, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })

  const data = res?.data ?? res
  const limits = data?.limits ?? []
  const timeLimit = limits.find((l: any) => l.type === 'TIME_LIMIT' && !l.unit)
  const monthlyTokenLimit = limits.find((l: any) => l.type === 'TOKENS_LIMIT' && l.unit === 3)
  const weeklyTokenLimit = limits.find((l: any) => l.type === 'TOKENS_LIMIT' && l.unit === 6)
  const mcpTimeLimit = limits.find((l: any) => l.type === 'TIME_LIMIT' && l.unit === 5)

  const totalUsage = timeLimit?.usage ?? 0
  const currentValue = timeLimit?.currentValue ?? 0
  const timeLimitPercentage = totalUsage > 0 ? Math.round((currentValue / totalUsage) * 100) : null
  const nextReset = monthlyTokenLimit?.nextResetTime ?? 0

  const models: ModelUsage[] = (timeLimit?.usageDetails ?? []).map((m: any) => ({
    name: m.modelCode ?? m.model ?? '',
    requests: m.usage ?? m.requests ?? 0,
  }))

  return {
    id: agent.id,
    name: agent.name,
    enabled: agent.enabled,
    apiKeyConfigured: true,
    totalRequests: currentValue,
    availableCredits: 0,
    usableRequests: timeLimit?.remaining ?? 0,
    usableLimit: totalUsage,
    percentage: timeLimitPercentage ?? monthlyTokenLimit?.percentage ?? null,
    weeklyPercentage: weeklyTokenLimit?.percentage ?? null,
    monthlyUsed: mcpTimeLimit?.currentValue ?? 0,
    monthlyTotal: mcpTimeLimit?.usage ?? 0,
    monthlyRemaining: mcpTimeLimit?.remaining ?? 0,
    resetsIn: nextReset ? formatResetTime(nextReset) : '',
    models,
    error: null,
  }
}

const fetchers: Record<string, (agent: AgentConfig, apiKey: string) => Promise<QuotaResult>> = {
  crof: fetchCrofQuota,
  zai: fetchZaiQuota,
}

function emptyResult(agent: AgentConfig, apiKeyConfigured: boolean, error: string | null): QuotaResult {
  return {
    id: agent.id,
    name: agent.name,
    enabled: agent.enabled,
    apiKeyConfigured,
    totalRequests: 0,
    availableCredits: 0,
    usableRequests: 0,
    usableLimit: 1000,
    percentage: null,
    weeklyPercentage: null,
    monthlyUsed: 0,
    monthlyTotal: 0,
    monthlyRemaining: 0,
    resetsIn: '',
    models: [],
    error,
  }
}

export async function fetchAgentQuota(agent: AgentConfig): Promise<QuotaResult> {
  const apiKey = (agent.apiKey || process.env[agent.envKey] || '').trim().replace(/^["']|["']$/g, '')

  if (!apiKey) {
    return emptyResult(agent, false, null)
  }

  const fetcher = fetchers[agent.id]

  if (!fetcher) {
    return emptyResult(agent, true, `No fetcher for agent "${agent.id}"`)
  }

  try {
    return await fetcher(agent, apiKey)
  } catch (e: any) {
    console.error(`[quotatify] Error fetching ${agent.id}:`, e.message)
    return emptyResult(agent, true, e.message || 'Failed to fetch quota')
  }
}
