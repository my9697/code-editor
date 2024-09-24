import { onMounted, onUnmounted } from 'vue'

export function useKeypress(key: string, cb: () => any) {
  const trigger = (event: KeyboardEvent) => {
    if (event.key === key) {
      cb()
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', trigger)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', trigger)
  })
}
