import { buildAuthHeaders } from './auth'
import { formatCompactNumber, formatCredits } from './format'
import { defineProvider } from './types'

export default defineProvider({
  id: 'crof',
  defaults: {
    name: 'Crof.ai',
    quotaUrl: 'https://crof.ai/usage_api/',
    envKey: 'NUXT_CROF_API_KEY',
    authType: 'bearer',
  },
  async fetch({ config, apiKey }) {
    const res: any = await $fetch(config.quotaUrl, {
      headers: buildAuthHeaders(config.authType, apiKey),
    })

    const usage: Record<string, { input_tokens?: number; output_tokens?: number; total_tokens?: number }> = res?.usage ?? {}
    let totalTokens = 0
    let inputTokens = 0
    let outputTokens = 0

    for (const model of Object.values(usage)) {
      totalTokens += model?.total_tokens ?? 0
      inputTokens += model?.input_tokens ?? 0
      outputTokens += model?.output_tokens ?? 0
    }

    const credits = res?.credits ?? 0

    return [
      { label: 'Total Tokens', value: formatCompactNumber(totalTokens) },
      { label: 'Available Credits', value: formatCredits(credits), warn: credits <= 1.99 },
      { label: 'Input Tokens', value: formatCompactNumber(inputTokens) },
      { label: 'Output Tokens', value: formatCompactNumber(outputTokens) },
    ]
  },
})
