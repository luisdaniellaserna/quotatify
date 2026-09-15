import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { resolveAgent } from '../providers'
import type { AgentConfig, ResolvedAgent } from '../providers/types'

const dataPath = join(process.cwd(), 'server/data/agents.json')
const examplePath = join(process.cwd(), 'server/data/agents.example.json')

export interface AgentsConfig {
  agents: AgentConfig[]
}

async function readJson(path: string): Promise<AgentsConfig> {
  const config = JSON.parse(await readFile(path, 'utf-8')) as AgentsConfig
  return { agents: config.agents ?? [] }
}

/**
 * Configuration as authored in `agents.json` — no provider defaults, no env keys.
 * Use this for writes so provider-derived values and env secrets never get persisted.
 * Falls back to `agents.example.json` on a fresh clone.
 */
export async function readPersistedAgentsConfig(): Promise<AgentsConfig> {
  try {
    return await readJson(dataPath)
  } catch (e: any) {
    if (e?.code === 'ENOENT') return await readJson(examplePath)
    throw e
  }
}

/** Runtime configuration: provider defaults applied and env keys merged in. */
export async function readAgentsConfig(): Promise<{ agents: ResolvedAgent[] }> {
  const config = await readPersistedAgentsConfig()

  return {
    agents: config.agents.map(agent => {
      const resolved = resolveAgent(agent)
      if (!resolved.apiKey && resolved.envKey) {
        const envValue = process.env[resolved.envKey]
        if (envValue && envValue.trim() !== '') {
          resolved.apiKey = envValue.trim()
        }
      }
      return resolved
    }),
  }
}

export async function writeAgentsConfig(data: AgentsConfig): Promise<void> {
  await writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8')
}
