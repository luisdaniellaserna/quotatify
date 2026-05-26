import { defineEventHandler, readBody } from 'h3'
import { readAgentsConfig, writeAgentsConfig } from '../utils/storage'
import type { AgentConfig } from '../utils/fetchers'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ agents: { id: string; apiKey: string }[] }>(event)
  const config = await readAgentsConfig()

  for (const item of body.agents) {
    const agent = config.agents.find((a: AgentConfig) => a.id === item.id)
    if (agent) {
      // If the value is a masked key (contains bullet characters), keep the existing key
      if (item.apiKey && item.apiKey.includes('\u2022')) {
        continue
      }
      agent.apiKey = item.apiKey
    }
  }

  await writeAgentsConfig(config)
  return { success: true }
})
