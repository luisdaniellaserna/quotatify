<script setup lang="ts">
const store = useDashboardStore()
const { $toast } = useNuxtApp()

let interval: ReturnType<typeof setInterval>

onMounted(async () => {
  await store.fetch()
  interval = setInterval(() => store.fetch(), 5_000)
})

onUnmounted(() => {
  clearInterval(interval)
})

async function handleRefresh() {
  await store.fetch()
  $toast.success('Dashboard refreshed')
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-base-content">AI Usage Dashboard</h1>
      </div>
      <button class="btn btn-ghost btn-sm" @click="handleRefresh" :disabled="store.loading">
        <Icon name="lucide:refresh-cw" :width="14" class="mr-1" />
        {{ store.loading ? 'Loading...' : 'Refresh' }}
      </button>
    </div>

    <div v-if="store.error" role="alert" class="alert alert-error">
      <Icon name="lucide:triangle-alert" :width="16" />
      <span>{{ store.error }}</span>
    </div>

    <div v-if="store.loading && store.agents.length === 0" class="flex items-center justify-center py-16">
      <span class="loading loading-spinner loading-lg text-primary" />
    </div>

    <div v-else class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <DashboardAgentDashboard
        v-for="agent in store.agents"
        :key="agent.id"
        :agent="agent"
      />
    </div>
  </div>
</template>
