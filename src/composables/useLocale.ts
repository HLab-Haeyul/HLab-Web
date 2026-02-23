import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { Locale } from '@/data/portfolio/types'

export const useLocale = () => {
  const route = useRoute()

  const locale = computed<Locale>(() => (route.path.startsWith('/en') ? 'en' : 'ko'))
  const basePath = computed(() => (locale.value === 'en' ? '/en' : '/ko'))
  const isStackPage = computed(() => route.path.endsWith('/stack'))
  const adminPrefix = computed(() => `${basePath.value}/admin`)
  const isAdminPage = computed(
    () => route.path === adminPrefix.value || route.path.startsWith(`${adminPrefix.value}/`),
  )
  const blogPrefix = computed(() => `${basePath.value}/blog`)
  const isBlogPage = computed(
    () => route.path === blogPrefix.value || route.path.startsWith(`${blogPrefix.value}/`),
  )
  const stackPath = computed(() => `${basePath.value}/stack`)
  const blogPath = computed(() => `${basePath.value}/blog`)
  const adminPath = computed(() => adminPrefix.value)
  const adminBlogPath = computed(() => `${adminPrefix.value}/blog`)
  const adminSubPath = computed(() => {
    if (!isAdminPage.value) {
      return null
    }

    if (route.path === adminPrefix.value) {
      return ''
    }

    const prefixWithSlash = `${adminPrefix.value}/`

    if (!route.path.startsWith(prefixWithSlash)) {
      return ''
    }

    return route.path.slice(prefixWithSlash.length)
  })
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
    if (isAdminPage.value) {
      if (adminSubPath.value) {
        return `/ko/admin/${adminSubPath.value}`
      }

      return '/ko/admin'
    }

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
    if (isAdminPage.value) {
      if (adminSubPath.value) {
        return `/en/admin/${adminSubPath.value}`
      }

      return '/en/admin'
    }

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
    isAdminPage,
    isBlogPage,
    stackPath,
    blogPath,
    adminPath,
    adminBlogPath,
    blogId,
    koPath,
    enPath,
  }
}
