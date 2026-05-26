<script setup lang="ts">
const { theme, setTheme } = useTheme()

const { keys, loading, fetch: fetchKeys, save: saveKeys } = useApiKeys()

const showApiKeysModal = ref(false)
const keyInputs = ref<Record<string, string>>({})

const themes = [
  'dark', 'light', 'cupcake', 'bumblebee', 'emerald', 'corporate',
  'synthwave', 'retro', 'cyberpunk', 'valentine', 'halloween', 'garden',
  'forest', 'aqua', 'lofi', 'pastel', 'fantasy', 'wireframe',
  'black', 'luxury', 'dracula', 'cmyk', 'autumn', 'business',
  'acid', 'lemonade', 'night', 'coffee', 'winter', 'dim', 'nord', 'sunset',
]

const showKey = ref<Record<string, boolean>>({})

function openApiKeysModal() {
  showApiKeysModal.value = true
  keyInputs.value = {}
  showKey.value = {}
  for (const key of keys.value) {
    keyInputs.value[key.id] = key.maskedKey
  }
}

function closeModal() {
  showApiKeysModal.value = false
}

async function handleSaveKeys() {
  const agentKeys = keys.value.map(k => ({
    id: k.id,
    apiKey: keyInputs.value[k.id] || '',
  }))
  const success = await saveKeys(agentKeys)
  if (success) {
    const toast = useToast()
    toast.success('API keys saved successfully')
    closeModal()
  } else {
    const toast = useToast()
    toast.error('Failed to save API keys')
  }
}

onMounted(() => {
  fetchKeys()
})
</script>

<template>
  <div class="flex items-center justify-between bg-base-100 px-4 py-3 shadow-sm">
    <h1 class="text-lg font-semibold text-base-content">Quotatify</h1>

    <div class="flex items-center gap-2">
      <button
        v-if="!showApiKeysModal"
        class="btn btn-ghost btn-sm gap-2"
        @click="openApiKeysModal"
      >
        <Icon name="lucide:key-round" size="16" />
        <span class="hidden sm:inline text-xs">API Key</span>
      </button>

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
  </div>

  <Teleport to="body">
    <div
      v-if="showApiKeysModal"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
    >
      <div class="relative w-full max-w-md mx-4 rounded-2xl bg-base-100 p-6 shadow-2xl" @click.stop>
        <button class="absolute right-4 top-4 btn btn-sm btn-ghost btn-circle" @click="closeModal">
          <Icon name="lucide:x" size="16" />
        </button>

        <h3 class="text-lg font-bold mb-2">API Keys</h3>

        <div class="divider mt-0 mb-4" />

        <div v-for="key in keys" :key="key.id" class="form-control w-full mb-4">
          <label class="label">
            <span class="label-text">{{ key.name }}</span>
          </label>
          <div class="flex gap-2">
            <input
              :id="'api-key-' + key.id"
              :type="showKey[key.id] ? 'text' : 'password'"
              :value="keyInputs[key.id]"
              :placeholder="key.configured ? 'Key configured' : 'Enter API key'"
              class="input input-bordered w-full"
              @input="(e: Event) => keyInputs[key.id] = (e.target as HTMLInputElement).value"
            />
            <button
              class="btn btn-square btn-sm"
              @click="showKey[key.id] = !showKey[key.id]"
            >
              <Icon :name="showKey[key.id] ? 'lucide:eye-off' : 'lucide:eye'" size="16" />
            </button>
          </div>
        </div>

        <div class="flex justify-end gap-2 mt-2">
          <button class="btn" @click="closeModal">Cancel</button>
          <button class="btn btn-primary" @click="handleSaveKeys">Save</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
