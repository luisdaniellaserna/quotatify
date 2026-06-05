<script setup lang="ts">
import type { AgentDashboard } from '~/stores/dashboard'

defineProps<{
  agent: AgentDashboard
}>()

function formatNumber(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

function formatCredits(n: number) {
  return n.toFixed(3)
}
</script>

<template>
  <div class="card bg-base-200 border border-base-300">
    <div class="card-body p-5">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <h3 class="text-lg font-semibold text-base-content">{{ agent.name }}</h3>
          <span v-if="agent.error" class="badge badge-error badge-sm">Error</span>
          <span v-else-if="!agent.apiKeyConfigured" class="badge badge-ghost badge-sm">No Key</span>
          <span v-else class="badge badge-success badge-sm">Connected</span>
        </div>
      </div>

      <div v-if="agent.error" role="alert" class="alert alert-error py-2 text-xs">
        <Icon name="lucide:triangle-alert" :width="14" />
        <span>{{ agent.error }}</span>
      </div>

      <template v-else-if="agent.apiKeyConfigured">
        <div v-if="agent.percentage !== null" class="grid grid-cols-2 gap-3">
          <DashboardMetricCard
            label="Usage"
            :value="`${agent.percentage}%`"
            :warn="agent.percentage >= 80"
          />
          <DashboardMetricCard
            label="Resets In"
            :value="agent.resetsIn || '--:--:--'"
          />
          <DashboardMetricCard
            label="Weekly Quota"
            :value="`${agent.weeklyPercentage}%`"
            :warn="agent.weeklyPercentage >= 80"
            :subtext="agent.weeklyResetsIn ? `Resets ${agent.weeklyResetsIn}` : ''"
          />
          <DashboardMetricCard
            label="Monthly MCP"
            :value="`${Math.round(agent.monthlyUsed / agent.monthlyTotal * 100)}%`"
            :warn="agent.monthlyRemaining <= 10"
            :subtext="agent.monthlyResetsIn ? `Resets ${agent.monthlyResetsIn}` : ''"
          />
        </div>
        <div v-else class="grid grid-cols-2 gap-3">
          <DashboardMetricCard
            label="Total Requests"
            :value="formatNumber(agent.totalRequests)"
          />
          <DashboardMetricCard
            label="Available Credits"
            :value="formatCredits(agent.availableCredits)"
          />
          <DashboardMetricCard
            label="Usable Requests"
            :value="`${agent.usableRequests}/${agent.usableLimit}`"
            :warn="agent.usableRequests < 200"
          />
          <DashboardMetricCard
            label="Resets In"
            :value="agent.resetsIn || '--:--:--'"
          />
        </div>
      </template>

      <div v-else class="py-6 text-center">
        <p class="text-xs text-base-content/50">
          Add your API key to
          <code class="rounded bg-base-300 px-1 py-0.5 text-xs font-mono">.env</code>
          to see usage.
        </p>
      </div>
    </div>
  </div>
</template>
