import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { Locale } from '@/data/portfolio/types'

export const useLocale = () => {
  const route = useRoute()

  const locale = computed<Locale>(() => (route.path.startsWith('/en') ? 'en' : 'ko'))
  const basePath = computed(() => (locale.value === 'en' ? '/en' : '/ko'))
  const isStackPage = computed(() => route.path.endsWith('/stack'))
  const blogPrefix = computed(() => `${basePath.value}/blog`)
  const isBlogPage = computed(
    () => route.path === blogPrefix.value || route.path.startsWith(`${blogPrefix.value}/`),
  )
  const stackPath = computed(() => `${basePath.value}/stack`)
  const blogPath = computed(() => `${basePath.value}/blog`)
  const blogId = computed(() => {
    if (!isBlogPage.value) {
      return null
    }

    const prefixWithSlash = `${blogPrefix.value}/`

    if (!route.path.startsWith(prefixWithSlash)) {
      return null
    }

    return route.path.slice(prefixWithSlash.length) || null
  })
  const koPath = computed(() => {
    if (isStackPage.value) {
      return '/ko/stack'
    }

    if (blogId.value) {
      return `/ko/blog/${blogId.value}`
    }

    if (isBlogPage.value) {
      return '/ko/blog'
    }

    return '/ko'
  })
  const enPath = computed(() => {
    if (isStackPage.value) {
      return '/en/stack'
    }

    if (blogId.value) {
      return `/en/blog/${blogId.value}`
    }

    if (isBlogPage.value) {
      return '/en/blog'
    }

    return '/en'
  })

  return {
    route,
    locale,
    basePath,
    isStackPage,
    isBlogPage,
    stackPath,
    blogPath,
    blogId,
    koPath,
    enPath,
  }
}
