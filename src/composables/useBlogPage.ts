import { computed, ref, watch, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  BLOG_CATEGORY_KEYS,
  type BlogCategoryKey,
  type BlogPost,
  type BlogPageCopySet,
} from '@/data/blog/content'
import { worksByLocale } from '@/data/portfolio/works'
import type { Locale } from '@/data/portfolio/types'
import { fetchBlogPostDetail } from '@/services/blogApi'
import { isBlogApiEnabled } from '@/services/blogApiConfig'
import { getEstimatedViewCount } from '@/utils/blogViews'

/* ── helpers ───────────────────────────────────────────── */

const normalizeTagInput = (value: string) =>
  value
    .trim()
    .split(/\s+/)
    .filter((token) => token.length > 0)
    .map((token) => `#${token.replace(/^#+/, '')}`)
    .join(' ')

const parseTagQuery = (value: unknown) => {
  const candidate = Array.isArray(value) ? value[0] : value
  if (typeof candidate !== 'string') return ''
  const trimmed = candidate.trim()
  if (!trimmed) return ''
  return normalizeTagInput(trimmed)
}

const parseCategoryQuery = (value: unknown): BlogCategoryKey | null => {
  const candidate = Array.isArray(value) ? value[0] : value
  if (typeof candidate !== 'string') return null
  if (candidate === 'self-dev') return 'selfDev'
  return BLOG_CATEGORY_KEYS.find((key) => key === candidate) ?? null
}

const normalizeProjectKey = (value: string) => value.trim().toLocaleLowerCase().replace(/\s+/g, '')

const normalizeTagToken = (value: string) => value.trim().replace(/^#+/, '').toLocaleLowerCase()

export const normalizeTagLabel = (value: string) => value.replace(/^#+/, '')

const projectKeywordMap: Record<string, string[]> = {
  hlab: ['hlab', 'docker', 'deploy', 'pipeline', '배포'],
  clue: ['clue', 'portfolio', '포트폴리오', 'planning', 'v1'],
  sizz: ['sizz', 'news', '뉴스'],
}

const categoryAnchorMap: Record<BlogCategoryKey, string> = {
  tech: 'tech',
  retrospective: 'retrospective',
  selfDev: 'self-dev',
}

const defaultCategory: BlogCategoryKey = BLOG_CATEGORY_KEYS[0] ?? 'tech'

/* ── search parser ─────────────────────────────────────── */

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

  return { keywords, tagTerms }
}

const filterPostsBySearchTerms = (
  posts: BlogPost[],
  terms: { keywords: string[]; tagTerms: string[] },
) => {
  if (terms.keywords.length === 0 && terms.tagTerms.length === 0) return posts

  return posts.filter((post) => {
    const title = post.title.toLocaleLowerCase()
    const excerpt = post.excerpt.toLocaleLowerCase()
    const normalizedTags = post.tags.map((tag) => tag.toLocaleLowerCase())
    const keywordTarget = `${title} ${excerpt}`

    const matchesKeywords =
      terms.keywords.length === 0 || terms.keywords.every((kw) => keywordTarget.includes(kw))
    const matchesTags =
      terms.tagTerms.length === 0 ||
      terms.tagTerms.every((tt) => normalizedTags.some((tag) => tag.includes(tt)))

    return matchesKeywords && matchesTags
  })
}

const isRetrospectiveLinkedToProject = (post: BlogPost, projectTitle: string) => {
  const key = normalizeProjectKey(projectTitle)
  const normalizedTags = post.tags.map((tag) => normalizeProjectKey(normalizeTagToken(tag)))
  if (normalizedTags.some((tag) => tag === key)) return true

  const hints = projectKeywordMap[key] ?? []
  const keywords = [...new Set([projectTitle.toLocaleLowerCase(), ...hints])]
  const source = `${post.title} ${post.excerpt} ${post.tags.join(' ')}`.toLocaleLowerCase()

  return keywords.some((keyword) => source.includes(keyword.toLocaleLowerCase()))
}

const sanitizeImageUrl = (raw?: string | null) => {
  if (typeof raw !== 'string') return null
  const value = raw.trim()
  if (!value) return null
  if (value.startsWith('/')) return value
  try {
    const parsed = new URL(value)
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') return parsed.toString()
  } catch {
    return null
  }
  return null
}

/* ── composable ────────────────────────────────────────── */

export const useBlogPage = (
  locale: Readonly<Ref<Locale>>,
  copy: Readonly<Ref<BlogPageCopySet>>,
) => {
  const route = useRoute()
  const router = useRouter()

  /* ── i18n labels ─────────────────────────────────────── */

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

  /* ── search ──────────────────────────────────────────── */

  const searchQuery = ref(parseTagQuery(route.query.tag))
  const searchTerms = computed(() => parseSearchTerms(searchQuery.value))
  const isSearchActive = computed(
    () => searchTerms.value.keywords.length > 0 || searchTerms.value.tagTerms.length > 0,
  )

  /* ── category ────────────────────────────────────────── */

  const selectedCategory = ref<BlogCategoryKey>(
    parseCategoryQuery(route.query.category) ?? defaultCategory,
  )

  const groupedPosts = computed(() =>
    BLOG_CATEGORY_KEYS.map((categoryKey) => ({
      key: categoryKey,
      anchor: categoryAnchorMap[categoryKey],
      title: copy.value.categories[categoryKey].title,
      description: copy.value.categories[categoryKey].description,
      posts: copy.value.posts.filter((post) => post.category === categoryKey),
    })),
  )

  const selectedGroup = computed(
    () => groupedPosts.value.find((g) => g.key === selectedCategory.value) ?? groupedPosts.value[0],
  )

  const updateCategoryQuery = (category: BlogCategoryKey) => {
    if (parseCategoryQuery(route.query.category) === category) return
    void router.replace({
      path: route.path,
      query: { ...route.query, category },
      hash: route.hash || '#blog-categories',
    })
  }

  const selectCategory = (category: BlogCategoryKey) => {
    if (selectedCategory.value === category) return
    selectedCategory.value = category
    updateCategoryQuery(category)
  }

  /* ── retrospective project ───────────────────────────── */

  const selectedProjectIndex = ref<number | null>(null)
  const projectWorks = computed(() => worksByLocale[locale.value])
  const selectedProject = computed(() => {
    const index = selectedProjectIndex.value
    if (index === null || index < 0 || index >= projectWorks.value.length) return null
    return projectWorks.value[index]
  })

  const retrospectiveProjectOptions = computed(() => {
    const uniqueByKey = new Map<string, string>()
    worksByLocale[locale.value].forEach((work) => {
      const key = normalizeProjectKey(work.title)
      if (!key || uniqueByKey.has(key)) return
      uniqueByKey.set(key, work.title)
    })
    return [...uniqueByKey.entries()].map(([key, label]) => ({ key, label }))
  })

  const selectProjectWork = (index: number) => {
    selectedProjectIndex.value = index
  }

  const handleProjectChange = (value: string) => {
    if (!value) {
      selectedProjectIndex.value = null
      return
    }
    const index = Number(value)
    if (Number.isNaN(index)) return
    selectProjectWork(index)
  }

  /* ── filtered posts ──────────────────────────────────── */

  const filteredSelectedPosts = computed(() => {
    const group = selectedGroup.value
    if (!group) return []

    const basePosts = isSearchActive.value ? copy.value.posts : group.posts
    const searchedPosts = filterPostsBySearchTerms(basePosts, searchTerms.value)

    if (isSearchActive.value) return searchedPosts
    if (group.key !== 'retrospective') return searchedPosts

    const project = selectedProject.value
    if (!project) return []

    return searchedPosts.filter((post) => isRetrospectiveLinkedToProject(post, project.title))
  })

  const canRenderPostList = computed(
    () =>
      isSearchActive.value ||
      selectedGroup.value?.key !== 'retrospective' ||
      Boolean(selectedProject.value),
  )

  /* ── empty state ─────────────────────────────────────── */

  const emptyStateLabel = computed(() => {
    if (isSearchActive.value) return searchNoResult.value
    if (copy.value.posts.length === 0) return noPostsLabel.value
    if (selectedCategory.value !== 'retrospective') return searchNoResult.value
    if (!selectedProject.value) return retrospectiveUnselectedLabel.value
    return retrospectiveEmptyLabel.value
  })

  const activeSectionTitle = computed(() =>
    isSearchActive.value ? searchResultTitle.value : (selectedGroup.value?.title ?? ''),
  )
  const activeSectionDescription = computed(() =>
    isSearchActive.value ? searchResultDescription.value : (selectedGroup.value?.description ?? ''),
  )

  /* ── utilities ───────────────────────────────────────── */

  const categoryTitle = (category: BlogCategoryKey) => copy.value.categories[category].title

  const buildPostPath = (id: string) => `${locale.value === 'en' ? '/en' : '/ko'}/blog/${id}`

  const getViewCount = (id: string) => getEstimatedViewCount(id)
  const getCardAnimationDelay = (index: number) => `${Math.min(index, 11) * 45}ms`

  /* ── thumbnails ──────────────────────────────────────── */

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
            if (!detail?.images || detail.images.length === 0) return [postId, null] as const
            for (const image of detail.images) {
              const src = sanitizeImageUrl(image.src)
              if (src) return [postId, src] as const
            }
            return [postId, null] as const
          } catch {
            return [postId, null] as const
          }
        }),
      )
      if (requestToken !== thumbnailLoadToken) return
      thumbnailResults.forEach(([postId, thumbnailSrc]) => {
        if (thumbnailSrc) nextThumbnailById[postId] = thumbnailSrc
      })
    }

    if (requestToken !== thumbnailLoadToken) return
    postThumbnailById.value = nextThumbnailById
  }

  /* ── best category by tag ────────────────────────────── */

  const findBestCategoryByTag = (tag: string): BlogCategoryKey | null => {
    const parsed = parseSearchTerms(tag)
    const normalizedTag = parsed.tagTerms[0]
    if (!normalizedTag) return null

    const categoryCount = new Map<BlogCategoryKey, number>()
    BLOG_CATEGORY_KEYS.forEach((key) => categoryCount.set(key, 0))

    copy.value.posts.forEach((post) => {
      const hasMatch = post.tags.some((t) => t.toLocaleLowerCase().includes(normalizedTag))
      if (!hasMatch) return
      categoryCount.set(post.category, (categoryCount.get(post.category) ?? 0) + 1)
    })

    const ranked = [...categoryCount.entries()].sort((a, b) => b[1] - a[1])
    const best = ranked[0]
    return !best || best[1] === 0 ? null : best[0]
  }

  /* ── scroll ──────────────────────────────────────────── */

  const scrollToSearchBox = () => {
    if (typeof window === 'undefined') return
    const el = document.getElementById('blog-search')
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  /* ── watchers ────────────────────────────────────────── */

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
      const parsed = parseCategoryQuery(queryCategory) ?? defaultCategory
      if (selectedCategory.value !== parsed) selectedCategory.value = parsed
    },
    { immediate: true },
  )

  watch(
    () => route.query.tag,
    (queryTag) => {
      const parsedTag = parseTagQuery(queryTag)
      if (searchQuery.value !== parsedTag) searchQuery.value = parsedTag
      if (parseCategoryQuery(route.query.category)) return
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
      if (!isActive || wasActive) return
      window.requestAnimationFrame(() => scrollToSearchBox())
    },
  )

  watch(
    [() => locale.value, () => copy.value.posts.map((p) => p.id).join('|')],
    () => {
      void loadPostThumbnails()
    },
    { immediate: true },
  )

  return {
    /* labels */
    categoryLabel,
    searchLabel,
    searchPlaceholder,
    viewLabel,
    projectSelectorLabel,
    projectSelectorPlaceholder,
    /* search */
    searchQuery,
    isSearchActive,
    /* category */
    selectedCategory,
    groupedPosts,
    selectedGroup,
    selectCategory,
    /* retrospective */
    selectedProjectIndex,
    projectWorks,
    handleProjectChange,
    retrospectiveProjectOptions,
    /* posts */
    filteredSelectedPosts,
    canRenderPostList,
    postThumbnailById,
    /* display */
    emptyStateLabel,
    activeSectionTitle,
    activeSectionDescription,
    categoryTitle,
    buildPostPath,
    getViewCount,
    getCardAnimationDelay,
  }
}
