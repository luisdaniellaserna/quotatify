export function useTheme() {
  const theme = ref('dark')

  onMounted(() => {
    const saved = useCookie('theme').value
    if (saved) theme.value = saved
    applyTheme(theme.value)
  })

  function setTheme(t: string) {
    theme.value = t
    const cookie = useCookie('theme', { maxAge: 365 * 24 * 60 * 60 })
    cookie.value = t
    applyTheme(t)
  }

  function applyTheme(t: string) {
    document.documentElement.setAttribute('data-theme', t)
  }

  return { theme, setTheme }
}
