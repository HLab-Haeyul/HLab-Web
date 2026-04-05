import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

export const useAppLayout = () => {
  const viewportWidth = ref(1280)
  const viewportHeight = ref(800)
  const isStandaloneMode = ref(false)

  let displayModeQuery: MediaQueryList | null = null
  let handleDisplayModeChange: ((event: MediaQueryListEvent) => void) | null = null

  const syncViewport = () => {
    if (typeof window === 'undefined') {
      return
    }

    viewportWidth.value = window.innerWidth
    viewportHeight.value = window.innerHeight
  }

  onMounted(() => {
    if (typeof window === 'undefined') {
      return
    }

    syncViewport()

    displayModeQuery = window.matchMedia('(display-mode: standalone)')
    const iosStandalone = Boolean(
      (window.navigator as Navigator & { standalone?: boolean }).standalone,
    )

    isStandaloneMode.value = displayModeQuery.matches || iosStandalone

    handleDisplayModeChange = (event) => {
      isStandaloneMode.value = event.matches
    }

    displayModeQuery.addEventListener?.('change', handleDisplayModeChange)
    window.addEventListener('resize', syncViewport)
  })

  onBeforeUnmount(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', syncViewport)
    }

    if (displayModeQuery && handleDisplayModeChange) {
      displayModeQuery.removeEventListener?.('change', handleDisplayModeChange)
    }
  })

  const isAppLayout = computed(
    () => isStandaloneMode.value || (viewportWidth.value <= 560 && viewportHeight.value >= 620),
  )

  return {
    isAppLayout,
  }
}
