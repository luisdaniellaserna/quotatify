<script setup lang="ts">
defineProps<{
  label: string
  value: string
  warn?: boolean
  disabled?: boolean
  subtext?: string
}>()
</script>

<template>
  <div
    class="stat rounded-xl p-4 border"
    :class="[
      disabled
        ? 'border-base-300/40 bg-base-200/50 opacity-40'
        : warn
          ? 'border-error/30 bg-error/5 transition-all duration-300 ring-2 ring-error/30'
          : 'border-base-300',
    ]"
  >
    <div class="stat-title text-xs" :class="disabled ? 'text-base-content/40' : warn ? 'text-error' : 'text-base-content/60'">
      {{ label }}
    </div>
    <div class="stat-value text-lg" :class="disabled ? 'text-base-content/30' : warn ? 'text-error' : 'text-base-content'">
      {{ value }}
    </div>
    <div v-if="subtext && !disabled" class="stat-desc text-xs mt-1 opacity-60">
      {{ subtext }}
    </div>
  </div>
</template>
