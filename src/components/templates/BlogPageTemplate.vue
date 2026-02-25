<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  BLOG_CATEGORY_KEYS,
  type BlogCategoryKey,
  type BlogPost,
} from '@/data/blog/content'
import { worksByLocale } from '@/data/portfolio/works'
import { useBlogContent } from '@/composables/useBlogContent'
import { useLocale } from '@/composables/useLocale'
import { fetchBlogPostDetail } from '@/services/blogApi'
import { isBlogApiEnabled } from '@/services/blogApiConfig'
import { getEstimatedViewCount } from '@/utils/blogViews'
import BlogPostAdminPanel from '@/components/organisms/BlogPostAdminPanel.vue'

const { locale } = useLocale()
const route = useRoute()
const router = useRouter()
const { copy, isManagingPost, createPost, updatePost, removePost } = useBlogContent(locale)

const normalizeTagInput = (value: string) =>
  value
    .trim()
    .split(/\s+/)
    .filter((token) => token.length > 0)
    .map((token) => `#${token.replace(/^#+/, '')}`)
    .join(' ')

const parseTagQuery = (value: unknown) => {
  const candidate = Array.isArray(value) ? value[0] : value

  if (typeof candidate !== 'string') {
    return ''
  }

  const trimmed = candidate.trim()

  if (!trimmed) {
    return ''
  }

  if (trimmed.includes(' ')) {
    return normalizeTagInput(trimmed)
  }

  return normalizeTagInput(trimmed)
}

const searchQuery = ref(parseTagQuery(route.query.tag))

const categoryLabel = computed(() => (locale.value === 'en' ? 'Category' : '카테고리'))
const searchLabel = computed(() => (locale.value === 'en' ? 'Search posts' : '글 검색'))
const searchPlaceholder = computed(() =>
  locale.value === 'en'
    ? 'Search title/summary, use #tag (multi-tag: #vue #react)'
    : '제목/요약 검색, 태그 검색은 #태그 (복수: #vue #react)',
)
const searchNoResult = computed(() =>
  locale.value === 'en' ? 'No posts match your search.' : '검색 결과가 없습니다.',
)
const noPostsLabel = computed(() =>
  locale.value === 'en' ? 'No posts have been published yet.' : '아직 게시글이 없습니다.',
)
const searchResultTitle = computed(() => (locale.value === 'en' ? 'Search Results' : '검색 결과'))
const searchResultDescription = computed(() =>
  locale.value === 'en'
    ? 'Showing posts across all categories.'
    : '기술, 프로젝트 회고, 자기 개발 전체에서 검색 결과를 보여줍니다.',
)
const viewLabel = computed(() => (locale.value === 'en' ? 'Views' : '조회수'))
const projectSelectorLabel = computed(() => (locale.value === 'en' ? 'Project' : '프로젝트'))
const projectSelectorPlaceholder = computed(() =>
  locale.value === 'en' ? 'Select project' : '프로젝트 선택',
)
const retrospectiveUnselectedLabel = computed(() =>
  locale.value === 'en'
    ? 'Select a project to see related retrospectives.'
    : '프로젝트를 선택하면 관련 회고 글이 표시됩니다.',
)
const retrospectiveEmptyLabel = computed(() =>
  locale.value === 'en'
    ? 'No retrospective post is linked to this project yet.'
    : '선택한 프로젝트에 연결된 회고 글이 아직 없습니다.',
)
const isAdminPostMode = computed(() => {
  const envFlag = (import.meta.env.VITE_BLOG_POST_ADMIN_ENABLED as string | undefined)?.trim()
  const queryValue = Array.isArray(route.query.admin) ? route.query.admin[0] : route.query.admin

  return envFlag === 'true' || queryValue === '1'
})

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
const adminPublishedAtLabel = computed(() =>
  locale.value === 'en' ? 'Published At' : '발행일',
)
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

const buildPostPath = (id: string) => `${locale.value === 'en' ? '/en' : '/ko'}/blog/${id}`

const adminCategoryOptions = computed(() =>
  BLOG_CATEGORY_KEYS.map((key) => ({
    key,
    label: copy.value.categories[key].title,
  })),
)

const normalizeProjectKey = (value: string) => value.trim().toLocaleLowerCase().replace(/\s+/g, '')
const normalizeTagToken = (value: string) => value.trim().replace(/^#+/, '').toLocaleLowerCase()
const normalizeTagLabel = (value: string) => value.replace(/^#+/, '')
const categoryTitle = (category: BlogCategoryKey) => copy.value.categories[category].title

const retrospectiveProjectOptions = computed(() => {
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

const getViewCount = (id: string) => getEstimatedViewCount(id)
const getCardAnimationDelay = (index: number) => `${Math.min(index, 11) * 45}ms`
const postThumbnailById = ref<Record<string, string>>({})
let thumbnailLoadToken = 0

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

const selectedProjectIndex = ref<number | null>(null)
const projectWorks = computed(() => worksByLocale[locale.value])
const selectedProject = computed(() => {
  const index = selectedProjectIndex.value

  if (index === null || index < 0 || index >= projectWorks.value.length) {
    return null
  }

  return projectWorks.value[index]
})

const projectKeywordMap: Record<string, string[]> = {
  hlab: ['hlab', 'docker', 'deploy', 'pipeline', '배포'],
  clue: ['clue', 'portfolio', '포트폴리오', 'planning', 'v1'],
  sizz: ['sizz', 'news', '뉴스'],
}

const isRetrospectiveLinkedToProject = (post: BlogPost, projectTitle: string) => {
  const key = normalizeProjectKey(projectTitle)
  const normalizedTags = post.tags.map((tag) => normalizeProjectKey(normalizeTagToken(tag)))

  if (normalizedTags.some((tag) => tag === key)) {
    return true
  }

  const hints = projectKeywordMap[key] ?? []
  const keywords = [...new Set([projectTitle.toLocaleLowerCase(), ...hints])]
  const source = `${post.title} ${post.excerpt} ${post.tags.join(' ')}`.toLocaleLowerCase()

  return keywords.some((keyword) => source.includes(keyword.toLocaleLowerCase()))
}

const categoryAnchorMap: Record<BlogCategoryKey, string> = {
  tech: 'tech',
  retrospective: 'retrospective',
  selfDev: 'self-dev',
}

const groupedPosts = computed(() =>
  BLOG_CATEGORY_KEYS.map((categoryKey) => ({
    key: categoryKey,
    anchor: categoryAnchorMap[categoryKey],
    title: copy.value.categories[categoryKey].title,
    description: copy.value.categories[categoryKey].description,
    posts: copy.value.posts.filter((post) => post.category === categoryKey),
  })),
)

const defaultCategory: BlogCategoryKey = BLOG_CATEGORY_KEYS[0] ?? 'tech'

const parseCategoryQuery = (value: unknown): BlogCategoryKey | null => {
  const candidate = Array.isArray(value) ? value[0] : value

  if (typeof candidate !== 'string') {
    return null
  }

  if (candidate === 'self-dev') {
    return 'selfDev'
  }

  return BLOG_CATEGORY_KEYS.find((key) => key === candidate) ?? null
}

const selectedCategory = ref<BlogCategoryKey>(parseCategoryQuery(route.query.category) ?? defaultCategory)

const updateCategoryQuery = (category: BlogCategoryKey) => {
  const currentCategory = parseCategoryQuery(route.query.category)

  if (currentCategory === category) {
    return
  }

  void router.replace({
    path: route.path,
    query: {
      ...route.query,
      category,
    },
    hash: route.hash || '#blog-categories',
  })
}

const selectCategory = (category: BlogCategoryKey) => {
  if (selectedCategory.value === category) {
    return
  }

  selectedCategory.value = category
  updateCategoryQuery(category)
}

const selectProjectWork = (index: number) => {
  selectedProjectIndex.value = index
}

const handleProjectChange = (value: string) => {
  if (!value) {
    selectedProjectIndex.value = null
    return
  }

  const index = Number(value)

  if (Number.isNaN(index)) {
    return
  }

  selectProjectWork(index)
}

const selectedGroup = computed(
  () => groupedPosts.value.find((group) => group.key === selectedCategory.value) ?? groupedPosts.value[0],
)

const parseSearchTerms = (value: string) => {
  const tokens = value
    .trim()
    .split(/\s+/)
    .filter((token) => token.length > 0)

  const keywords: string[] = []
  const tagTerms: string[] = []
  let isTagMode = false

  tokens.forEach((token) => {
    if (token.startsWith('#')) {
      const normalizedTag = token.replace(/^#+/, '').toLocaleLowerCase()

      if (normalizedTag) {
        tagTerms.push(normalizedTag)
        isTagMode = true
      }

      return
    }

    if (isTagMode) {
      tagTerms.push(token.toLocaleLowerCase())
      return
    }

    keywords.push(token.toLocaleLowerCase())
  })

  return {
    keywords,
    tagTerms,
  }
}

const searchTerms = computed(() => parseSearchTerms(searchQuery.value))
const isSearchActive = computed(
  () => searchTerms.value.keywords.length > 0 || searchTerms.value.tagTerms.length > 0,
)

const filterPostsBySearchTerms = (posts: BlogPost[], terms: { keywords: string[]; tagTerms: string[] }) => {
  if (terms.keywords.length === 0 && terms.tagTerms.length === 0) {
    return posts
  }

  return posts.filter((post) => {
    const title = post.title.toLocaleLowerCase()
    const excerpt = post.excerpt.toLocaleLowerCase()
    const normalizedTags = post.tags.map((tag) => tag.toLocaleLowerCase())
    const keywordTarget = `${title} ${excerpt}`

    const matchesKeywords =
      terms.keywords.length === 0 ||
      terms.keywords.every((keyword) => keywordTarget.includes(keyword))
    const matchesTags =
      terms.tagTerms.length === 0 ||
      terms.tagTerms.every((tagTerm) => normalizedTags.some((tag) => tag.includes(tagTerm)))

    return matchesKeywords && matchesTags
  })
}

const filteredSelectedPosts = computed(() => {
  const group = selectedGroup.value

  if (!group) {
    return []
  }

  const basePosts = isSearchActive.value ? copy.value.posts : group.posts
  const searchedPosts = filterPostsBySearchTerms(basePosts, searchTerms.value)

  if (isSearchActive.value) {
    return searchedPosts
  }

  if (group.key !== 'retrospective') {
    return searchedPosts
  }

  const project = selectedProject.value

  if (!project) {
    return []
  }

  return searchedPosts.filter((post) => isRetrospectiveLinkedToProject(post, project.title))
})

const canRenderPostList = computed(
  () => isSearchActive.value || selectedGroup.value?.key !== 'retrospective' || Boolean(selectedProject.value),
)

const emptyStateLabel = computed(() => {
  if (isSearchActive.value) {
    return searchNoResult.value
  }

  if (copy.value.posts.length === 0) {
    return noPostsLabel.value
  }

  if (selectedCategory.value !== 'retrospective') {
    return searchNoResult.value
  }

  if (!selectedProject.value) {
    return retrospectiveUnselectedLabel.value
  }

  return retrospectiveEmptyLabel.value
})

const activeSectionTitle = computed(() =>
  isSearchActive.value ? searchResultTitle.value : (selectedGroup.value?.title ?? ''),
)
const activeSectionDescription = computed(() =>
  isSearchActive.value ? searchResultDescription.value : (selectedGroup.value?.description ?? ''),
)

const findBestCategoryByTag = (tag: string): BlogCategoryKey | null => {
  const parsed = parseSearchTerms(tag)
  const normalizedTag = parsed.tagTerms[0]

  if (!normalizedTag) {
    return null
  }

  const categoryCount = new Map<BlogCategoryKey, number>()

  BLOG_CATEGORY_KEYS.forEach((key) => {
    categoryCount.set(key, 0)
  })

  copy.value.posts.forEach((post) => {
    const hasMatchingTag = post.tags.some((postTag) =>
      postTag.toLocaleLowerCase().includes(normalizedTag),
    )

    if (!hasMatchingTag) {
      return
    }

    const currentCount = categoryCount.get(post.category) ?? 0
    categoryCount.set(post.category, currentCount + 1)
  })

  const ranked = [...categoryCount.entries()].sort((a, b) => b[1] - a[1])
  const best = ranked[0]

  if (!best || best[1] === 0) {
    return null
  }

  return best[0]
}

type BlogPostAdminDraft = {
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

const getAdminValidationMessage = () =>
  locale.value === 'en'
    ? 'Please fill in required fields: title, markdown.'
    : '필수 항목을 입력해주세요: title, markdown.'

const isBlank = (value: string) => value.trim().length === 0
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
      window.alert(getAdminValidationMessage())
    }

    return
  }

  if (draft.category === 'retrospective' && isBlank(draft.retrospectiveProjectKey)) {
    if (typeof window !== 'undefined') {
      window.alert(locale.value === 'en' ? 'Please select a linked project.' : '회고 글은 연결 프로젝트를 선택해주세요.')
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
      window.alert(locale.value === 'en' ? 'Please select a linked project.' : '회고 글은 연결 프로젝트를 선택해주세요.')
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
      window.alert(locale.value === 'en' ? 'No fields to update.' : '수정할 항목을 입력해주세요.')
    }

    return
  }

  await updatePost(id, payload)
}

const handleDeletePost = async ({ id }: { id: string }) => {
  const targetId = id.trim()

  if (!targetId) {
    return
  }

  const confirmLabel =
    locale.value === 'en'
      ? `Do you want to delete post \"${targetId}\"?`
      : `게시글 \"${targetId}\" 을(를) 삭제하시겠습니까?`

  if (typeof window !== 'undefined' && !window.confirm(confirmLabel)) {
    return
  }

  await removePost(targetId)
}

const scrollToSearchBox = () => {
  if (typeof window === 'undefined') {
    return
  }

  const searchSection = document.getElementById('blog-search')

  if (!searchSection) {
    return
  }

  searchSection.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

watch(
  () => locale.value,
  () => {
    searchQuery.value = ''
    selectedProjectIndex.value = null
  },
)

watch(
  () => projectWorks.value.length,
  (count) => {
    if (count === 0) {
      selectedProjectIndex.value = null
      return
    }

    if (selectedProjectIndex.value !== null && selectedProjectIndex.value > count - 1) {
      selectedProjectIndex.value = null
    }
  },
)

watch(
  () => route.query.category,
  (queryCategory) => {
    const parsedCategory = parseCategoryQuery(queryCategory) ?? defaultCategory

    if (selectedCategory.value !== parsedCategory) {
      selectedCategory.value = parsedCategory
    }
  },
  { immediate: true },
)

watch(
  () => route.query.tag,
  (queryTag) => {
    const parsedTag = parseTagQuery(queryTag)

    if (searchQuery.value !== parsedTag) {
      searchQuery.value = parsedTag
    }

    if (parseCategoryQuery(route.query.category)) {
      return
    }

    const matchedCategory = findBestCategoryByTag(parsedTag)

    if (matchedCategory && selectedCategory.value !== matchedCategory) {
      selectedCategory.value = matchedCategory
    }
  },
  { immediate: true },
)

watch(
  () => isSearchActive.value,
  (isActive, wasActive) => {
    if (!isActive || wasActive) {
      return
    }

    window.requestAnimationFrame(() => {
      scrollToSearchBox()
    })
  },
)

watch(
  [() => locale.value, () => copy.value.posts.map((post) => post.id).join('|')],
  () => {
    void loadPostThumbnails()
  },
  { immediate: true },
)
</script>

<template>
  <div class="mx-auto min-h-screen w-full max-w-[1480px] px-4 pb-20 pt-10 sm:px-8 lg:px-12">
    <main class="space-y-8">
      <header class="focus-fade-in space-y-2">
        <p class="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">{{ copy.kicker }}</p>
        <h1 class="text-3xl font-semibold leading-tight text-zinc-100">{{ copy.heading }}</h1>
        <p class="max-w-[76ch] text-sm leading-7 text-zinc-400">{{ copy.description }}</p>
      </header>

      <BlogPostAdminPanel
        v-if="isAdminPostMode"
        :panel-title="adminPanelTitle"
        :panel-description="adminPanelDescription"
        :id-label="adminIdLabel"
        :title-label="adminTitleLabel"
        :excerpt-label="adminExcerptLabel"
        :category-label="adminCategoryLabel"
        :tags-label="adminTagsLabel"
        :tags-placeholder="adminTagsPlaceholder"
        :retrospective-project-label="adminRetrospectiveProjectLabel"
        :retrospective-project-placeholder="adminRetrospectiveProjectPlaceholder"
        :published-at-label="adminPublishedAtLabel"
        :read-time-label="adminReadTimeLabel"
        :hero-tag-label="adminHeroTagLabel"
        :author-label="adminAuthorLabel"
        :markdown-label="adminMarkdownLabel"
        :markdown-placeholder="adminMarkdownPlaceholder"
        :create-label="adminCreateLabel"
        :update-label="adminUpdateLabel"
        :delete-label="adminDeleteLabel"
        :reset-label="adminResetLabel"
        :is-submitting="isManagingPost"
        :category-options="adminCategoryOptions"
        :retrospective-project-options="retrospectiveProjectOptions"
        :show-id-field="false"
        :show-excerpt-field="false"
        :show-author-field="false"
        :show-published-at-field="false"
        :show-read-time-field="false"
        :show-hero-tag-field="false"
        @create="handleCreatePost"
        @update="handleUpdatePost"
        @delete="handleDeletePost"
      />

      <section id="blog-categories" class="focus-fade-in-delayed rounded-[1.2rem] border border-[#2a2a2a] bg-[#121212dd] p-4 sm:p-5">
        <div class="flex flex-wrap gap-2 border-b border-[#2a2a2a] pb-3">
          <button
            v-for="group in groupedPosts"
            :key="`category-${group.key}`"
            type="button"
            class="rounded-md px-3 py-1.5 text-sm font-medium transition"
            :class="
              selectedCategory === group.key
                ? 'category-pill-active border border-[#5f5544] bg-[#211b12] text-amber-200'
                : 'border border-transparent text-zinc-400 hover:border-[#3a3731] hover:bg-[#171717] hover:text-zinc-100'
            "
            @click="selectCategory(group.key as BlogCategoryKey)"
          >
            {{ group.title }}
          </button>
        </div>

        <section id="blog-search" class="mt-4 space-y-2">
          <label class="text-xs font-medium text-zinc-500" for="blog-search-input">{{ searchLabel }}</label>
          <input
            id="blog-search-input"
            v-model="searchQuery"
            type="search"
            :placeholder="searchPlaceholder"
            class="w-full rounded-lg border border-[#2f2f2f] bg-[#141414] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#5a5a5a] focus:outline-none"
          />
        </section>

        <section
          v-if="selectedGroup"
          :id="isSearchActive ? 'blog-search-results' : selectedGroup.anchor"
          :key="isSearchActive ? 'search-results' : `category-${selectedGroup.key}`"
          class="mt-4 space-y-4"
        >
          <div>
            <p class="text-xs font-medium text-zinc-500">{{ categoryLabel }}</p>
            <h2 class="mt-1 text-2xl font-semibold text-zinc-100">{{ activeSectionTitle }}</h2>
            <p class="mt-1 text-sm text-zinc-400">{{ activeSectionDescription }}</p>
          </div>

          <div v-if="selectedGroup.key === 'retrospective' && !isSearchActive" class="space-y-2">
            <label class="text-xs font-medium text-zinc-500" for="retrospective-project-select">
              {{ projectSelectorLabel }}
            </label>
            <select
              id="retrospective-project-select"
              :value="selectedProjectIndex === null ? '' : String(selectedProjectIndex)"
              class="w-full rounded-lg border border-[#2f2f2f] bg-[#141414] px-3 py-2 text-sm text-zinc-100 focus:border-[#5a5a5a] focus:outline-none"
              @change="handleProjectChange(($event.target as HTMLSelectElement).value)"
            >
              <option value="">{{ projectSelectorPlaceholder }}</option>
              <option
                v-for="(work, workIndex) in projectWorks"
                :key="`retrospective-work-${work.title}`"
                :value="String(workIndex)"
              >
                {{ work.title }}
              </option>
            </select>
          </div>

          <TransitionGroup
            v-if="canRenderPostList && filteredSelectedPosts.length > 0"
            name="blog-post-focus"
            tag="div"
            class="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(320px,1fr))]"
          >
            <article
              v-for="(post, postIndex) in filteredSelectedPosts"
              :key="`post-${post.id}`"
              class="group post-focus-card rounded-xl border border-[#2d2d2d] bg-[#111111] p-4 transition hover:-translate-y-[2px] hover:border-[#5f5544] hover:bg-[#161513]"
              :style="{ animationDelay: getCardAnimationDelay(postIndex) }"
            >
              <RouterLink :to="buildPostPath(post.id)" class="block">
                <div
                  v-if="postThumbnailById[post.id]"
                  class="mb-3 overflow-hidden rounded-lg border border-[#2f2f2f] bg-[#161616]"
                >
                  <img
                    :src="postThumbnailById[post.id]"
                    :alt="`${post.title} 썸네일`"
                    class="h-36 w-full object-cover"
                    loading="lazy"
                  />
                </div>

                <h3 class="line-clamp-2 text-base font-semibold text-zinc-100">{{ post.title }}</h3>
                <p class="mt-1 line-clamp-2 text-sm text-zinc-400">{{ post.excerpt }}</p>

                <div class="mt-3 flex items-center justify-between gap-2 text-xs">
                  <span class="rounded-full border border-[#343434] px-2 py-0.5 text-zinc-300">
                    {{ categoryTitle(post.category) }}
                  </span>
                  <span class="text-zinc-500">{{ post.publishedAt }}</span>
                </div>

                <p class="mt-2 text-xs text-zinc-500">
                  {{ post.readTime }} · {{ viewLabel }} {{ getViewCount(post.id).toLocaleString() }}
                </p>

                <div class="mt-2 flex flex-wrap gap-2">
                  <span
                    v-for="tag in post.tags"
                    :key="`${post.id}-${tag}`"
                    class="rounded-full border border-[#343434] bg-[#161616] px-2 py-0.5 text-[11px] text-zinc-300"
                  >
                    #{{ normalizeTagLabel(tag) }}
                  </span>
                </div>
              </RouterLink>
            </article>
          </TransitionGroup>

          <div
            v-else
            class="rounded-lg border border-[#2a2a2a] bg-[#0f0f0f] px-3 py-4 text-center text-sm text-zinc-500"
          >
            {{ emptyStateLabel }}
          </div>
        </section>
      </section>
    </main>
  </div>
</template>

<style scoped>
.focus-fade-in {
  animation: focusFadeUp 420ms cubic-bezier(0.22, 0.8, 0.2, 1) both;
}

.focus-fade-in-delayed {
  animation: focusFadeUp 520ms cubic-bezier(0.22, 0.8, 0.2, 1) both;
  animation-delay: 70ms;
}

.category-pill-active {
  animation: focusPill 300ms ease-out;
}

.post-focus-card {
  animation: focusCardIn 420ms cubic-bezier(0.22, 0.8, 0.2, 1) both;
}

.blog-post-focus-enter-active,
.blog-post-focus-leave-active {
  transition: opacity 220ms ease, transform 260ms cubic-bezier(0.22, 0.8, 0.2, 1);
}

.blog-post-focus-enter-from,
.blog-post-focus-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.993);
}

@keyframes focusFadeUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes focusCardIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes focusPill {
  0% {
    box-shadow: 0 0 0 0 rgba(245, 200, 126, 0.26);
  }
  100% {
    box-shadow: 0 0 0 10px rgba(245, 200, 126, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .focus-fade-in,
  .focus-fade-in-delayed,
  .category-pill-active,
  .post-focus-card {
    animation: none;
  }

  .blog-post-focus-enter-active,
  .blog-post-focus-leave-active {
    transition-duration: 1ms;
  }
}
</style>
