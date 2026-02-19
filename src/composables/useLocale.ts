import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { Locale } from '../data/portfolio/types'

export const useLocale = () => {
  const route = useRoute()

  const locale = computed<Locale>(() => (route.path.startsWith('/en') ? 'en' : 'ko'))
  const basePath = computed(() => (locale.value === 'en' ? '/en' : '/ko'))
  const isStackPage = computed(() => route.path.endsWith('/stack'))
  const stackPath = computed(() => `${basePath.value}/stack`)
  const koPath = computed(() => (isStackPage.value ? '/ko/stack' : '/ko'))
  const enPath = computed(() => (isStackPage.value ? '/en/stack' : '/en'))

  return {
    route,
    locale,
    basePath,
    isStackPage,
    stackPath,
    koPath,
    enPath,
  }
}
