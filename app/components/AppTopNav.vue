<script setup lang="ts">
const { theme, setTheme } = useTheme()

const themes = [
  'dark', 'light', 'cupcake', 'bumblebee', 'emerald', 'corporate',
  'synthwave', 'retro', 'cyberpunk', 'valentine', 'halloween', 'garden',
  'forest', 'aqua', 'lofi', 'pastel', 'fantasy', 'wireframe',
  'black', 'luxury', 'dracula', 'cmyk', 'autumn', 'business',
  'acid', 'lemonade', 'night', 'coffee', 'winter', 'dim', 'nord', 'sunset',
]
</script>

<template>
  <div class="flex items-center justify-between bg-base-100 px-4 py-3 shadow-sm">
    <h1 class="text-lg font-semibold text-base-content">Quotatify</h1>

    <div class="dropdown dropdown-end">
      <label tabindex="0" class="btn btn-ghost btn-sm gap-2">
        <Icon name="lucide:palette" size="16" />
        <span class="hidden sm:inline text-xs">{{ theme }}</span>
      </label>
      <ClientOnly>
        <div tabindex="0" class="dropdown-content z-50 mt-2 grid grid-cols-8 gap-1 rounded-box bg-base-200 p-3 shadow-lg w-72">
          <button
            v-for="t in themes"
            :key="t"
            @click="setTheme(t)"
            :data-theme="t"
            class="flex items-center justify-center rounded-btn p-1.5 hover:bg-base-300 transition-colors"
          >
            <div class="grid grid-cols-2 gap-px">
              <div class="h-2 w-3 rounded-sm bg-base-content" />
              <div class="h-2 w-3 rounded-sm bg-primary" />
              <div class="h-2 w-3 rounded-sm bg-secondary" />
              <div class="h-2 w-3 rounded-sm bg-accent" />
            </div>
            <Icon v-if="t === theme" name="lucide:check" size="12" class="ml-1 text-primary" />
          </button>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>
