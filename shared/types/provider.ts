export type AuthType = 'bearer' | 'x-api-key'

/**
 * A single value a provider wants to display on its dashboard card.
 * Providers preformat `value` (e.g. "42%", "$1.20") so the UI stays provider-agnostic.
 */
export interface ProviderMetric {
  label: string
  value: string
  warn?: boolean
  disabled?: boolean
  subtext?: string
}

/**
 * Stable response envelope for a provider. Adding a provider never changes this shape.
 */
export interface ProviderSummary {
  id: string
  name: string
  enabled: boolean
  apiKeyConfigured: boolean
  error: string | null
  metrics: ProviderMetric[]
}
