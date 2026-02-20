import { computed, onBeforeUnmount, ref, watch, type Ref } from 'vue'
import { blogPageCopyByLocale, type BlogPageCopySet } from '@/data/blog/content'
import type { Locale } from '@/data/portfolio/types'
import { isBlogApiEnabled } from '@/services/blogApiConfig'
import { fetchBlogPageCopy, type BlogMainPagePatchInput, updateBlogMainPageCopy } from '@/services/blogApi'

type BlogDataSource = 'api' | 'fallback'

export const useBlogContent = (locale: Readonly<Ref<Locale>>) => {
  const copy = ref<BlogPageCopySet>(blogPageCopyByLocale[locale.value])
  const dataSource = ref<BlogDataSource>('fallback')
  const isLoading = ref(false)
  const isUpdating = ref(false)
  const errorMessage = ref<string | null>(null)

  let currentController: AbortController | null = null

  const abortCurrentRequest = () => {
    if (currentController) {
      currentController.abort()
      currentController = null
    }
  }

  const getFetchFailedMessage = (currentLocale: Locale) =>
    currentLocale === 'en'
      ? 'Failed to load posts from API. Showing local fallback data.'
      : 'API에서 글을 불러오지 못해 로컬 fallback 데이터를 표시합니다.'

  const load = async () => {
    abortCurrentRequest()

    if (!isBlogApiEnabled()) {
      copy.value = blogPageCopyByLocale[locale.value]
      dataSource.value = 'fallback'
      errorMessage.value = null
      isLoading.value = false
      return
    }

    const controller = new AbortController()
    currentController = controller
    isLoading.value = true
    errorMessage.value = null

    try {
      const apiCopy = await fetchBlogPageCopy(locale.value, { signal: controller.signal })

      if (controller.signal.aborted) {
        return
      }

      if (apiCopy) {
        copy.value = apiCopy
        dataSource.value = 'api'
        return
      }

      copy.value = blogPageCopyByLocale[locale.value]
      dataSource.value = 'fallback'
      errorMessage.value = getFetchFailedMessage(locale.value)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }

      copy.value = blogPageCopyByLocale[locale.value]
      dataSource.value = 'fallback'
      errorMessage.value = getFetchFailedMessage(locale.value)
    } finally {
      if (!controller.signal.aborted && currentController === controller) {
        isLoading.value = false
        currentController = null
      }
    }
  }

  const reload = () => {
    void load()
  }

  const getUpdateFailedMessage = (currentLocale: Locale) =>
    currentLocale === 'en'
      ? 'Failed to update main page content.'
      : '메인 페이지 내용 수정에 실패했습니다.'

  const updateMainPageCopy = async (input: BlogMainPagePatchInput) => {
    if (!isBlogApiEnabled()) {
      return false
    }

    isUpdating.value = true
    errorMessage.value = null

    try {
      const updated = await updateBlogMainPageCopy(locale.value, input)

      if (!updated) {
        errorMessage.value = getUpdateFailedMessage(locale.value)
        return false
      }

      copy.value = updated
      dataSource.value = 'api'
      return true
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return false
      }

      errorMessage.value = getUpdateFailedMessage(locale.value)
      return false
    } finally {
      isUpdating.value = false
    }
  }

  watch(
    () => locale.value,
    () => {
      void load()
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    abortCurrentRequest()
  })

  return {
    copy: computed(() => copy.value),
    dataSource: computed(() => dataSource.value),
    isLoading: computed(() => isLoading.value),
    isUpdating: computed(() => isUpdating.value),
    errorMessage: computed(() => errorMessage.value),
    reload,
    updateMainPageCopy,
  }
}
