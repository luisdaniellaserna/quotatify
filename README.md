# Quotatify

Real-time AI API usage dashboard for monitoring quota consumption across multiple AI providers. Fetches usage data from provider APIs and displays usage percentages, token limits, MCP limits, and model-level breakdowns in a clean UI with auto-refresh.

## Features

- **Multi-provider support** — Monitor usage for Z.ai and Crof.ai with extensible fetcher architecture
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
```

Or configure keys through the Settings panel in the UI.

### Agent config

Agents are defined in `server/data/agents.json`:

```json
{
  "agents": [
    {
      "id": "zai",
      "name": "Z.ai",
      "apiKey": "",
      "envKey": "NUXT_ZAI_API_KEY",
      "enabled": true,
      "quotaUrl": "https://api.z.ai/api/monitor/usage/quota/limit",
      "authType": "bearer"
    }
  ]
}
```

API keys in `.env` take priority over keys in `agents.json`.

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
app/                    # Nuxt SPA frontend (Vue 3 + Pinia)
  pages/index.vue       # Main dashboard page with auto-refresh
  components/dashboard/ # AgentDashboard cards + MetricCard
  stores/dashboard.ts   # Pinia store for fetching agent data

server/                 # Nitro server-side
  api/dashboard.get.ts  # GET /api/dashboard — returns quota for all agents
  api/agents.get.ts     # GET /api/agents — raw quota results per agent
  api/keys.get.ts       # GET /api/keys — masked API key status
  api/keys.put.ts       # PUT /api/keys — update API keys
  utils/fetchers.ts     # Provider-specific quota fetchers (Z.ai, Crof.ai)
  utils/storage.ts      # agents.json read/write with env auto-migration
  data/agents.json      # Agent definitions
```

### Z.ai API response mapping

| API Limit | Dashboard card |
|---|---|
| `TOKENS_LIMIT unit:3` | Usage % & reset time |
| `TOKENS_LIMIT unit:6` | Weekly quota % |
| `TIME_LIMIT unit:5` | Monthly MCP %, model breakdown, total requests |

## Tech Stack

- **Nuxt 4** (SPA mode, no SSR)
- **Vue 3** with Composition API
- **Pinia** state management
- **Tailwind CSS v4** + **DaisyUI 5**
- **Nitro** server engine with `h3` event handlers
