/**
 * Provider template.
 *
 * To add a provider:
 *   1. Copy this file to `server/providers/<id>.ts`.
 *   2. Implement `fetch` and return one metric per card value.
 *   3. Register it in `server/providers/index.ts`.
 *   4. Add its env var to `.env.example`.
 *
 * This file is not registered and is never executed — it exists as documentation.
 */
import type { ProviderMetric } from '#shared/types/provider'
import { buildAuthHeaders } from './auth'
import { defineProvider } from './types'

export default defineProvider({
  id: 'example',
  defaults: {
    // Shown on the card and in the API key settings modal.
    name: 'Example',
    // Quota/usage endpoint.
    quotaUrl: 'https://api.example.com/usage',
    // Env var holding the API key (overridable per agent in agents.json).
    envKey: 'NUXT_EXAMPLE_API_KEY',
    // 'bearer' -> Authorization: Bearer <key>, 'x-api-key' -> x-api-key: <key>
    authType: 'bearer',
  },
  async fetch({ config, apiKey }): Promise<ProviderMetric[]> {
    const res: any = await $fetch(config.quotaUrl, {
      headers: buildAuthHeaders(config.authType, apiKey),
    })

    // `value` is preformatted. Set `warn` to highlight a card in red and
    // `disabled` to dim it when the underlying value is unavailable.
    return [
      {
        label: 'Usage',
        value: `${res?.percentage ?? 0}%`,
        warn: (res?.percentage ?? 0) >= 80,
      },
      {
        label: 'Resets In',
        value: res?.resetsIn ?? '--',
        subtext: res?.resetDate ? `Resets ${res.resetDate}` : '',
      },
    ]
  },
})
