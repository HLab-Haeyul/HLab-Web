import { computed, type Ref } from 'vue'
import { BLOG_CATEGORY_KEYS, type BlogCategoryKey, type BlogPageCopySet } from '@/data/blog/content'
import { worksByLocale } from '@/data/portfolio/works'
import type { Locale } from '@/data/portfolio/types'

/* ── helpers ───────────────────────────────────────────── */

const normalizeProjectKey = (value: string) => value.trim().toLocaleLowerCase().replace(/\s+/g, '')

const normalizeTagToken = (value: string) => value.trim().replace(/^#+/, '').toLocaleLowerCase()

const isBlank = (value: string) => value.trim().length === 0

/* ── types ─────────────────────────────────────────────── */

export type BlogPostAdminDraft = {
  id: string
  title: string
  excerpt: string
  category: BlogCategoryKey
  tags: string
  retrospectiveProjectKey: string
  publishedAt: string
  readTime: string
  heroTag: string
  authorName: string
  markdown: string
}

/* ── composable ────────────────────────────────────────── */

export const useBlogAdmin = (
  locale: Readonly<Ref<Locale>>,
  copy: Readonly<Ref<BlogPageCopySet>>,
  actions: {
    createPost: (input: {
      title: string
      excerpt: string
      category: BlogCategoryKey
      tags: string[]
      markdown: string
    }) => Promise<void>
    updatePost: (
      id: string,
      payload: {
        title?: string
        tags?: string[]
        markdown?: string
      },
    ) => Promise<void>
    removePost: (id: string) => Promise<void>
    isManagingPost: Readonly<Ref<boolean>>
  },
  route: { query: Record<string, unknown> },
) => {
  const { createPost, updatePost, removePost, isManagingPost } = actions

  /* ── admin mode ──────────────────────────────────────── */

  const isAdminPostMode = computed(() => {
    const envFlag = (import.meta.env.VITE_BLOG_POST_ADMIN_ENABLED as string | undefined)?.trim()
    const queryValue = Array.isArray(route.query.admin) ? route.query.admin[0] : route.query.admin
    return envFlag === 'true' || queryValue === '1'
  })

  /* ── i18n labels ─────────────────────────────────────── */

  const adminPanelTitle = computed(() =>
    locale.value === 'en' ? 'Blog Post Manager' : '블로그 게시글 관리자',
  )
  const adminPanelDescription = computed(() =>
    locale.value === 'en'
      ? 'Create, update, and delete blog posts for admin use.'
      : '관리자용으로 게시글 작성, 수정, 삭제를 수행합니다.',
  )
  const adminIdLabel = computed(() => (locale.value === 'en' ? 'Post ID' : '게시글 ID'))
  const adminTitleLabel = computed(() => (locale.value === 'en' ? 'Title' : '제목'))
  const adminExcerptLabel = computed(() => (locale.value === 'en' ? 'Excerpt' : '요약'))
  const adminCategoryLabel = computed(() => (locale.value === 'en' ? 'Category' : '카테고리'))
  const adminTagsLabel = computed(() => (locale.value === 'en' ? 'Tags' : '태그'))
  const adminTagsPlaceholder = computed(() =>
    locale.value === 'en' ? 'vue,typescript,retrospective' : 'vue,typescript,회고',
  )
  const adminRetrospectiveProjectLabel = computed(() =>
    locale.value === 'en' ? 'Linked Project' : '연결 프로젝트',
  )
  const adminRetrospectiveProjectPlaceholder = computed(() =>
    locale.value === 'en' ? 'Select project' : '프로젝트 선택',
  )
  const adminPublishedAtLabel = computed(() => (locale.value === 'en' ? 'Published At' : '발행일'))
  const adminReadTimeLabel = computed(() => (locale.value === 'en' ? 'Read Time' : '읽기 시간'))
  const adminHeroTagLabel = computed(() => (locale.value === 'en' ? 'Hero Tag' : '히어로 태그'))
  const adminAuthorLabel = computed(() => (locale.value === 'en' ? 'Author' : '작성자'))
  const adminMarkdownLabel = computed(() => (locale.value === 'en' ? 'Markdown' : '마크다운 본문'))
  const adminMarkdownPlaceholder = computed(() =>
    locale.value === 'en' ? 'Write markdown content here...' : '마크다운 본문을 입력하세요...',
  )
  const adminCreateLabel = computed(() => (locale.value === 'en' ? 'Create Post' : '게시글 작성'))
  const adminUpdateLabel = computed(() => (locale.value === 'en' ? 'Update Post' : '게시글 수정'))
  const adminDeleteLabel = computed(() => (locale.value === 'en' ? 'Delete Post' : '게시글 삭제'))
  const adminResetLabel = computed(() => (locale.value === 'en' ? 'Reset' : '초기화'))

  /* ── category options ────────────────────────────────── */

  const adminCategoryOptions = computed(() =>
    BLOG_CATEGORY_KEYS.map((key) => ({
      key,
      label: copy.value.categories[key].title,
    })),
  )

  const retrospectiveProjectOptions = computed(() => {
    const uniqueByKey = new Map<string, string>()
    worksByLocale[locale.value].forEach((work) => {
      const key = normalizeProjectKey(work.title)
      if (!key || uniqueByKey.has(key)) return
      uniqueByKey.set(key, work.title)
    })
    return [...uniqueByKey.entries()].map(([key, label]) => ({ key, label }))
  })

  /* ── tag composition ─────────────────────────────────── */

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
      const normalized = normalizeProjectKey(retrospectiveProjectKey)
      if (normalized.length > 0) unique.add(normalized)
    }
    return [...unique]
  }

  const buildAutoExcerpt = (draft: BlogPostAdminDraft) => {
    const explicit = draft.excerpt.trim()
    if (explicit.length > 0) return explicit

    const plain = draft.markdown
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
      .replace(/[*_~>#-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    if (plain.length > 0) return plain.slice(0, 140)
    return draft.title.trim()
  }

  /* ── CRUD handlers ───────────────────────────────────── */

  const getAdminValidationMessage = () =>
    locale.value === 'en'
      ? 'Please fill in required fields: title, markdown.'
      : '필수 항목을 입력해주세요: title, markdown.'

  const handleCreatePost = async (draft: BlogPostAdminDraft) => {
    if (isBlank(draft.title) || isBlank(draft.markdown)) {
      if (typeof window !== 'undefined') window.alert(getAdminValidationMessage())
      return
    }
    if (draft.category === 'retrospective' && isBlank(draft.retrospectiveProjectKey)) {
      if (typeof window !== 'undefined') {
        window.alert(
          locale.value === 'en'
            ? 'Please select a linked project.'
            : '회고 글은 연결 프로젝트를 선택해주세요.',
        )
      }
      return
    }
    const nextTags = composeAdminTags(draft.tags, draft.category, draft.retrospectiveProjectKey)
    await createPost({
      title: draft.title.trim(),
      excerpt: buildAutoExcerpt(draft),
      category: draft.category,
      tags: nextTags,
      markdown: draft.markdown.trim(),
    })
  }

  const handleUpdatePost = async (draft: BlogPostAdminDraft) => {
    const id = draft.id.trim()
    if (!id) {
      if (typeof window !== 'undefined') {
        window.alert(locale.value === 'en' ? 'Post ID is required.' : '게시글 ID가 필요합니다.')
      }
      return
    }
    if (draft.category === 'retrospective' && isBlank(draft.retrospectiveProjectKey)) {
      if (typeof window !== 'undefined') {
        window.alert(
          locale.value === 'en'
            ? 'Please select a linked project.'
            : '회고 글은 연결 프로젝트를 선택해주세요.',
        )
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
    const hasField = Object.values(payload).some((v) => typeof v !== 'undefined')
    if (!hasField) {
      if (typeof window !== 'undefined') {
        window.alert(locale.value === 'en' ? 'No fields to update.' : '수정할 항목을 입력해주세요.')
      }
      return
    }
    await updatePost(id, payload)
  }

  const handleDeletePost = async ({ id }: { id: string }) => {
    const targetId = id.trim()
    if (!targetId) return
    const confirmLabel =
      locale.value === 'en'
        ? `Do you want to delete post "${targetId}"?`
        : `게시글 "${targetId}" 을(를) 삭제하시겠습니까?`
    if (typeof window !== 'undefined' && !window.confirm(confirmLabel)) return
    await removePost(targetId)
  }

  return {
    isAdminPostMode,
    isManagingPost,
    /* labels */
    adminPanelTitle,
    adminPanelDescription,
    adminIdLabel,
    adminTitleLabel,
    adminExcerptLabel,
    adminCategoryLabel,
    adminTagsLabel,
    adminTagsPlaceholder,
    adminRetrospectiveProjectLabel,
    adminRetrospectiveProjectPlaceholder,
    adminPublishedAtLabel,
    adminReadTimeLabel,
    adminHeroTagLabel,
    adminAuthorLabel,
    adminMarkdownLabel,
    adminMarkdownPlaceholder,
    adminCreateLabel,
    adminUpdateLabel,
    adminDeleteLabel,
    adminResetLabel,
    /* options */
    adminCategoryOptions,
    retrospectiveProjectOptions,
    /* handlers */
    handleCreatePost,
    handleUpdatePost,
    handleDeletePost,
  }
}
