import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const dataPath = join(process.cwd(), 'server/data/agents.json')

export async function readAgentsConfig() {
  const raw = await readFile(dataPath, 'utf-8')
  const config = JSON.parse(raw)

  // Auto-migrate: copy env vars into apiKey if empty
  let changed = false
  for (const agent of config.agents) {
    if (!agent.apiKey || agent.apiKey === '') {
      const envValue = process.env[agent.envKey]
      if (envValue && envValue.trim() !== '') {
        agent.apiKey = envValue.trim()
        changed = true
      }
    }
  }

  if (changed) {
    await writeAgentsConfig(config)
  }

  return config
}

export async function writeAgentsConfig(data: any) {
  await writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8')
}
