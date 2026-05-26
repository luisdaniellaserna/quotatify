import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const dataPath = join(process.cwd(), 'server/data/agents.json')

export async function readAgentsConfig() {
  const raw = await readFile(dataPath, 'utf-8')
  return JSON.parse(raw)
}

export async function writeAgentsConfig(data: any) {
  await writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8')
}
