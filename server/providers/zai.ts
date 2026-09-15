import { buildAuthHeaders } from './auth'
import { formatFullDate, formatResetTime } from './format'
import { defineProvider } from './types'

/**
 * Z.ai — quota limits are keyed by `unit`: 3 = monthly tokens, 6 = weekly tokens,
 * 5 = monthly MCP time. See README for the full mapping table.
 */
export default defineProvider({
  id: 'zai',
  defaults: {
    name: 'Z.ai',
    quotaUrl: 'https://api.z.ai/api/monitor/usage/quota/limit',
    envKey: 'NUXT_ZAI_API_KEY',
    authType: 'bearer',
  },
  async fetch({ config, apiKey }) {
    const res: any = await $fetch(config.quotaUrl, {
      headers: buildAuthHeaders(config.authType, apiKey),
    })

    const data = res?.data ?? res
    const limits = data?.limits ?? []
    const monthlyTokenLimit = limits.find((l: any) => l.type === 'TOKENS_LIMIT' && l.unit === 3)
    const weeklyTokenLimit = limits.find((l: any) => l.type === 'TOKENS_LIMIT' && l.unit === 6)
    const mcpTimeLimit = limits.find((l: any) => l.type === 'TIME_LIMIT' && l.unit === 5)

    const percentage = monthlyTokenLimit?.percentage ?? null
    const weeklyPercentage = weeklyTokenLimit?.percentage ?? null
    const monthlyUsed = mcpTimeLimit?.currentValue ?? 0
    const monthlyTotal = mcpTimeLimit?.usage ?? 0
    const monthlyRemaining = mcpTimeLimit?.remaining ?? 0

    return [
      {
        label: 'Usage',
        value: percentage != null ? `${percentage}%` : '--',
        warn: percentage != null && percentage >= 80,
      },
      {
        label: 'Resets In',
        value: monthlyTokenLimit?.nextResetTime ? formatResetTime(monthlyTokenLimit.nextResetTime) : '--:--:--',
      },
      {
        label: 'Weekly Quota',
        value: weeklyPercentage != null ? `${weeklyPercentage}%` : '--',
        warn: weeklyPercentage != null && weeklyPercentage >= 80,
        disabled: weeklyPercentage == null,
        subtext: weeklyTokenLimit?.nextResetTime ? `Resets ${formatFullDate(weeklyTokenLimit.nextResetTime)}` : '',
      },
      {
        label: 'Monthly MCP',
        value: monthlyTotal > 0 ? `${Math.round((monthlyUsed / monthlyTotal) * 100)}%` : '--',
        warn: monthlyTotal > 0 && monthlyRemaining <= 10,
        disabled: monthlyTotal === 0,
        subtext: mcpTimeLimit?.nextResetTime ? `Resets ${formatFullDate(mcpTimeLimit.nextResetTime)}` : '',
      },
    ]
  },
})
