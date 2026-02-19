import { computed, onBeforeUnmount, ref, watch, type Ref } from 'vue'
import { getFallbackBlogPostDetail, type BlogPostDetail } from '../data/blog/content'
import type { Locale } from '../data/portfolio/types'
import { fetchBlogPostDetail } from '../services/blogApi'

type BlogDataSource = 'api' | 'fallback'

export const useBlogPostContent = (locale: Readonly<Ref<Locale>>, slug: Readonly<Ref<string>>) => {
  const post = ref<BlogPostDetail | null>(null)
  const dataSource = ref<BlogDataSource>('fallback')
  const isLoading = ref(false)
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
      ? 'Failed to load this post from API. Showing local fallback data.'
      : 'API에서 글 상세를 불러오지 못해 로컬 fallback 데이터를 표시합니다.'

  const load = async () => {
    abortCurrentRequest()

    if (!slug.value) {
      post.value = null
      errorMessage.value = null
      isLoading.value = false
      return
    }

    const controller = new AbortController()
    currentController = controller
    isLoading.value = true
    errorMessage.value = null

    try {
      const apiPost = await fetchBlogPostDetail(locale.value, slug.value, {
        signal: controller.signal,
      })

      if (controller.signal.aborted) {
        return
      }

      if (apiPost) {
        post.value = apiPost
        dataSource.value = 'api'
        return
      }

      post.value = getFallbackBlogPostDetail(locale.value, slug.value)
      dataSource.value = 'fallback'
      errorMessage.value = getFetchFailedMessage(locale.value)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }

      post.value = getFallbackBlogPostDetail(locale.value, slug.value)
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

  watch(
    [() => locale.value, () => slug.value],
    () => {
      void load()
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    abortCurrentRequest()
  })

  return {
    post: computed(() => post.value),
    dataSource: computed(() => dataSource.value),
    isLoading: computed(() => isLoading.value),
    errorMessage: computed(() => errorMessage.value),
    reload,
  }
}
