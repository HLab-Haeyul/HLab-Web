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

type EngagementDataSource = 'api' | 'fallback'

type InteractionSnapshot = {
  likes: number
  liked: boolean
  comments: BlogComment[]
}

const DEFAULT_COMMENT_PAGE_SIZE = 5

const makeFallbackLikes = (_id: string) => 0

const createStorageKey = (locale: Locale, id: string) => `blog:engagement:${locale}:${id}`

const readFromStorage = (locale: Locale, id: string): InteractionSnapshot | null => {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = window.localStorage.getItem(createStorageKey(locale, id))

  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as unknown

    if (typeof parsed !== 'object' || parsed === null) {
      return null
    }

    const candidate = parsed as Record<string, unknown>

    if (
      typeof candidate.likes !== 'number' ||
      typeof candidate.liked !== 'boolean' ||
      !Array.isArray(candidate.comments)
    ) {
      return null
    }

    const comments = candidate.comments.filter((item): item is BlogComment => {
      if (typeof item !== 'object' || item === null) {
        return false
      }

      const comment = item as Record<string, unknown>

      return (
        typeof comment.id === 'string' &&
        typeof comment.authorName === 'string' &&
        typeof comment.body === 'string' &&
        typeof comment.createdAt === 'string'
      )
    })

    return {
      likes: candidate.likes,
      liked: candidate.liked,
      comments,
    }
  } catch {
    return null
  }
}

const writeToStorage = (locale: Locale, id: string, snapshot: InteractionSnapshot) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(createStorageKey(locale, id), JSON.stringify(snapshot))
}

const generateCommentId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `comment-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export const useBlogEngagement = (locale: Readonly<Ref<Locale>>, id: Readonly<Ref<string>>) => {
  const likes = ref(0)
  const liked = ref(false)
  const comments = ref<BlogComment[]>([])
  const cachedComments = ref<BlogComment[]>([])
  const dataSource = ref<EngagementDataSource>('fallback')
  const isLoading = ref(false)
  const isCommentPageLoading = ref(false)
  const isSubmitting = ref(false)
  const isCommentActionLoading = ref(false)
  const errorMessage = ref<string | null>(null)

  const commentPage = ref(1)
  const commentPageSize = ref(DEFAULT_COMMENT_PAGE_SIZE)
  const totalCommentCount = ref(0)

  let currentController: AbortController | null = null

  const getDefaultSnapshot = (currentId: string): InteractionSnapshot => ({
    likes: makeFallbackLikes(currentId),
    liked: false,
    comments: [],
  })

  const getSyncErrorMessage = (currentLocale: Locale) =>
    currentLocale === 'en'
      ? 'Engagement sync with API failed. Running in fallback mode.'
      : '좋아요/댓글 API 동기화에 실패하여 fallback 모드로 동작합니다.'

  const totalCommentPages = computed(() => {
    if (totalCommentCount.value <= 0) {
      return 1
    }

    return Math.max(1, Math.ceil(totalCommentCount.value / commentPageSize.value))
  })

  const hasPreviousCommentPage = computed(() => commentPage.value > 1)
  const hasNextCommentPage = computed(() => commentPage.value < totalCommentPages.value)

  const persistSnapshot = (currentLocale: Locale, currentId: string) => {
    writeToStorage(currentLocale, currentId, {
      likes: likes.value,
      liked: liked.value,
      comments: cachedComments.value,
    })
  }

  const applyFallbackComments = (targetPage: number) => {
    const size = Math.max(1, commentPageSize.value)
    const total = cachedComments.value.length
    const totalPages = total <= 0 ? 1 : Math.ceil(total / size)
    const safePage = Math.min(Math.max(1, targetPage), totalPages)
    const start = (safePage - 1) * size

    comments.value = cachedComments.value.slice(start, start + size)
    commentPage.value = safePage
    totalCommentCount.value = total
  }

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

  const applyCommentUpdateInFallback = (commentId: string, nextBody: string) => {
    cachedComments.value = cachedComments.value.map((comment) =>
      comment.id === commentId
        ? {
            ...comment,
            body: nextBody,
          }
        : comment,
    )

    applyFallbackComments(commentPage.value)
  }

  const applyCommentDeletionInFallback = (commentId: string) => {
    cachedComments.value = cachedComments.value.filter((comment) => comment.id !== commentId)
    applyFallbackComments(commentPage.value)
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

    const nextPage = Number.isInteger(targetPage) ? Math.max(1, targetPage) : 1

    if (!isBlogApiEnabled()) {
      commentPageSize.value = DEFAULT_COMMENT_PAGE_SIZE
      applyFallbackComments(nextPage)
      return
    }

    abortCurrentRequest()

    const controller = new AbortController()
    currentController = controller
    isCommentPageLoading.value = true

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
        dataSource.value = 'fallback'
        errorMessage.value = getSyncErrorMessage(locale.value)
        applyFallbackComments(nextPage)
        return
      }

      setCommentPageFromApi(pageData.items, pageData.page, pageData.pageSize, pageData.totalCount)

      if (pageData.page === 1) {
        cachedComments.value = pageData.items
        persistSnapshot(locale.value, id.value)
      }

      dataSource.value = 'api'
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }

      dataSource.value = 'fallback'
      errorMessage.value = getSyncErrorMessage(locale.value)
      applyFallbackComments(nextPage)
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
      likes.value = 0
      liked.value = false
      comments.value = []
      cachedComments.value = []
      commentPage.value = 1
      commentPageSize.value = DEFAULT_COMMENT_PAGE_SIZE
      totalCommentCount.value = 0
      errorMessage.value = null
      isLoading.value = false
      isCommentPageLoading.value = false
      return
    }

    const currentId = id.value
    const fromStorage = readFromStorage(locale.value, currentId)
    const baseSnapshot = fromStorage ?? getDefaultSnapshot(currentId)

    likes.value = baseSnapshot.likes
    liked.value = baseSnapshot.liked
    cachedComments.value = baseSnapshot.comments
    commentPageSize.value = DEFAULT_COMMENT_PAGE_SIZE
    applyFallbackComments(1)
    dataSource.value = 'fallback'
    errorMessage.value = null
    isLoading.value = true
    isCommentPageLoading.value = false

    if (!isBlogApiEnabled()) {
      persistSnapshot(locale.value, currentId)
      isLoading.value = false
      return
    }

    const controller = new AbortController()
    currentController = controller

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
        persistSnapshot(locale.value, currentId)
        errorMessage.value = getSyncErrorMessage(locale.value)
        return
      }

      likes.value = engagementData.likes
      liked.value = engagementData.liked
      setCommentPageFromApi(pageData.items, pageData.page, pageData.pageSize, pageData.totalCount)
      cachedComments.value = pageData.items
      persistSnapshot(locale.value, currentId)
      dataSource.value = 'api'
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }

      persistSnapshot(locale.value, currentId)
      errorMessage.value = getSyncErrorMessage(locale.value)
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

    const nextLiked = !liked.value
    const nextLikes = Math.max(0, likes.value + (nextLiked ? 1 : -1))

    likes.value = nextLikes
    liked.value = nextLiked
    persistSnapshot(locale.value, id.value)
    errorMessage.value = null

    if (!isBlogApiEnabled()) {
      dataSource.value = 'fallback'
      return
    }

    try {
      const synced = await toggleBlogLike(locale.value, id.value, nextLiked)

      if (!synced) {
        dataSource.value = 'fallback'
        errorMessage.value = getSyncErrorMessage(locale.value)
        return
      }

      likes.value = synced.likes
      liked.value = synced.liked
      persistSnapshot(locale.value, id.value)
      dataSource.value = 'api'
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }

      dataSource.value = 'fallback'
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

    const trimmedAuthor = authorName.trim()
    const now = new Date().toISOString()
    const fallbackAuthor = locale.value === 'en' ? 'Anonymous' : '익명'
    const optimisticComment: BlogComment = {
      id: generateCommentId(),
      authorName: trimmedAuthor || fallbackAuthor,
      body: trimmedBody,
      createdAt: now,
    }

    isSubmitting.value = true
    errorMessage.value = null

    if (!isBlogApiEnabled()) {
      cachedComments.value = [optimisticComment, ...cachedComments.value]
      persistSnapshot(locale.value, id.value)
      applyFallbackComments(1)
      dataSource.value = 'fallback'
      isSubmitting.value = false
      return
    }

    try {
      const created = await createBlogComment(
        locale.value,
        id.value,
        {
          authorName: optimisticComment.authorName,
          body: optimisticComment.body,
        },
      )

      if (!created) {
        dataSource.value = 'fallback'
        errorMessage.value = getSyncErrorMessage(locale.value)
        return
      }

      await loadCommentsPage(1)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }

      dataSource.value = 'fallback'
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

    isCommentActionLoading.value = true
    errorMessage.value = null

    if (!isBlogApiEnabled()) {
      applyCommentUpdateInFallback(commentId, nextBody)
      persistSnapshot(locale.value, id.value)
      dataSource.value = 'fallback'
      isCommentActionLoading.value = false
      return true
    }

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
        dataSource.value = 'fallback'
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

      dataSource.value = 'fallback'
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

    isCommentActionLoading.value = true
    errorMessage.value = null

    if (!isBlogApiEnabled()) {
      applyCommentDeletionInFallback(commentId)
      persistSnapshot(locale.value, id.value)
      dataSource.value = 'fallback'
      isCommentActionLoading.value = false
      return true
    }

    try {
      const deleted = await deleteBlogComment(locale.value, id.value, commentId)

      if (!deleted) {
        dataSource.value = 'fallback'
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

      dataSource.value = 'fallback'
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
