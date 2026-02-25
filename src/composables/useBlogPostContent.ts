import { computed, onBeforeUnmount, ref, watch, type Ref } from 'vue'
import type { BlogPostDetail } from '@/data/blog/types'
import type { Locale } from '@/data/portfolio/types'
import { isBlogApiEnabled } from '@/services/blogApiConfig'
import { fetchBlogPostDetail } from '@/services/blogApi'

type BlogDataSource = 'api' | 'unavailable'

export const useBlogPostContent = (locale: Readonly<Ref<Locale>>, id: Readonly<Ref<string>>) => {
  const post = ref<BlogPostDetail | null>(null)
  const dataSource = ref<BlogDataSource>('unavailable')
  const isLoading = ref(false)
  const errorMessage = ref<string | null>(null)

  let currentController: AbortController | null = null

  const abortCurrentRequest = () => {
    if (currentController) {
      currentController.abort()
      currentController = null
    }
  }

  const getApiUnavailableMessage = (currentLocale: Locale) =>
    currentLocale === 'en'
      ? 'Blog API is disabled. No local mock data is used.'
      : '블로그 API가 비활성화되어 있습니다. 로컬 모의 데이터는 사용하지 않습니다.'

  const getFetchFailedMessage = (currentLocale: Locale) =>
    currentLocale === 'en'
      ? 'Failed to load this post from API.'
      : 'API에서 글 상세를 불러오지 못했습니다.'

  const load = async () => {
    abortCurrentRequest()

    if (!id.value) {
      post.value = null
      errorMessage.value = null
      isLoading.value = false
      return
    }

    if (!isBlogApiEnabled()) {
      post.value = null
      dataSource.value = 'unavailable'
      errorMessage.value = getApiUnavailableMessage(locale.value)
      isLoading.value = false
      return
    }

    const controller = new AbortController()
    currentController = controller
    isLoading.value = true
    errorMessage.value = null

    try {
      const apiPost = await fetchBlogPostDetail(locale.value, id.value, {
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

      post.value = null
      dataSource.value = 'unavailable'
      errorMessage.value = getFetchFailedMessage(locale.value)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }

      post.value = null
      dataSource.value = 'unavailable'
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
    [() => locale.value, () => id.value],
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
