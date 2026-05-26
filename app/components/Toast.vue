<script setup lang="ts">
import { useToast } from '~/composables/useToast'

const { toasts } = useToast()

function positionClasses(pos: string) {
  const map: Record<string, string> = {
    'top-start': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'top-end': 'top-4 right-4',
    'center-start': 'top-1/2 left-4 -translate-y-1/2',
    'center-middle': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'center-end': 'top-1/2 right-4 -translate-y-1/2',
    'bottom-start': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
    'bottom-end': 'bottom-4 right-4',
  }
  return map[pos] || map['top-end']
}
</script>

<template>
  <div class="pointer-events-none fixed inset-0 z-[999]">
    <div v-for="t in toasts" :key="t.id" :class="[positionClasses(t.position), 'pointer-events-auto absolute']">
      <div :class="['alert shadow-lg', `alert-${t.type}`]">
        <span>{{ t.message }}</span>
      </div>
    </div>
  </div>
</template>
