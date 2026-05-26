import { defineEventHandler } from 'h3'
import { readAgentsConfig } from '../utils/storage'
import type { AgentConfig } from '../utils/fetchers'

function maskKey(key: string): string {
  if (!key || key.length === 0) return ''
  if (key.length <= 4) return '••••'
  return '••••' + key.slice(-4)
}

export default defineEventHandler(async () => {
  const config = await readAgentsConfig()
  const result = config.agents.map((agent: AgentConfig) => ({
    id: agent.id,
    name: agent.name,
    maskedKey: maskKey(agent.apiKey || ''),
    configured: (agent.apiKey && agent.apiKey.trim() !== '') || false,
  }))
  return result
})
