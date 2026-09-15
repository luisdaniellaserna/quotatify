import { defineEventHandler, readBody } from 'h3'
import { readPersistedAgentsConfig, writeAgentsConfig } from '../utils/storage'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ agents: { id: string; apiKey: string }[] }>(event)
  const config = await readPersistedAgentsConfig()

  for (const item of body.agents) {
    const agent = config.agents.find(a => a.id === item.id)
    if (!agent) continue
    // If the value is a masked key (contains bullet characters), keep the existing key
    if (item.apiKey && item.apiKey.includes('\u2022')) continue
    agent.apiKey = item.apiKey
  }

  await writeAgentsConfig(config)
  return { success: true }
})
