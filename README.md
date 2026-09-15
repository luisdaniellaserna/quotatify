# Quotatify

Real-time AI API usage dashboard for monitoring quota consumption across multiple AI providers. Fetches usage data from provider APIs and displays usage percentages, token limits, MCP limits, and model-level breakdowns in a clean UI with auto-refresh.

## Features

- **Multi-provider support** — Monitor usage for Z.ai, Crof.ai, and DeepSeek with a plug-in provider architecture ([add your own](#adding-a-provider))
- **Real-time updates** — Auto-refreshes every 5 seconds
- **Usage breakdowns** — View usage %, weekly quota, and Monthly MCP limits
- **Model-level detail** — Per-model request counts from time-limit usage details
- **API key management** — Configure API keys via `.env` or through the settings UI
- **Responsive grid** — DaisyUI cards with warning states at 80%+ usage

## Setup

```bash
npm install
```

### Configuration

Create a `.env` file in the root:

```env
NUXT_CROF_API_KEY=your_crof_key
NUXT_ZAI_API_KEY=your_zai_key
NUXT_DEEPSEEK_API_KEY=your_deepseek_key
```

Or configure keys through the Settings panel in the UI.

### Agent config

Providers are enabled in `server/data/agents.json` by id. Names, quota URLs and
env keys come from each provider's module, so an entry only needs `id`,
`enabled` and (optionally) `apiKey`:

```json
{
  "agents": [
    { "id": "crof", "enabled": true, "apiKey": "" },
    { "id": "zai", "enabled": true, "apiKey": "" },
    { "id": "deepseek", "enabled": true, "apiKey": "" }
  ]
}
```

If `agents.json` is missing, `agents.example.json` is used. API keys in `.env`
take priority over keys in `agents.json`.

## Development

```bash
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
npm run preview
```

## Architecture

```
shared/types/provider.ts  # ProviderMetric + ProviderSummary (shared by app and server)

app/                      # Nuxt SPA frontend (Vue 3 + Pinia)
  pages/index.vue         # Main dashboard page with auto-refresh
  components/dashboard/   # AgentDashboard card + MetricCard
  stores/dashboard.ts     # Pinia store for fetching agent data

server/                   # Nitro server-side
  api/dashboard.get.ts    # GET /api/dashboard — quota summaries for all agents
  api/agents.get.ts       # GET /api/agents — same summaries (raw endpoint)
  api/keys.get.ts         # GET /api/keys — masked API key status
  api/keys.put.ts         # PUT /api/keys — update API keys
  providers/index.ts      # Provider registry + fetchAgentQuota resolver
  providers/types.ts      # Provider contract (defineProvider)
  providers/auth.ts       # Auth header builder
  providers/format.ts     # Shared number/date formatters
  providers/zai.ts        # One file per provider
  providers/crof.ts
  providers/deepseek.ts
  providers/_template.ts  # Scaffold for new providers (not registered)
  utils/storage.ts        # agents.json read/write + provider default/env merge
  data/agents.json        # Enabled agents
```

### Adding a provider

A provider is one self-contained file. You do **not** touch the frontend, the API
layer, or any shared types.

**1. Create the provider** from the template:

```bash
cp server/providers/_template.ts server/providers/acme.ts
```

**2. Implement it.** Set the `id`/`defaults` and return one metric per card value.
`value` is preformatted; use `warn` to highlight the card and `disabled` to dim it.

```ts
import { buildAuthHeaders } from './auth'
import { defineProvider } from './types'

export default defineProvider({
  id: 'acme',
  defaults: {
    name: 'Acme',                              // shown on the card and in settings
    quotaUrl: 'https://api.acme.com/usage',    // quota/usage endpoint
    envKey: 'NUXT_ACME_API_KEY',               // env var holding the key
    authType: 'bearer',                        // 'bearer' | 'x-api-key'
  },
  async fetch({ config, apiKey }) {
    const res: any = await $fetch(config.quotaUrl, {
      headers: buildAuthHeaders(config.authType, apiKey),
    })
    return [
      { label: 'Usage', value: `${res.used_percent}%`, warn: res.used_percent >= 80 },
      { label: 'Resets In', value: res.resets_in ?? '--' },
    ]
  },
})
```

**3. Register it** in `server/providers/index.ts`:

```ts
export const providers: Record<string, Provider> = {
  acme, // <-- add this
  crof,
  deepseek,
  zai,
}
```

**4. Document the env var** in `.env.example`, using the same name as
`defaults.envKey`, and add a response-mapping table to this README (see the
existing providers below):

```env
# .env.example
NUXT_CROF_API_KEY=
NUXT_ZAI_API_KEY=
NUXT_DEEPSEEK_API_KEY=
# matches `defaults.envKey` in server/providers/acme.ts
NUXT_ACME_API_KEY=
```

Then copy `.env.example` to `.env` and paste the key:

```env
# .env
NUXT_ACME_API_KEY=your_actual_key
```

**5. Enable it** in `server/data/agents.example.json` and your local
`agents.json` by adding `{ "id": "acme", "enabled": true, "apiKey": "" }`.

#### Provider reference

| File | Purpose |
|---|---|
| `server/providers/types.ts` | `Provider`, `ProviderContext`, `defineProvider` |
| `shared/types/provider.ts` | `ProviderMetric`, `ProviderSummary` |
| `server/providers/auth.ts` | `buildAuthHeaders` for `bearer` / `x-api-key` |
| `server/providers/format.ts` | Shared number/date formatters |
| `server/providers/_template.ts` | Copy-paste starting point (not registered) |

#### How it works

`agents.json` entries only carry `id`, `enabled` and `apiKey`; the name, quota URL,
env key and auth type come from the provider's `defaults` (any value set in
`agents.json` overrides the default). The API returns a stable envelope —
`{ id, name, enabled, apiKeyConfigured, error, metrics }` — and the dashboard
renders whatever metrics the provider returns. That is why adding a provider
requires no UI changes.

### Z.ai API response mapping

| API Limit | Dashboard card |
|---|---|
| `TOKENS_LIMIT unit:3` | Usage % & reset time |
| `TOKENS_LIMIT unit:6` | Weekly quota % & reset date |
| `TIME_LIMIT unit:5` | Monthly MCP % & reset date |

### Crof.ai API response mapping

| API Field | Dashboard card |
|---|---|
| `usage[*].total_tokens` (sum) | Total Tokens |
| `usage[*].input_tokens` (sum) | Input Tokens |
| `usage[*].output_tokens` (sum) | Output Tokens |
| `credits` | Available Credits (warns at ≤ $1.99) |

### DeepSeek API response mapping

| API Field | Dashboard card |
|---|---|
| `balance_infos[0].total_balance` | Total Balance (warns at ≤ $1.99) |
| `balance_infos[0].granted_balance` | Granted Balance |
| `balance_infos[0].topped_up_balance` | Topped Up Balance |
| `is_available` | Status (Available / Unavailable) |

## Tech Stack

- **Nuxt 4** (SPA mode, no SSR)
- **Vue 3** with Composition API
- **Pinia** state management
- **Tailwind CSS v4** + **DaisyUI 5**
- **Nitro** server engine with `h3` event handlers
