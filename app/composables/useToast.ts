export interface ToastItem {
  id: number
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  position: string
}

const toasts = ref<ToastItem[]>([])
let nextId = 0

export function useToast() {
  function add(message: string, type: ToastItem['type'], position = 'top-end') {
    const id = nextId++
    toasts.value.push({ id, message, type, position })
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id)
    }, 4000)
  }

  function success(message: string, position?: string) { add(message, 'success', position) }
  function error(message: string, position?: string) { add(message, 'error', position) }
  function warning(message: string, position?: string) { add(message, 'warning', position) }
  function info(message: string, position?: string) { add(message, 'info', position) }

  return { toasts, success, error, warning, info }
}
