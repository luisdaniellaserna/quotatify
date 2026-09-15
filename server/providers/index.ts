import type { ProviderSummary } from '#shared/types/provider'
import type { AgentConfig, Provider, ResolvedAgent } from './types'

import crof from './crof'
import deepseek from './deepseek'
import zai from './zai'

export * from './types'

/**
 * Provider registry. To add a provider: create `server/providers/<id>.ts` and
 * register it here. Nothing else in the codebase needs to change.
 */
export const providers: Record<string, Provider> = {
  crof,
  deepseek,
  zai,
}

export function getProvider(id: string): Provider | undefined {
  return providers[id]
}

/** Apply provider defaults to a raw `agents.json` entry. */
export function resolveAgent(agent: AgentConfig): ResolvedAgent {
  const defaults = getProvider(agent.id)?.defaults
  return {
    ...agent,
    name: agent.name || defaults?.name || agent.id,
    envKey: agent.envKey || defaults?.envKey || '',
    quotaUrl: agent.quotaUrl || defaults?.quotaUrl || '',
    authType: agent.authType || defaults?.authType || 'bearer',
    enabled: agent.enabled ?? true,
    apiKey: agent.apiKey || '',
  }
}

export async function fetchAgentQuota(agent: AgentConfig): Promise<ProviderSummary> {
  const config = resolveAgent(agent)
  const apiKey = (config.apiKey || process.env[config.envKey] || '').trim().replace(/^["']|["']$/g, '')

  const summary: ProviderSummary = {
    id: config.id,
    name: config.name,
    enabled: config.enabled,
    apiKeyConfigured: apiKey !== '',
    error: null,
    metrics: [],
  }

  if (!apiKey) return summary

  const provider = getProvider(config.id)
  if (!provider) {
    return { ...summary, error: `No provider registered for "${config.id}"` }
  }

  try {
    return { ...summary, metrics: await provider.fetch({ config, apiKey }) }
  } catch (e: any) {
    console.error(`[quotatify] Error fetching ${config.id}:`, e.message)
    return { ...summary, error: e.message || 'Failed to fetch quota' }
  }
}
