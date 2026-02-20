import { computed, onBeforeUnmount, ref, watch, type Ref } from 'vue'
import type { BlogComment } from '@/data/blog/content'
import type { Locale } from '@/data/portfolio/types'
import { isBlogApiEnabled } from '@/services/blogApiConfig'
import { createBlogComment, fetchBlogEngagement, toggleBlogLike } from '@/services/blogInteractionApi'

type EngagementDataSource = 'api' | 'fallback'

type InteractionSnapshot = {
  likes: number
  liked: boolean
  comments: BlogComment[]
}

const makeFallbackLikes = (slug: string) => {
  const seed = [...slug].reduce((acc, char) => acc + char.charCodeAt(0), 0)

  return 24 + (seed % 170)
}

const createStorageKey = (locale: Locale, slug: string) => `blog:engagement:${locale}:${slug}`

const readFromStorage = (locale: Locale, slug: string): InteractionSnapshot | null => {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = window.localStorage.getItem(createStorageKey(locale, slug))

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

const writeToStorage = (locale: Locale, slug: string, snapshot: InteractionSnapshot) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(createStorageKey(locale, slug), JSON.stringify(snapshot))
}

const generateCommentId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `comment-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export const useBlogEngagement = (locale: Readonly<Ref<Locale>>, slug: Readonly<Ref<string>>) => {
  const likes = ref(0)
  const liked = ref(false)
  const comments = ref<BlogComment[]>([])
  const dataSource = ref<EngagementDataSource>('fallback')
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const errorMessage = ref<string | null>(null)

  let currentController: AbortController | null = null

  const getDefaultSnapshot = (currentSlug: string): InteractionSnapshot => ({
    likes: makeFallbackLikes(currentSlug),
    liked: false,
    comments: [],
  })

  const setSnapshot = (snapshot: InteractionSnapshot) => {
    likes.value = snapshot.likes
    liked.value = snapshot.liked
    comments.value = snapshot.comments
  }

  const getSyncErrorMessage = (currentLocale: Locale) =>
    currentLocale === 'en'
      ? 'Engagement sync with API failed. Running in fallback mode.'
      : '좋아요/댓글 API 동기화에 실패하여 fallback 모드로 동작합니다.'

  const abortCurrentRequest = () => {
    if (currentController) {
      currentController.abort()
      currentController = null
    }
  }

  const load = async () => {
    abortCurrentRequest()

    if (!slug.value) {
      setSnapshot(getDefaultSnapshot('default'))
      errorMessage.value = null
      isLoading.value = false
      return
    }

    const currentSlug = slug.value
    const fromStorage = readFromStorage(locale.value, currentSlug)
    const baseSnapshot = fromStorage ?? getDefaultSnapshot(currentSlug)

    setSnapshot(baseSnapshot)
    dataSource.value = 'fallback'
    errorMessage.value = null
    isLoading.value = true

    if (!isBlogApiEnabled()) {
      writeToStorage(locale.value, currentSlug, baseSnapshot)
      isLoading.value = false
      return
    }

    const controller = new AbortController()
    currentController = controller

    try {
      const apiData = await fetchBlogEngagement(locale.value, currentSlug, {
        signal: controller.signal,
      })

      if (controller.signal.aborted) {
        return
      }

      if (!apiData) {
        writeToStorage(locale.value, currentSlug, baseSnapshot)
        errorMessage.value = getSyncErrorMessage(locale.value)
        return
      }

      const nextSnapshot: InteractionSnapshot = {
        likes: apiData.likes,
        liked: apiData.liked,
        comments: apiData.comments,
      }

      setSnapshot(nextSnapshot)
      writeToStorage(locale.value, currentSlug, nextSnapshot)
      dataSource.value = 'api'
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }

      writeToStorage(locale.value, currentSlug, baseSnapshot)
      errorMessage.value = getSyncErrorMessage(locale.value)
    } finally {
      if (!controller.signal.aborted && currentController === controller) {
        isLoading.value = false
        currentController = null
      }
    }
  }

  const toggleLike = async () => {
    if (!slug.value) {
      return
    }

    const nextLiked = !liked.value
    const nextLikes = Math.max(0, likes.value + (nextLiked ? 1 : -1))
    const optimisticSnapshot: InteractionSnapshot = {
      likes: nextLikes,
      liked: nextLiked,
      comments: comments.value,
    }

    setSnapshot(optimisticSnapshot)
    writeToStorage(locale.value, slug.value, optimisticSnapshot)
    errorMessage.value = null

    if (!isBlogApiEnabled()) {
      dataSource.value = 'fallback'
      return
    }

    try {
      const synced = await toggleBlogLike(locale.value, slug.value, nextLiked)

      if (!synced) {
        dataSource.value = 'fallback'
        errorMessage.value = getSyncErrorMessage(locale.value)
        return
      }

      const nextSnapshot: InteractionSnapshot = {
        likes: synced.likes,
        liked: synced.liked,
        comments: comments.value,
      }

      setSnapshot(nextSnapshot)
      writeToStorage(locale.value, slug.value, nextSnapshot)
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
    if (!slug.value) {
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

    const optimisticSnapshot: InteractionSnapshot = {
      likes: likes.value,
      liked: liked.value,
      comments: [optimisticComment, ...comments.value],
    }

    setSnapshot(optimisticSnapshot)
    writeToStorage(locale.value, slug.value, optimisticSnapshot)
    isSubmitting.value = true
    errorMessage.value = null

    if (!isBlogApiEnabled()) {
      dataSource.value = 'fallback'
      isSubmitting.value = false
      return
    }

    try {
      const created = await createBlogComment(
        locale.value,
        slug.value,
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

      const nextComments = [created, ...comments.value.filter((comment) => comment.id !== optimisticComment.id)]
      const nextSnapshot: InteractionSnapshot = {
        likes: likes.value,
        liked: liked.value,
        comments: nextComments,
      }

      setSnapshot(nextSnapshot)
      writeToStorage(locale.value, slug.value, nextSnapshot)
      dataSource.value = 'api'
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
    likes: computed(() => likes.value),
    liked: computed(() => liked.value),
    comments: computed(() => comments.value),
    dataSource: computed(() => dataSource.value),
    isLoading: computed(() => isLoading.value),
    isSubmitting: computed(() => isSubmitting.value),
    errorMessage: computed(() => errorMessage.value),
    toggleLike,
    addComment,
    reload: () => {
      void load()
    },
  }
}
