import { computed, onBeforeUnmount, ref, watch, type Ref } from 'vue'
import { blogPageCopyByLocale, type BlogPageCopySet, type BlogPost } from '@/data/blog/content'
import type { Locale } from '@/data/portfolio/types'
import { isBlogApiEnabled } from '@/services/blogApiConfig'
import {
  createBlogPostWithStatus,
  deleteBlogPost,
  fetchBlogPageCopy,
  type BlogMainPagePatchInput,
  type BlogPostCreateInput,
  type BlogPostUpdateInput,
  updateBlogMainPageCopy,
  updateBlogPost,
} from '@/services/blogApi'

type BlogDataSource = 'api' | 'fallback'
type CreatePostResult = {
  ok: boolean
  status: number | null
  source: BlogDataSource
}

export const useBlogContent = (locale: Readonly<Ref<Locale>>) => {
  const copy = ref<BlogPageCopySet>(blogPageCopyByLocale[locale.value])
  const dataSource = ref<BlogDataSource>('fallback')
  const isLoading = ref(false)
  const isUpdating = ref(false)
  const isManagingPost = ref(false)
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

  const toListPost = (input: {
    id: string
    title: string
    excerpt: string
    publishedAt: string
    readTime: string
    tags: string[]
    category: BlogPost['category']
  }): BlogPost => ({
    id: input.id,
    title: input.title,
    excerpt: input.excerpt,
    publishedAt: input.publishedAt,
    readTime: input.readTime,
    tags: input.tags,
    category: input.category,
  })

  const upsertListPost = (post: BlogPost) => {
    const nextPosts = [...copy.value.posts]
    const targetIndex = nextPosts.findIndex((item) => item.id === post.id)

    if (targetIndex === -1) {
      nextPosts.unshift(post)
    } else {
      nextPosts[targetIndex] = post
    }

    const nextPopularPosts = copy.value.popularPosts.map((popularPost) =>
      popularPost.id === post.id
        ? {
            ...popularPost,
            ...post,
          }
        : popularPost,
    )

    copy.value = {
      ...copy.value,
      posts: nextPosts,
      popularPosts: nextPopularPosts,
    }
  }

  const removeListPost = (id: string) => {
    copy.value = {
      ...copy.value,
      posts: copy.value.posts.filter((post) => post.id !== id),
      popularPosts: copy.value.popularPosts.filter((post) => post.id !== id),
    }
  }

  const getPostManageFailedMessage = (currentLocale: Locale) =>
    currentLocale === 'en' ? 'Failed to manage blog post.' : '게시글 관리에 실패했습니다.'

  const buildFallbackPostId = (input: BlogPostCreateInput) => {
    const explicitId = input.id?.trim()

    if (explicitId) {
      return explicitId
    }

    const fromTitle = input.title
      .trim()
      .toLocaleLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    if (fromTitle) {
      return `${fromTitle}-${Date.now()}`
    }

    return `post-${Date.now()}`
  }

  const resolveFallbackPublishedAt = (value?: string) => {
    const trimmed = value?.trim()

    if (trimmed) {
      return trimmed
    }

    return new Date().toISOString().slice(0, 10)
  }

  const createPostWithStatus = async (input: BlogPostCreateInput): Promise<CreatePostResult> => {
    isManagingPost.value = true
    errorMessage.value = null

    if (!isBlogApiEnabled()) {
      const fallbackId = buildFallbackPostId(input)

      upsertListPost(
        toListPost({
          id: fallbackId,
          title: input.title,
          excerpt: input.excerpt,
          publishedAt: resolveFallbackPublishedAt(input.publishedAt),
          readTime: input.readTime ?? (locale.value === 'en' ? '5 min' : '5분'),
          tags: input.tags,
          category: input.category,
        }),
      )
      dataSource.value = 'fallback'
      isManagingPost.value = false
      return {
        ok: true,
        status: null,
        source: 'fallback',
      }
    }

    try {
      const { status, post: created } = await createBlogPostWithStatus(locale.value, input)

      if (!created) {
        errorMessage.value = getPostManageFailedMessage(locale.value)
        return {
          ok: false,
          status,
          source: 'api',
        }
      }

      upsertListPost(
        toListPost({
          id: created.id,
          title: created.title,
          excerpt: created.excerpt,
          publishedAt: created.publishedAt,
          readTime: created.readTime,
          tags: created.tags,
          category: created.category,
        }),
      )
      dataSource.value = 'api'
      return {
        ok: true,
        status,
        source: 'api',
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return {
          ok: false,
          status: null,
          source: 'api',
        }
      }

      errorMessage.value = getPostManageFailedMessage(locale.value)
      return {
        ok: false,
        status: null,
        source: 'api',
      }
    } finally {
      isManagingPost.value = false
    }
  }

  const createPost = async (input: BlogPostCreateInput) => {
    const result = await createPostWithStatus(input)
    return result.ok
  }

  const updatePost = async (id: string, input: BlogPostUpdateInput) => {
    isManagingPost.value = true
    errorMessage.value = null

    if (!isBlogApiEnabled()) {
      const currentPost = copy.value.posts.find((post) => post.id === id)

      if (!currentPost) {
        errorMessage.value = getPostManageFailedMessage(locale.value)
        isManagingPost.value = false
        return false
      }

      upsertListPost(
        toListPost({
          id: currentPost.id,
          title: input.title ?? currentPost.title,
          excerpt: input.excerpt ?? currentPost.excerpt,
          publishedAt: input.publishedAt ?? currentPost.publishedAt,
          readTime: input.readTime ?? currentPost.readTime,
          tags: input.tags ?? currentPost.tags,
          category: input.category ?? currentPost.category,
        }),
      )
      dataSource.value = 'fallback'
      isManagingPost.value = false
      return true
    }

    try {
      const updated = await updateBlogPost(locale.value, id, input)

      if (!updated) {
        errorMessage.value = getPostManageFailedMessage(locale.value)
        return false
      }

      upsertListPost(
        toListPost({
          id: updated.id,
          title: updated.title,
          excerpt: updated.excerpt,
          publishedAt: updated.publishedAt,
          readTime: updated.readTime,
          tags: updated.tags,
          category: updated.category,
        }),
      )
      dataSource.value = 'api'
      return true
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return false
      }

      errorMessage.value = getPostManageFailedMessage(locale.value)
      return false
    } finally {
      isManagingPost.value = false
    }
  }

  const removePost = async (id: string) => {
    isManagingPost.value = true
    errorMessage.value = null

    if (!isBlogApiEnabled()) {
      removeListPost(id)
      dataSource.value = 'fallback'
      isManagingPost.value = false
      return true
    }

    try {
      const deleted = await deleteBlogPost(locale.value, id)

      if (!deleted) {
        errorMessage.value = getPostManageFailedMessage(locale.value)
        return false
      }

      removeListPost(id)
      dataSource.value = 'api'
      return true
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return false
      }

      errorMessage.value = getPostManageFailedMessage(locale.value)
      return false
    } finally {
      isManagingPost.value = false
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
    isManagingPost: computed(() => isManagingPost.value),
    errorMessage: computed(() => errorMessage.value),
    reload,
    updateMainPageCopy,
    createPost,
    createPostWithStatus,
    updatePost,
    removePost,
  }
}
