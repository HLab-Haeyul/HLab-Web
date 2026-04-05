import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { BLOG_CATEGORY_KEYS, type BlogCategoryKey } from '@/data/blog/content'
import { worksByLocale } from '@/data/portfolio/works'
import { useBlogContent } from '@/composables/useBlogContent'
import { useBlogPostContent } from '@/composables/useBlogPostContent'
import { useLocale } from '@/composables/useLocale'
import { fetchBlogPostDetail } from '@/services/blogApi'
import { isBlogApiEnabled } from '@/services/blogApiConfig'
import type {
  AdminBlogCategoryOption,
  AdminBlogRetrospectiveProjectOption,
  BlogPostAdminDraft,
} from '@/types/adminBlog'

type UseAdminBlogManagerOptions = {
  writeMode?: boolean
}

const normalizeProjectKey = (value: string) => value.trim().toLocaleLowerCase().replace(/\s+/g, '')
const normalizeTagToken = (value: string) => value.trim().replace(/^#+/, '').toLocaleLowerCase()
const isBlank = (value: string) => value.trim().length === 0

const emptyDraft = (): BlogPostAdminDraft => ({
  id: '',
  title: '',
  excerpt: '',
  category: (BLOG_CATEGORY_KEYS[0] ?? 'tech') as BlogCategoryKey,
  tags: '',
  retrospectiveProjectKey: '',
  publishedAt: '',
  readTime: '',
  heroTag: '',
  authorName: '',
  markdown: '',
})

const normalizeTagInput = (tags: string[]) =>
  tags
    .map((tag) => tag.replace(/^#+/, '').trim())
    .filter((tag) => tag.length > 0)
    .join(', ')

const sanitizeImageUrl = (raw?: string | null) => {
  if (typeof raw !== 'string') {
    return null
  }

  const value = raw.trim()

  if (!value) {
    return null
  }

  if (value.startsWith('/')) {
    return value
  }

  try {
    const parsed = new URL(value)

    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString()
    }
  } catch {
    return null
  }

  return null
}

export const useAdminBlogManager = (options: UseAdminBlogManagerOptions = {}) => {
  const writeMode = options.writeMode ?? false

  const { locale, route, basePath, adminPath, adminBlogPath, adminBlogWritePath } = useLocale()
  const router = useRouter()
  const { copy, isLoading, isManagingPost, errorMessage, reload, createPostWithStatus, updatePost, removePost } =
    useBlogContent(locale)

  const panelDescription = computed(() =>
    writeMode
      ? '새 게시글을 작성하는 전용 페이지입니다.'
      : isLoading.value
        ? '게시글 목록을 동기화하는 중입니다.'
        : '관리자 경로(/admin/blog)에서 게시글 작성, 수정, 삭제를 수행합니다.',
  )

  const pageHeading = computed(() => (writeMode ? '블로그 글 작성' : '블로그 글 관리'))

  const adminCategoryOptions = computed<AdminBlogCategoryOption[]>(() =>
    BLOG_CATEGORY_KEYS.map((key) => ({
      key,
      label: copy.value.categories[key].title,
    })),
  )

  const retrospectiveProjectOptions = computed<AdminBlogRetrospectiveProjectOption[]>(() => {
    const uniqueByKey = new Map<string, string>()

    worksByLocale[locale.value].forEach((work) => {
      const key = normalizeProjectKey(work.title)

      if (!key || uniqueByKey.has(key)) {
        return
      }

      uniqueByKey.set(key, work.title)
    })

    return [...uniqueByKey.entries()].map(([key, label]) => ({ key, label }))
  })

  const retrospectiveProjectKeySet = computed(
    () => new Set(retrospectiveProjectOptions.value.map((option) => option.key)),
  )

  const resolveRetrospectiveProjectKey = (tags: string[]) => {
    for (const tag of tags) {
      const normalizedTag = normalizeTagToken(tag)

      if (retrospectiveProjectKeySet.value.has(normalizedTag)) {
        return normalizedTag
      }
    }

    return ''
  }

  const composeAdminTags = (
    value: string,
    category: BlogCategoryKey,
    retrospectiveProjectKey: string,
  ) => {
    const unique = new Set<string>()

    value
      .split(/[,\s]+/)
      .map((token) => normalizeTagToken(token))
      .filter((token) => token.length > 0)
      .forEach((token) => unique.add(token))

    if (category === 'retrospective') {
      const normalizedProjectKey = normalizeProjectKey(retrospectiveProjectKey)

      if (normalizedProjectKey.length > 0) {
        unique.add(normalizedProjectKey)
      }
    }

    return [...unique]
  }

  const buildAutoExcerpt = (draft: BlogPostAdminDraft) => {
    const explicitExcerpt = draft.excerpt.trim()

    if (explicitExcerpt.length > 0) {
      return explicitExcerpt
    }

    const markdownPlainText = draft.markdown
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
      .replace(/[*_~>#-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    if (markdownPlainText.length > 0) {
      return markdownPlainText.slice(0, 140)
    }

    return draft.title.trim()
  }

  const handleCreatePost = async (draft: BlogPostAdminDraft) => {
    if (isBlank(draft.title) || isBlank(draft.markdown)) {
      if (typeof window !== 'undefined') {
        window.alert('필수 항목을 입력해주세요: title, markdown.')
      }

      return
    }

    if (draft.category === 'retrospective' && isBlank(draft.retrospectiveProjectKey)) {
      if (typeof window !== 'undefined') {
        window.alert('회고 글은 연결 프로젝트를 선택해주세요.')
      }

      return
    }

    const nextTags = composeAdminTags(draft.tags, draft.category, draft.retrospectiveProjectKey)

    const result = await createPostWithStatus({
      title: draft.title.trim(),
      excerpt: buildAutoExcerpt(draft),
      category: draft.category,
      tags: nextTags,
      markdown: draft.markdown.trim(),
    })

    if (typeof window === 'undefined') {
      return
    }

    if (result.ok) {
      window.alert(`게시글 작성이 성공했습니다. (status: ${result.status ?? 'unknown'})`)

      if (writeMode) {
        await router.push(adminBlogPath.value)
      }

      return
    }

    window.alert(`게시글 작성에 실패했습니다. (status: ${result.status ?? 'unknown'})`)
  }

  const handleUpdatePost = async (draft: BlogPostAdminDraft) => {
    const id = draft.id.trim()

    if (!id) {
      if (typeof window !== 'undefined') {
        window.alert('게시글 ID가 필요합니다.')
      }

      return
    }

    if (draft.category === 'retrospective' && isBlank(draft.retrospectiveProjectKey)) {
      if (typeof window !== 'undefined') {
        window.alert('회고 글은 연결 프로젝트를 선택해주세요.')
      }

      return
    }

    const nextTags = composeAdminTags(draft.tags, draft.category, draft.retrospectiveProjectKey)
    const shouldUpdateTags =
      draft.tags.trim().length > 0 ||
      (draft.category === 'retrospective' && draft.retrospectiveProjectKey.trim().length > 0)

    const payload = {
      title: draft.title.trim() || undefined,
      tags: shouldUpdateTags ? nextTags : undefined,
      markdown: draft.markdown.trim() || undefined,
    }

    const hasAtLeastOneField = Object.values(payload).some((value) => typeof value !== 'undefined')

    if (!hasAtLeastOneField) {
      if (typeof window !== 'undefined') {
        window.alert('수정할 항목을 입력해주세요.')
      }

      return
    }

    await updatePost(id, payload)
  }

  const handleDeletePost = async (payload: { id: string } | string) => {
    const targetId = typeof payload === 'string' ? payload.trim() : payload.id.trim()

    if (!targetId) {
      return
    }

    const confirmLabel = `게시글 \"${targetId}\" 을(를) 삭제하시겠습니까?`

    if (typeof window !== 'undefined' && !window.confirm(confirmLabel)) {
      return
    }

    await removePost(targetId)
  }

  const editQueryId = computed(() => {
    const candidate = Array.isArray(route.query.edit) ? route.query.edit[0] : route.query.edit

    if (typeof candidate !== 'string') {
      return null
    }

    const trimmed = candidate.trim()
    return trimmed.length > 0 ? trimmed : null
  })

  const editTargetPostId = computed(() => editQueryId.value ?? '')
  const {
    post: editTargetPostDetail,
    isLoading: isEditTargetPostLoading,
    errorMessage: editTargetPostErrorMessage,
  } = useBlogPostContent(locale, editTargetPostId)

  const editTargetPost = computed(() => {
    if (!editQueryId.value) {
      return null
    }

    return copy.value.posts.find((post) => post.id === editQueryId.value) ?? null
  })

  const isEditComposerMode = computed(() => Boolean(editQueryId.value))
  const showComposerSection = computed(() => writeMode || isEditComposerMode.value)

  const composerSeedDraft = computed<BlogPostAdminDraft>(() => {
    if (!isEditComposerMode.value) {
      return emptyDraft()
    }

    const detail = editTargetPostDetail.value
    const listPost = editTargetPost.value

    if (!detail && !listPost) {
      return {
        ...emptyDraft(),
        id: editQueryId.value ?? '',
      }
    }

    return {
      id: detail?.id ?? listPost?.id ?? editQueryId.value ?? '',
      title: detail?.title ?? listPost?.title ?? '',
      excerpt: detail?.excerpt ?? listPost?.excerpt ?? '',
      category: detail?.category ?? listPost?.category ?? ((BLOG_CATEGORY_KEYS[0] ?? 'tech') as BlogCategoryKey),
      tags: normalizeTagInput(detail?.tags ?? listPost?.tags ?? []),
      retrospectiveProjectKey: resolveRetrospectiveProjectKey(detail?.tags ?? listPost?.tags ?? []),
      publishedAt: detail?.publishedAt ?? listPost?.publishedAt ?? '',
      readTime: detail?.readTime ?? listPost?.readTime ?? '',
      heroTag: detail?.heroTag ?? '',
      authorName: detail?.authorName ?? '',
      markdown: detail?.markdown ?? '',
    }
  })

  const composerSeedKey = computed(() =>
    isEditComposerMode.value
      ? `edit:${editQueryId.value}:${editTargetPostDetail.value?.id ?? 'loading'}:${editTargetPostDetail.value?.markdown.length ?? 0}`
      : 'create:new',
  )

  const postThumbnailById = ref<Record<string, string>>({})
  let thumbnailLoadToken = 0

  const loadPostThumbnails = async () => {
    const requestToken = ++thumbnailLoadToken
    const postIds = copy.value.posts.map((post) => post.id)
    const nextThumbnailById: Record<string, string> = {}

    if (isBlogApiEnabled() && postIds.length > 0) {
      const thumbnailResults = await Promise.all(
        postIds.map(async (postId) => {
          try {
            const detail = await fetchBlogPostDetail(locale.value, postId)

            if (!detail?.images || detail.images.length === 0) {
              return [postId, null] as const
            }

            for (const image of detail.images) {
              const src = sanitizeImageUrl(image.src)

              if (src) {
                return [postId, src] as const
              }
            }

            return [postId, null] as const
          } catch {
            return [postId, null] as const
          }
        }),
      )

      if (requestToken !== thumbnailLoadToken) {
        return
      }

      thumbnailResults.forEach(([postId, thumbnailSrc]) => {
        if (thumbnailSrc) {
          nextThumbnailById[postId] = thumbnailSrc
        }
      })
    }

    if (requestToken !== thumbnailLoadToken) {
      return
    }

    postThumbnailById.value = nextThumbnailById
  }

  watch(
    [() => locale.value, () => copy.value.posts.map((post) => post.id).join('|')],
    () => {
      void loadPostThumbnails()
    },
    { immediate: true },
  )

  const openPostFromCard = async (id: string) => {
    await router.push(`${adminBlogPath.value}/${id}`)
  }

  const categoryTitle = (category: BlogCategoryKey) => copy.value.categories[category].title

  return {
    writeMode,
    basePath,
    adminPath,
    adminBlogPath,
    adminBlogWritePath,
    copy,
    isLoading,
    isManagingPost,
    errorMessage,
    reload,
    panelDescription,
    pageHeading,
    adminCategoryOptions,
    retrospectiveProjectOptions,
    editQueryId,
    isEditComposerMode,
    showComposerSection,
    isEditTargetPostLoading,
    editTargetPostErrorMessage,
    composerSeedDraft,
    composerSeedKey,
    postThumbnailById,
    openPostFromCard,
    categoryTitle,
    handleCreatePost,
    handleUpdatePost,
    handleDeletePost,
  }
}
