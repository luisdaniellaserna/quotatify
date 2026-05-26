import { defineEventHandler } from 'h3'
import { readAgentsConfig } from '../utils/storage'
import { fetchAgentQuota } from '../utils/fetchers'

export default defineEventHandler(async () => {
  const config = await readAgentsConfig()
  const results = await Promise.all(
    config.agents.map((agent: any) => fetchAgentQuota(agent)),
  )
  return results
})
