import { defineEventHandler } from 'h3'
import { readAgentsConfig } from '../utils/storage'
import { fetchAgentQuota } from '../providers'

export default defineEventHandler(async () => {
  const config = await readAgentsConfig()
  return Promise.all(config.agents.map(agent => fetchAgentQuota(agent)))
})
