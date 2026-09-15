import { buildAuthHeaders } from './auth'
import { formatCredits } from './format'
import { defineProvider } from './types'

export default defineProvider({
  id: 'deepseek',
  defaults: {
    name: 'DeepSeek',
    quotaUrl: 'https://api.deepseek.com/user/balance',
    envKey: 'NUXT_DEEPSEEK_API_KEY',
    authType: 'bearer',
  },
  async fetch({ config, apiKey }) {
    const res: any = await $fetch(config.quotaUrl, {
      headers: buildAuthHeaders(config.authType, apiKey),
    })

    const balanceInfo = res?.balance_infos?.[0] ?? null
    const totalBalance = balanceInfo ? Number(balanceInfo.total_balance) : 0
    const grantedBalance = balanceInfo ? Number(balanceInfo.granted_balance) : 0
    const toppedUpBalance = balanceInfo ? Number(balanceInfo.topped_up_balance) : 0
    const isAvailable = res?.is_available ?? null

    return [
      { label: 'Total Balance', value: `$${formatCredits(totalBalance)}`, warn: totalBalance <= 1.99 },
      { label: 'Granted Balance', value: `$${formatCredits(grantedBalance)}` },
      { label: 'Topped Up Balance', value: `$${formatCredits(toppedUpBalance)}` },
      { label: 'Status', value: isAvailable ? 'Available' : 'Unavailable', warn: isAvailable === false },
    ]
  },
})
