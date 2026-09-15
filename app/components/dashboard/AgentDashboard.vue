<script setup lang="ts">
import type { AgentDashboard } from '~/stores/dashboard'

defineProps<{
  agent: AgentDashboard
}>()
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

      <div v-else-if="agent.apiKeyConfigured && agent.metrics.length" class="grid grid-cols-2 gap-3">
        <DashboardMetricCard
          v-for="metric in agent.metrics"
          :key="metric.label"
          :label="metric.label"
          :value="metric.value"
          :warn="metric.warn"
          :disabled="metric.disabled"
          :subtext="metric.subtext"
        />
      </div>

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
