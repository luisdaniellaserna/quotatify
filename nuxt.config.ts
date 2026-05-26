import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  app: { head: { title: 'Quotatify' } },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  modules: ['@nuxt/icon', '@nuxt/fonts', '@pinia/nuxt'],
  components: [{ path: '~/components' }],
  runtimeConfig: {
    public: { apiBase: '', wsBase: '' },
  },
  compatibilityDate: '2025-07-15',
})
