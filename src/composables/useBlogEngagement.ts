import { computed, onBeforeUnmount, ref, watch, type Ref } from 'vue'
import type { BlogComment } from '@/data/blog/types'
import type { Locale } from '@/data/portfolio/types'
import { isBlogApiEnabled } from '@/services/blogApiConfig'
import {
  createBlogComment,
  deleteBlogComment,
  fetchBlogComments,
  fetchBlogEngagement,
  toggleBlogLike,
  updateBlogComment,
} from '@/services/blogInteractionApi'

type EngagementDataSource = 'api' | 'unavailable'

const DEFAULT_COMMENT_PAGE_SIZE = 5

export const useBlogEngagement = (locale: Readonly<Ref<Locale>>, id: Readonly<Ref<string>>) => {
  const likes = ref(0)
  const liked = ref(false)
  const comments = ref<BlogComment[]>([])
  const dataSource = ref<EngagementDataSource>('unavailable')
  const isLoading = ref(false)
  const isCommentPageLoading = ref(false)
  const isSubmitting = ref(false)
  const isCommentActionLoading = ref(false)
  const errorMessage = ref<string | null>(null)

  const commentPage = ref(1)
  const commentPageSize = ref(DEFAULT_COMMENT_PAGE_SIZE)
  const totalCommentCount = ref(0)

  let currentController: AbortController | null = null

  const getApiUnavailableMessage = (currentLocale: Locale) =>
    currentLocale === 'en'
      ? 'Comment/like API is disabled. No local mock data is used.'
      : '댓글/좋아요 API가 비활성화되어 있습니다. 로컬 모의 데이터는 사용하지 않습니다.'

  const getSyncErrorMessage = (currentLocale: Locale) =>
    currentLocale === 'en'
      ? 'Failed to sync comments/likes with API.'
      : '좋아요/댓글 API 동기화에 실패했습니다.'

  const resetState = () => {
    likes.value = 0
    liked.value = false
    comments.value = []
    commentPage.value = 1
    commentPageSize.value = DEFAULT_COMMENT_PAGE_SIZE
    totalCommentCount.value = 0
  }

  const totalCommentPages = computed(() => {
    if (totalCommentCount.value <= 0) {
      return 1
    }

    return Math.max(1, Math.ceil(totalCommentCount.value / commentPageSize.value))
  })

  const hasPreviousCommentPage = computed(() => commentPage.value > 1)
  const hasNextCommentPage = computed(() => commentPage.value < totalCommentPages.value)

  const setCommentPageFromApi = (
    pageItems: BlogComment[],
    page: number,
    pageSize: number,
    totalCount: number,
  ) => {
    comments.value = pageItems
    commentPage.value = page
    commentPageSize.value = pageSize
    totalCommentCount.value = totalCount
  }

  const abortCurrentRequest = () => {
    if (currentController) {
      currentController.abort()
      currentController = null
    }

    isCommentPageLoading.value = false
  }

  const loadCommentsPage = async (targetPage: number) => {
    if (!id.value) {
      return
    }

    if (!isBlogApiEnabled()) {
      dataSource.value = 'unavailable'
      errorMessage.value = getApiUnavailableMessage(locale.value)
      resetState()
      return
    }

    const nextPage = Number.isInteger(targetPage) ? Math.max(1, targetPage) : 1
    abortCurrentRequest()

    const controller = new AbortController()
    currentController = controller
    isCommentPageLoading.value = true
    errorMessage.value = null

    try {
      const pageData = await fetchBlogComments(
        locale.value,
        id.value,
        {
          page: nextPage,
          pageSize: commentPageSize.value,
        },
        {
          signal: controller.signal,
        },
      )

      if (controller.signal.aborted) {
        return
      }

      if (!pageData) {
        dataSource.value = 'unavailable'
        errorMessage.value = getSyncErrorMessage(locale.value)
        return
      }

      setCommentPageFromApi(pageData.items, pageData.page, pageData.pageSize, pageData.totalCount)
      dataSource.value = 'api'
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }

      dataSource.value = 'unavailable'
      errorMessage.value = getSyncErrorMessage(locale.value)
    } finally {
      if (!controller.signal.aborted && currentController === controller) {
        isCommentPageLoading.value = false
        currentController = null
      }
    }
  }

  const load = async () => {
    abortCurrentRequest()

    if (!id.value) {
      resetState()
      errorMessage.value = null
      isLoading.value = false
      isCommentPageLoading.value = false
      return
    }

    if (!isBlogApiEnabled()) {
      resetState()
      dataSource.value = 'unavailable'
      errorMessage.value = getApiUnavailableMessage(locale.value)
      isLoading.value = false
      return
    }

    const currentId = id.value
    const controller = new AbortController()
    currentController = controller
    isLoading.value = true
    isCommentPageLoading.value = false
    errorMessage.value = null

    try {
      const [engagementData, pageData] = await Promise.all([
        fetchBlogEngagement(locale.value, currentId, {
          signal: controller.signal,
        }),
        fetchBlogComments(
          locale.value,
          currentId,
          {
            page: 1,
            pageSize: DEFAULT_COMMENT_PAGE_SIZE,
          },
          {
            signal: controller.signal,
          },
        ),
      ])

      if (controller.signal.aborted) {
        return
      }

      if (!engagementData || !pageData) {
        dataSource.value = 'unavailable'
        errorMessage.value = getSyncErrorMessage(locale.value)
        resetState()
        return
      }

      likes.value = engagementData.likes
      liked.value = engagementData.liked
      setCommentPageFromApi(pageData.items, pageData.page, pageData.pageSize, pageData.totalCount)
      dataSource.value = 'api'
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }

      dataSource.value = 'unavailable'
      errorMessage.value = getSyncErrorMessage(locale.value)
      resetState()
    } finally {
      if (!controller.signal.aborted && currentController === controller) {
        isLoading.value = false
        currentController = null
      }
    }
  }

  const toggleLike = async () => {
    if (!id.value) {
      return
    }

    if (!isBlogApiEnabled()) {
      dataSource.value = 'unavailable'
      errorMessage.value = getApiUnavailableMessage(locale.value)
      return
    }

    const nextLiked = !liked.value
    errorMessage.value = null

    try {
      const synced = await toggleBlogLike(locale.value, id.value, nextLiked)

      if (!synced) {
        dataSource.value = 'unavailable'
        errorMessage.value = getSyncErrorMessage(locale.value)
        return
      }

      likes.value = synced.likes
      liked.value = synced.liked
      dataSource.value = 'api'
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }

      dataSource.value = 'unavailable'
      errorMessage.value = getSyncErrorMessage(locale.value)
    }
  }

  const addComment = async (authorName: string, body: string) => {
    if (!id.value) {
      return
    }

    const trimmedBody = body.trim()

    if (!trimmedBody) {
      return
    }

    if (!isBlogApiEnabled()) {
      dataSource.value = 'unavailable'
      errorMessage.value = getApiUnavailableMessage(locale.value)
      return
    }

    const trimmedAuthor = authorName.trim()
    const finalAuthor = trimmedAuthor || (locale.value === 'en' ? 'Anonymous' : '익명')
    isSubmitting.value = true
    errorMessage.value = null

    try {
      const created = await createBlogComment(
        locale.value,
        id.value,
        {
          authorName: finalAuthor,
          body: trimmedBody,
        },
      )

      if (!created) {
        dataSource.value = 'unavailable'
        errorMessage.value = getSyncErrorMessage(locale.value)
        return
      }

      await loadCommentsPage(1)
      dataSource.value = 'api'
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }

      dataSource.value = 'unavailable'
      errorMessage.value = getSyncErrorMessage(locale.value)
    } finally {
      isSubmitting.value = false
    }
  }

  const updateComment = async (commentId: string, body: string) => {
    if (!id.value) {
      return false
    }

    const nextBody = body.trim()

    if (!nextBody) {
      return false
    }

    if (!isBlogApiEnabled()) {
      dataSource.value = 'unavailable'
      errorMessage.value = getApiUnavailableMessage(locale.value)
      return false
    }

    isCommentActionLoading.value = true
    errorMessage.value = null

    try {
      const updated = await updateBlogComment(
        locale.value,
        id.value,
        commentId,
        {
          body: nextBody,
        },
      )

      if (!updated) {
        dataSource.value = 'unavailable'
        errorMessage.value = getSyncErrorMessage(locale.value)
        return false
      }

      await loadCommentsPage(commentPage.value)
      dataSource.value = 'api'
      return true
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return false
      }

      dataSource.value = 'unavailable'
      errorMessage.value = getSyncErrorMessage(locale.value)
      return false
    } finally {
      isCommentActionLoading.value = false
    }
  }

  const removeComment = async (commentId: string) => {
    if (!id.value) {
      return false
    }

    if (!isBlogApiEnabled()) {
      dataSource.value = 'unavailable'
      errorMessage.value = getApiUnavailableMessage(locale.value)
      return false
    }

    isCommentActionLoading.value = true
    errorMessage.value = null

    try {
      const deleted = await deleteBlogComment(locale.value, id.value, commentId)

      if (!deleted) {
        dataSource.value = 'unavailable'
        errorMessage.value = getSyncErrorMessage(locale.value)
        return false
      }

      await loadCommentsPage(commentPage.value)
      dataSource.value = 'api'
      return true
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return false
      }

      dataSource.value = 'unavailable'
      errorMessage.value = getSyncErrorMessage(locale.value)
      return false
    } finally {
      isCommentActionLoading.value = false
    }
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
    likes: computed(() => likes.value),
    liked: computed(() => liked.value),
    comments: computed(() => comments.value),
    commentPage: computed(() => commentPage.value),
    commentPageSize: computed(() => commentPageSize.value),
    totalCommentCount: computed(() => totalCommentCount.value),
    totalCommentPages: computed(() => totalCommentPages.value),
    hasPreviousCommentPage: computed(() => hasPreviousCommentPage.value),
    hasNextCommentPage: computed(() => hasNextCommentPage.value),
    dataSource: computed(() => dataSource.value),
    isLoading: computed(() => isLoading.value),
    isCommentPageLoading: computed(() => isCommentPageLoading.value),
    isSubmitting: computed(() => isSubmitting.value),
    isCommentActionLoading: computed(() => isCommentActionLoading.value),
    errorMessage: computed(() => errorMessage.value),
    toggleLike,
    addComment,
    updateComment,
    removeComment,
    goToCommentPage: (page: number) => {
      void loadCommentsPage(page)
    },
    goToPreviousCommentPage: () => {
      if (!hasPreviousCommentPage.value) {
        return
      }

      void loadCommentsPage(commentPage.value - 1)
    },
    goToNextCommentPage: () => {
      if (!hasNextCommentPage.value) {
        return
      }

      void loadCommentsPage(commentPage.value + 1)
    },
    reload: () => {
      void load()
    },
  }
}
