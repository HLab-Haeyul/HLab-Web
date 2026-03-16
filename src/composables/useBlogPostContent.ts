import { computed, onBeforeUnmount, ref, watch, type Ref } from 'vue'
import { getMockBlogPostDetail, type BlogPostDetail } from '@/data/blog/content'
import type { Locale } from '@/data/portfolio/types'
import { isBlogApiEnabled } from '@/services/blogApiConfig'
import { fetchBlogPostDetail } from '@/services/blogApi'

type BlogDataSource = 'api' | 'mock' | 'unavailable'

export const useBlogPostContent = (locale: Readonly<Ref<Locale>>, id: Readonly<Ref<string>>) => {
  const post = ref<BlogPostDetail | null>(getMockBlogPostDetail(locale.value, id.value))
  const dataSource = ref<BlogDataSource>(post.value ? 'mock' : 'unavailable')
  const isLoading = ref(false)
  const errorMessage = ref<string | null>(null)

  let currentController: AbortController | null = null

  const abortCurrentRequest = () => {
    if (currentController) {
      currentController.abort()
      currentController = null
    }
  }

  const applyMockPost = (message: string | null) => {
    const mockPost = getMockBlogPostDetail(locale.value, id.value)

    post.value = mockPost
    dataSource.value = mockPost ? 'mock' : 'unavailable'
    errorMessage.value = mockPost ? message : null
    isLoading.value = false
  }

  const load = async () => {
    abortCurrentRequest()

    if (!id.value) {
      post.value = null
      errorMessage.value = null
      isLoading.value = false
      return
    }

    if (!isBlogApiEnabled()) {
      applyMockPost(null)
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

      applyMockPost(null)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }

      applyMockPost(null)
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
