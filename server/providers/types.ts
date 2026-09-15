import type { AuthType, ProviderMetric } from '#shared/types/provider'

/**
 * A provider entry as declared in `server/data/agents.json`.
 * Only `id` is required; every other field falls back to the provider defaults.
 */
export interface AgentConfig {
  id: string
  name?: string
  envKey?: string
  apiKey?: string
  enabled?: boolean
  quotaUrl?: string
  authType?: AuthType
}

/**
 * Agent config with every field guaranteed, after provider defaults are applied.
 */
export interface ResolvedAgent extends AgentConfig {
  name: string
  envKey: string
  quotaUrl: string
  authType: AuthType
  enabled: boolean
  apiKey: string
}

export interface ProviderDefaults {
  name: string
  quotaUrl: string
  envKey: string
  authType: AuthType
}

export interface ProviderContext {
  config: ResolvedAgent
  apiKey: string
}

export interface Provider {
  /** Unique id referenced by `agents.json`. */
  id: string
  defaults: ProviderDefaults
  /** Map the provider API response to dashboard metrics. */
  fetch: (ctx: ProviderContext) => Promise<ProviderMetric[]>
}

export function defineProvider(provider: Provider): Provider {
  return provider
}
