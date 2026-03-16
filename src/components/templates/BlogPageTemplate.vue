<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  BLOG_CATEGORY_KEYS,
  getMockBlogPostDetail,
  type BlogCategoryKey,
  type BlogPost,
  type PopularPost,
} from '@/data/blog/content'
import { worksByLocale } from '@/data/portfolio/works'
import { useBlogContent } from '@/composables/useBlogContent'
import { useLocale } from '@/composables/useLocale'
import { fetchBlogPostDetail } from '@/services/blogApi'
import { isBlogApiEnabled } from '@/services/blogApiConfig'
import { getEstimatedViewCount } from '@/utils/blogViews'
import BlogPostAdminPanel from '@/components/organisms/BlogPostAdminPanel.vue'

const { locale, projectPath } = useLocale()
const route = useRoute()
const router = useRouter()
const { copy, dataSource, isManagingPost, createPost, updatePost, removePost } = useBlogContent(locale)

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
const retrospectiveUnselectedLabel = computed(() =>
  locale.value === 'en'
    ? 'Click a project box to open the project page and read linked retrospectives inside it.'
    : '프로젝트 박스를 클릭하면 프로젝트 페이지로 이동해 안에서 연결된 회고를 볼 수 있습니다.',
)
const retrospectiveEmptyLabel = computed(() =>
  locale.value === 'en'
    ? 'No retrospective content is linked yet.'
    : '연결된 회고 콘텐츠가 아직 없습니다.',
)
const projectArchiveCtaLabel = computed(() =>
  locale.value === 'en' ? 'Open project and read retrospectives' : '프로젝트로 들어가 회고 보기',
)
const projectArchiveEmptyLabel = computed(() =>
  locale.value === 'en' ? 'No projects are available yet.' : '둘러볼 프로젝트가 아직 없습니다.',
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
const totalCountLabel = computed(() => (locale.value === 'en' ? 'Total Archive' : '전체 아카이브'))
const totalCountDescription = computed(() =>
  locale.value === 'en'
    ? 'Published notes are collected in one continuous stream.'
    : '발행한 글을 하나의 흐름으로 모아두었습니다.',
)
const activeCountLabel = computed(() => (locale.value === 'en' ? 'Visible Now' : '현재 보기'))
const activeCountDescription = computed(() => {
  if (isSearchActive.value) {
    return locale.value === 'en'
      ? 'Search is applied across every category at once.'
      : '검색 결과가 전체 카테고리에 동시에 적용됩니다.'
  }

  if (selectedGroup.value?.key === 'retrospective') {
    return locale.value === 'en'
      ? 'Project boxes open the project page where linked retrospectives are collected.'
      : '프로젝트 박스를 누르면 프로젝트 페이지 안에서 연결된 회고를 모아 볼 수 있습니다.'
  }

  return locale.value === 'en'
    ? 'The feed is focused on the currently selected topic.'
    : '선택한 토픽을 기준으로 피드를 정리했습니다.'
})
const searchGuideLabel = computed(() => (locale.value === 'en' ? 'Search Guide' : '검색 가이드'))
const searchGuideText = computed(() =>
  locale.value === 'en'
    ? 'Use #tag or chain multiple tags like #vue #typescript.'
    : '#태그 검색 또는 #vue #typescript처럼 복수 태그를 함께 사용할 수 있습니다.',
)
const clearSearchLabel = computed(() => (locale.value === 'en' ? 'Clear' : '지우기'))
const projectFilterTitle = computed(() => (locale.value === 'en' ? 'Project Filter' : '프로젝트 필터'))
const filterCardTitle = computed(() => (locale.value === 'en' ? 'Current Filter' : '현재 필터'))
const featuredLabel = computed(() => (locale.value === 'en' ? 'Featured Story' : '대표 글'))
const featureFallbackLabel = computed(() =>
  locale.value === 'en' ? 'No featured post yet.' : '대표 글이 아직 없습니다.',
)
const featureFallbackDescription = computed(() =>
  locale.value === 'en'
    ? 'Once posts are published, this slot will highlight a lead story.'
    : '글이 발행되면 이 영역에 대표 글을 우선 배치합니다.',
)
const trendRailTitle = computed(() => (locale.value === 'en' ? 'Trending This Week' : '이번 주 트렌딩'))
const trendRailDescription = computed(() =>
  locale.value === 'en'
    ? 'A compact side rail inspired by editorial tech blogs and feed products.'
    : '편집형 기술 블로그와 피드 서비스의 트렌딩 레일을 섞은 구성입니다.',
)
const archiveTitle = computed(() => (locale.value === 'en' ? 'Browse by Topic' : '토픽별 둘러보기'))
const currentTopicLabel = computed(() => (locale.value === 'en' ? 'Topic In Focus' : '현재 토픽'))

const buildPostPath = (id: string) => `${locale.value === 'en' ? '/en' : '/ko'}/blog/${id}`
const buildProjectDetailPath = (projectIndex: number) => ({
  path: projectPath.value,
  query: {
    project: String(projectIndex),
  },
  hash: '#project-detail',
})

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

const getThumbnailFromMockDetail = (postId: string) => {
  const detail = getMockBlogPostDetail(locale.value, postId)

  if (!detail?.images || detail.images.length === 0) {
    return null
  }

  for (const image of detail.images) {
    const src = sanitizeImageUrl(image.src)

    if (src) {
      return src
    }
  }

  return null
}

const loadPostThumbnails = async () => {
  const requestToken = ++thumbnailLoadToken
  const postIds = copy.value.posts.map((post) => post.id)
  const nextThumbnailById: Record<string, string> = {}

  if (dataSource.value === 'api' && isBlogApiEnabled() && postIds.length > 0) {
    const thumbnailResults = await Promise.all(
      postIds.map(async (postId) => {
        try {
          const detail = await fetchBlogPostDetail(locale.value, postId)

          if (!detail?.images || detail.images.length === 0) {
            return [postId, getThumbnailFromMockDetail(postId)] as const
          }

          for (const image of detail.images) {
            const src = sanitizeImageUrl(image.src)

            if (src) {
              return [postId, src] as const
            }
          }

          return [postId, getThumbnailFromMockDetail(postId)] as const
        } catch {
          return [postId, getThumbnailFromMockDetail(postId)] as const
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
  } else {
    postIds.forEach((postId) => {
      const thumbnailSrc = getThumbnailFromMockDetail(postId)

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

const projectWorks = computed(() => worksByLocale[locale.value])

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

const clearSearch = () => {
  searchQuery.value = ''

  if (!('tag' in route.query)) {
    return
  }

  const nextQuery = { ...route.query }
  delete nextQuery.tag

  void router.replace({
    path: route.path,
    query: nextQuery,
    hash: route.hash || '#blog-search',
  })
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

  return searchedPosts
})

const shouldShowRetrospectiveProjectArchive = computed(
  () => !isSearchActive.value && selectedGroup.value?.key === 'retrospective',
)
const canRenderPostList = computed(() => !shouldShowRetrospectiveProjectArchive.value)

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

  return retrospectiveEmptyLabel.value
})

const activeSectionTitle = computed(() =>
  isSearchActive.value ? searchResultTitle.value : (selectedGroup.value?.title ?? ''),
)
const activeSectionDescription = computed(() => {
  if (isSearchActive.value) {
    return searchResultDescription.value
  }

  if (selectedGroup.value?.key === 'tech') {
    return ''
  }

  return selectedGroup.value?.description ?? ''
})
const totalPostCount = computed(() => copy.value.posts.length)
const visiblePostCount = computed(() =>
  shouldShowRetrospectiveProjectArchive.value
    ? projectWorks.value.length
    : (canRenderPostList.value ? filteredSelectedPosts.value.length : 0),
)
const filterTokens = computed(() => {
  return [
    ...searchTerms.value.keywords,
    ...searchTerms.value.tagTerms.map((tag) => `#${tag}`),
  ]
})

const heroFeatureSource = computed<PopularPost | null>(() => copy.value.popularPosts[0] ?? null)
const heroFeaturePost = computed<BlogPost | null>(() => {
  const source = heroFeatureSource.value

  if (source) {
    return copy.value.posts.find((post) => post.id === source.id) ?? source
  }

  return copy.value.posts[0] ?? null
})
const heroFeatureTag = computed(() =>
  heroFeatureSource.value?.heroTag ?? (locale.value === 'en' ? 'Editor Pick' : '에디터 픽'),
)
const heroFeatureHighlight = computed(() =>
  heroFeatureSource.value?.highlight ??
  (locale.value === 'en'
    ? 'A lead note displayed like a magazine cover story.'
    : '매거진 커버처럼 먼저 노출하는 대표 노트입니다.'),
)
const heroFeatureBackground = computed(
  () =>
    heroFeatureSource.value?.bannerBackground ??
    'linear-gradient(135deg, #0f1726 0%, #1d3049 56%, #6f8fce 100%)',
)

type TrendRailPost = BlogPost & Partial<Pick<PopularPost, 'heroTag'>>

const trendRailPosts = computed<TrendRailPost[]>(() => {
  const collected: TrendRailPost[] = []
  const seen = new Set<string>()

  copy.value.popularPosts.forEach((post) => {
    if (seen.has(post.id)) {
      return
    }

    collected.push(post)
    seen.add(post.id)
  })

  copy.value.posts.forEach((post) => {
    if (seen.has(post.id)) {
      return
    }

    collected.push(post)
    seen.add(post.id)
  })

  return collected.slice(0, 5)
})

const getTrendPostLabel = (post: TrendRailPost) => {
  const heroTag = post.heroTag?.trim()

  if (heroTag) {
    return heroTag
  }

  return categoryTitle(post.category)
}

const sectionLeadPost = computed<BlogPost | null>(() =>
  canRenderPostList.value ? (filteredSelectedPosts.value[0] ?? null) : null,
)
const sectionGridPosts = computed(() =>
  sectionLeadPost.value ? filteredSelectedPosts.value.slice(1) : filteredSelectedPosts.value,
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
  [() => locale.value, () => dataSource.value, () => copy.value.posts.map((post) => post.id).join('|')],
  () => {
    void loadPostThumbnails()
  },
  { immediate: true },
)
</script>

<template>
  <div class="mx-auto min-h-screen w-full max-w-[1560px] px-4 pb-24 pt-8 sm:px-8 lg:px-12">
    <main class="space-y-8">
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

      <section class="blog-editorial-shell focus-fade-in">
        <div class="blog-editorial-grid">
          <div class="space-y-6">
            <div class="flex flex-wrap items-center gap-2.5">
              <button
                v-for="group in groupedPosts"
                :key="`hero-category-${group.key}`"
                type="button"
                class="inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition"
                :class="
                  selectedCategory === group.key
                    ? 'border-[#6f8fce80] bg-[#6f8fce1f] text-[#dde6f5] shadow-[0_12px_24px_rgba(111,143,206,0.18)]'
                    : 'border-[#253142] bg-[#101827cc] text-[#b4c0d3] hover:border-[#6f8fce66] hover:bg-[#13203a]'
                "
                @click="selectCategory(group.key)"
              >
                <span>{{ group.title }}</span>
                <span
                  class="rounded-full px-2 py-0.5 text-[11px]"
                  :class="
                    selectedCategory === group.key
                      ? 'bg-[#0f1726] text-[#dde6f5]'
                      : 'bg-[#162131] text-[#7e8fa8]'
                  "
                >
                  {{ group.posts.length }}
                </span>
              </button>

              <span
                v-if="isSearchActive"
                class="inline-flex items-center rounded-full border border-[#6f8fce66] bg-[#101827] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#9ab4ea]"
              >
                {{ locale === 'en' ? 'Filtered Feed' : '필터 적용중' }}
              </span>
            </div>

            <header class="space-y-4">
              <p class="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#8fa6c9]">
                {{ copy.kicker }}
              </p>
              <div class="space-y-4">
                <h1
                  class="max-w-[12ch] text-[clamp(2.2rem,5.8vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-[#dde6f5]"
                >
                  {{ copy.heading }}
                </h1>
              </div>
            </header>

            <div class="blog-stat-grid">
              <article class="paper-card blog-stat-card">
                <p class="paper-stat-kicker">{{ totalCountLabel }}</p>
                <p class="paper-stat-value">{{ totalPostCount }}</p>
                <p class="paper-stat-copy">{{ totalCountDescription }}</p>
              </article>

              <article class="paper-card blog-stat-card">
                <p class="paper-stat-kicker">{{ activeCountLabel }}</p>
                <p class="paper-stat-value">{{ visiblePostCount }}</p>
                <p class="paper-stat-copy">{{ activeCountDescription }}</p>
              </article>
            </div>

            <div
              id="blog-search"
              class="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(250px,320px)]"
            >
              <label class="paper-card flex items-start gap-3 px-4 py-4 sm:px-5" for="blog-search-input">
                <span
                  class="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#0f1726] text-[#8fa6c9]"
                >
                  <svg
                    class="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M11 18C14.866 18 18 14.866 18 11C18 7.13401 14.866 4 11 4C7.13401 4 4 7.13401 4 11C4 14.866 7.13401 18 11 18Z"
                      stroke="currentColor"
                      stroke-width="1.8"
                    />
                    <path
                      d="M20 20L16.65 16.65"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                    />
                  </svg>
                </span>

                <div class="min-w-0 flex-1">
                  <span class="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7e8fa8]">
                    {{ searchLabel }}
                  </span>
                  <input
                    id="blog-search-input"
                    v-model="searchQuery"
                    type="search"
                    :placeholder="searchPlaceholder"
                    class="mt-2 w-full border-0 bg-transparent px-0 text-[15px] font-medium text-[#dde6f5] placeholder:text-[#6d7d95] focus:outline-none"
                  />
                  <p class="mt-2 text-xs leading-5 text-[#7e8fa8]">{{ searchGuideText }}</p>
                </div>

                <button
                  v-if="searchQuery"
                  type="button"
                  class="rounded-full border border-[#253142] bg-[#0f1726] px-3 py-1.5 text-xs font-semibold text-[#b4c0d3] transition hover:border-[#6f8fce66] hover:text-[#dde6f5]"
                  @click.prevent="clearSearch"
                >
                  {{ clearSearchLabel }}
                </button>
              </label>

              <section
                v-if="selectedGroup?.key === 'retrospective' && !isSearchActive"
                class="paper-card px-4 py-4 sm:px-5"
              >
                <p class="paper-stat-kicker">{{ projectFilterTitle }}</p>
                <h2 class="mt-2 text-lg font-semibold text-[#dde6f5]">{{ projectSelectorLabel }}</h2>
                <p class="mt-1 text-sm leading-6 text-[#b4c0d3]">{{ retrospectiveUnselectedLabel }}</p>
                <div v-if="projectWorks.length > 0" class="mt-4 grid gap-2">
                  <RouterLink
                    v-for="(work, workIndex) in projectWorks"
                    :key="`retrospective-work-${work.title}`"
                    :to="buildProjectDetailPath(workIndex)"
                    class="project-archive-shortcut"
                  >
                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-[#dde6f5]">{{ work.title }}</p>
                      <p class="mt-1 line-clamp-2 text-xs leading-5 text-[#7e8fa8]">
                        {{ work.summary }}
                      </p>
                    </div>
                    <span class="project-archive-shortcut-arrow">↗</span>
                  </RouterLink>
                </div>
                <p v-else class="mt-4 text-sm text-[#7e8fa8]">{{ projectArchiveEmptyLabel }}</p>
              </section>

              <section v-else class="paper-card px-4 py-4 sm:px-5">
                <p class="paper-stat-kicker">{{ filterCardTitle }}</p>
                <h2 class="mt-2 text-lg font-semibold text-[#dde6f5]">
                  {{ isSearchActive ? searchResultTitle : currentTopicLabel }}
                </h2>
                <p v-if="activeSectionDescription" class="mt-1 text-sm leading-6 text-[#b4c0d3]">
                  {{ isSearchActive ? searchResultDescription : activeSectionDescription }}
                </p>
                <div class="mt-4 flex flex-wrap gap-2">
                  <span v-if="filterTokens.length === 0" class="filter-chip filter-chip-muted">
                    {{ selectedGroup?.title }}
                  </span>
                  <span v-for="token in filterTokens" :key="`active-token-${token}`" class="filter-chip">
                    {{ token }}
                  </span>
                </div>
              </section>
            </div>
          </div>

          <div class="space-y-4">
            <article v-if="heroFeaturePost" class="feature-story-card">
              <RouterLink :to="buildPostPath(heroFeaturePost.id)" class="block">
                <div class="feature-story-visual" :style="{ background: heroFeatureBackground }">
                  <img
                    v-if="postThumbnailById[heroFeaturePost.id]"
                    :src="postThumbnailById[heroFeaturePost.id]"
                    :alt="`${heroFeaturePost.title} 썸네일`"
                    loading="lazy"
                  />
                  <div class="feature-story-veil"></div>

                  <div class="relative flex items-center justify-between gap-3">
                    <span class="feature-story-pill">{{ heroFeatureTag }}</span>
                    <span class="feature-story-note">{{ featuredLabel }}</span>
                  </div>

                  <div class="relative mt-auto">
                    <p class="feature-story-meta">
                      {{ heroFeaturePost.publishedAt }} · {{ heroFeaturePost.readTime }}
                    </p>
                    <h2 class="mt-3 text-2xl font-semibold leading-snug text-white sm:text-[2rem]">
                      {{ heroFeaturePost.title }}
                    </h2>
                    <p class="mt-3 max-w-[42ch] text-sm leading-6 text-[#dde6f5] sm:text-[15px]">
                      {{ heroFeatureHighlight }}
                    </p>
                  </div>
                </div>

                <div class="feature-story-body">
                  <p class="text-sm leading-6 text-[#b4c0d3]">{{ heroFeaturePost.excerpt }}</p>
                  <div class="mt-4 flex flex-wrap items-center gap-2.5 text-xs text-[#7e8fa8]">
                    <span class="topic-chip">{{ categoryTitle(heroFeaturePost.category) }}</span>
                    <span>{{ viewLabel }} {{ getViewCount(heroFeaturePost.id).toLocaleString() }}</span>
                    <span v-if="heroFeaturePost.tags[0]" class="font-semibold text-[#9ab4ea]">
                      #{{ normalizeTagLabel(heroFeaturePost.tags[0]) }}
                    </span>
                  </div>
                </div>
              </RouterLink>
            </article>

            <div v-else class="paper-card px-5 py-6">
              <p class="paper-stat-kicker">{{ featuredLabel }}</p>
              <h2 class="mt-2 text-xl font-semibold text-[#dde6f5]">{{ featureFallbackLabel }}</h2>
              <p class="mt-2 text-sm leading-6 text-[#b4c0d3]">{{ featureFallbackDescription }}</p>
            </div>
          </div>
        </div>
      </section>

      <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section id="blog-categories" class="paper-panel focus-fade-in-delayed">
          <div
            v-if="selectedGroup"
            :id="isSearchActive ? 'blog-search-results' : selectedGroup.anchor"
            :key="isSearchActive ? 'search-results' : `category-${selectedGroup.key}`"
            class="space-y-6"
          >
            <div
              class="flex flex-col gap-4 border-b border-[#253142] pb-5 lg:flex-row lg:items-end lg:justify-between"
            >
              <div>
                <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7e8fa8]">
                  {{ categoryLabel }}
                </p>
                <h2
                  class="mt-2 text-[clamp(1.6rem,3vw,2.4rem)] font-semibold tracking-[-0.03em] text-[#dde6f5]"
                >
                  {{ activeSectionTitle }}
                </h2>
                <p v-if="activeSectionDescription" class="mt-2 max-w-[60ch] text-sm leading-6 text-[#b4c0d3]">
                  {{ activeSectionDescription }}
                </p>
              </div>

              <div class="flex flex-wrap items-center gap-2">
                <span class="summary-chip">{{ activeCountLabel }} {{ visiblePostCount }}</span>
                <span class="summary-chip">{{ currentTopicLabel }} {{ selectedGroup.title }}</span>
              </div>
            </div>

            <div v-if="shouldShowRetrospectiveProjectArchive" class="grid gap-4 md:grid-cols-2">
              <RouterLink
                v-for="(work, workIndex) in projectWorks"
                :key="`retrospective-entry-${work.title}`"
                :to="buildProjectDetailPath(workIndex)"
                class="project-archive-card"
              >
                <div class="project-archive-card-media">
                  <img
                    v-if="work.imageSrc"
                    :src="work.imageSrc"
                    :alt="work.imageAlt ?? work.title"
                    class="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div v-else class="project-archive-card-placeholder">{{ work.title }}</div>
                </div>

                <div class="mt-4 flex flex-wrap items-center gap-2">
                  <span class="topic-chip topic-chip-accent">{{ projectSelectorLabel }}</span>
                  <span class="text-xs text-[#7e8fa8]">{{ copy.categories.retrospective.title }}</span>
                </div>

                <h3 class="mt-3 text-[1.12rem] font-semibold leading-7 text-[#dde6f5]">
                  {{ work.title }}
                </h3>
                <p class="mt-2 text-sm leading-6 text-[#b4c0d3]">{{ work.summary }}</p>
                <p class="mt-2 text-sm font-medium text-[#9ab4ea]">{{ work.impact }}</p>

                <div class="mt-4 flex flex-wrap gap-2">
                  <span
                    v-for="item in work.stack.slice(0, 4)"
                    :key="`${work.title}-${item}`"
                    class="filter-chip"
                  >
                    {{ item }}
                  </span>
                </div>

                <p class="mt-auto pt-5 text-xs font-semibold uppercase tracking-[0.14em] text-[#9ab4ea]">
                  {{ projectArchiveCtaLabel }}
                </p>
              </RouterLink>
            </div>

            <div v-else-if="canRenderPostList && filteredSelectedPosts.length > 0" class="space-y-5">
              <RouterLink v-if="sectionLeadPost" :to="buildPostPath(sectionLeadPost.id)" class="lead-story-card">
                <div
                  class="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)] lg:items-stretch"
                >
                  <div class="space-y-4">
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="topic-chip topic-chip-accent">
                        {{ categoryTitle(sectionLeadPost.category) }}
                      </span>
                      <span class="text-xs text-[#7e8fa8]">{{ sectionLeadPost.publishedAt }}</span>
                      <span class="text-xs text-[#7e8fa8]">{{ sectionLeadPost.readTime }}</span>
                    </div>

                    <div class="space-y-3">
                      <h3
                        class="text-[clamp(1.45rem,2.6vw,2.3rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-[#dde6f5]"
                      >
                        {{ sectionLeadPost.title }}
                      </h3>
                      <p class="text-sm leading-7 text-[#b4c0d3] sm:text-[15px]">
                        {{ sectionLeadPost.excerpt }}
                      </p>
                    </div>

                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="tag in sectionLeadPost.tags"
                        :key="`${sectionLeadPost.id}-${tag}`"
                        class="filter-chip"
                      >
                        #{{ normalizeTagLabel(tag) }}
                      </span>
                    </div>

                    <div class="flex flex-wrap items-center gap-3 text-xs text-[#7e8fa8]">
                      <span>{{ viewLabel }} {{ getViewCount(sectionLeadPost.id).toLocaleString() }}</span>
                      <span class="font-semibold uppercase tracking-[0.14em] text-[#9ab4ea]">
                        {{ copy.readLabel }}
                      </span>
                    </div>
                  </div>

                  <div class="lead-story-visual">
                    <img
                      v-if="postThumbnailById[sectionLeadPost.id]"
                      :src="postThumbnailById[sectionLeadPost.id]"
                      :alt="`${sectionLeadPost.title} 썸네일`"
                      class="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div v-else class="lead-story-placeholder">
                      <span>{{ sectionLeadPost.tags[0] ? `#${normalizeTagLabel(sectionLeadPost.tags[0])}` : 'BLOG' }}</span>
                    </div>
                  </div>
                </div>
              </RouterLink>

              <TransitionGroup
                v-if="sectionGridPosts.length > 0"
                name="blog-post-focus"
                tag="div"
                class="grid gap-4 md:grid-cols-2"
              >
                <article
                  v-for="(post, postIndex) in sectionGridPosts"
                  :key="`post-${post.id}`"
                  class="post-focus-card feed-article-card"
                  :style="{ animationDelay: getCardAnimationDelay(postIndex + 1) }"
                >
                  <RouterLink :to="buildPostPath(post.id)" class="flex h-full flex-col">
                    <div v-if="postThumbnailById[post.id]" class="feed-article-media">
                      <img
                        :src="postThumbnailById[post.id]"
                        :alt="`${post.title} 썸네일`"
                        class="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    <div class="flex flex-1 flex-col">
                      <div
                        class="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7e8fa8]"
                      >
                        <span>{{ categoryTitle(post.category) }}</span>
                        <span class="h-1 w-1 rounded-full bg-[#33445c]"></span>
                        <span>{{ post.publishedAt }}</span>
                      </div>

                      <h3 class="mt-3 line-clamp-2 text-[1.08rem] font-semibold leading-7 text-[#dde6f5]">
                        {{ post.title }}
                      </h3>
                      <p class="mt-2 line-clamp-3 text-sm leading-6 text-[#b4c0d3]">{{ post.excerpt }}</p>

                      <div class="mt-4 flex flex-wrap gap-2">
                        <span v-for="tag in post.tags" :key="`${post.id}-${tag}`" class="filter-chip">
                          #{{ normalizeTagLabel(tag) }}
                        </span>
                      </div>

                      <p class="mt-auto pt-4 text-xs text-[#7e8fa8]">
                        {{ post.readTime }} · {{ viewLabel }} {{ getViewCount(post.id).toLocaleString() }}
                      </p>
                    </div>
                  </RouterLink>
                </article>
              </TransitionGroup>
            </div>

            <div
              v-else
              class="rounded-[1.5rem] border border-dashed border-[#253142] bg-[#101827] px-6 py-10 text-center"
            >
              <p class="text-sm font-medium text-[#dde6f5]">{{ emptyStateLabel }}</p>
              <p class="mt-2 text-xs leading-6 text-[#7e8fa8]">
                {{
                  selectedGroup.key === 'retrospective' && !isSearchActive
                    ? projectArchiveEmptyLabel
                    : searchGuideText
                }}
              </p>
            </div>
          </div>
        </section>

        <aside class="space-y-4">
          <section class="paper-card px-5 py-5">
            <p class="paper-stat-kicker">{{ trendRailTitle }}</p>
            <p class="mt-2 text-sm leading-6 text-[#b4c0d3]">{{ trendRailDescription }}</p>

            <ol v-if="trendRailPosts.length > 0" class="mt-4 space-y-3">
              <li v-for="(post, index) in trendRailPosts" :key="`trend-post-${post.id}`">
                <RouterLink :to="buildPostPath(post.id)" class="trend-link">
                  <span class="trend-rank">{{ String(index + 1).padStart(2, '0') }}</span>
                  <div class="min-w-0">
                    <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7e8fa8]">
                      {{ getTrendPostLabel(post) }}
                    </p>
                    <p class="mt-1 line-clamp-2 text-sm font-semibold leading-6 text-[#dde6f5]">
                      {{ post.title }}
                    </p>
                    <p class="mt-1 text-xs text-[#7e8fa8]">{{ post.publishedAt }} · {{ post.readTime }}</p>
                  </div>
                </RouterLink>
              </li>
            </ol>

            <p v-else class="mt-4 text-sm text-[#7e8fa8]">{{ noPostsLabel }}</p>
          </section>

          <section class="paper-card px-5 py-5">
            <p class="paper-stat-kicker">{{ archiveTitle }}</p>
            <div class="mt-4 space-y-2">
              <button
                v-for="group in groupedPosts"
                :key="`archive-button-${group.key}`"
                type="button"
                class="archive-nav-button"
                :class="selectedCategory === group.key ? 'archive-nav-button-active' : ''"
                @click="selectCategory(group.key)"
              >
                <span class="font-semibold">{{ group.title }}</span>
                <span class="text-sm text-[#7e8fa8]">{{ group.posts.length }}</span>
              </button>
            </div>
          </section>

          <section v-if="filterTokens.length > 0" class="paper-card px-5 py-5">
            <p class="paper-stat-kicker">{{ filterCardTitle }}</p>
            <div class="mt-4 flex flex-wrap gap-2">
              <span v-for="token in filterTokens" :key="`side-token-${token}`" class="filter-chip">
                {{ token }}
              </span>
            </div>
          </section>
        </aside>
      </div>
    </main>
  </div>
</template>

<style scoped>
.blog-editorial-shell {
  position: relative;
  overflow: hidden;
  border: 1px solid #253142;
  border-radius: 2rem;
  background:
    radial-gradient(circle at left top, rgba(111, 143, 206, 0.18), transparent 28%),
    radial-gradient(circle at right 20%, rgba(95, 127, 190, 0.16), transparent 24%),
    linear-gradient(180deg, rgba(13, 21, 36, 0.98) 0%, rgba(9, 15, 24, 0.98) 100%);
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.34);
}

.blog-editorial-shell::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, transparent 0%, transparent 49%, rgba(37, 49, 66, 0.42) 49%, transparent 50%),
    linear-gradient(rgba(37, 49, 66, 0.18) 1px, transparent 1px);
  background-size: 100% 100%, 100% 24px;
  opacity: 0.46;
  pointer-events: none;
}

.blog-editorial-grid {
  position: relative;
  display: grid;
  gap: 2rem;
  padding: clamp(1.4rem, 2vw, 2.25rem);
}

.paper-panel {
  border: 1px solid #253142;
  border-radius: 1.75rem;
  background: linear-gradient(180deg, rgba(17, 26, 39, 0.94) 0%, rgba(13, 21, 36, 0.98) 100%);
  padding: clamp(1.25rem, 2vw, 2rem);
  box-shadow: 0 22px 52px rgba(0, 0, 0, 0.22);
}

.paper-card {
  border: 1px solid #253142;
  border-radius: 1.5rem;
  background: linear-gradient(180deg, rgba(17, 26, 39, 0.96) 0%, rgba(15, 23, 38, 0.98) 100%);
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.18);
}

.blog-stat-grid {
  display: grid;
  gap: 0.75rem;
  max-width: 38rem;
}

.blog-stat-card {
  padding: 0.95rem 1rem;
}

.paper-stat-kicker {
  margin: 0;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #7e8fa8;
}

.paper-stat-value {
  margin: 0.4rem 0 0;
  font-size: clamp(1.2rem, 2vw, 1.8rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  color: #dde6f5;
}

.paper-stat-copy {
  margin: 0.35rem 0 0;
  font-size: 0.8rem;
  line-height: 1.55;
  color: #b4c0d3;
}

.feature-story-card {
  overflow: hidden;
  border: 1px solid #253142;
  border-radius: 1.6rem;
  background: linear-gradient(180deg, rgba(17, 26, 39, 0.98) 0%, rgba(15, 23, 38, 0.98) 100%);
  box-shadow: 0 22px 46px rgba(0, 0, 0, 0.22);
}

.feature-story-visual {
  position: relative;
  display: flex;
  min-height: 360px;
  flex-direction: column;
  padding: 1.35rem;
  overflow: hidden;
}

.feature-story-visual img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.32;
}

.feature-story-veil {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(9, 15, 24, 0.16) 0%, rgba(9, 15, 24, 0.78) 100%);
}

.feature-story-pill,
.feature-story-note {
  position: relative;
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.feature-story-pill {
  padding: 0.45rem 0.8rem;
  color: #dde6f5;
  background: rgba(111, 143, 206, 0.14);
  border: 1px solid rgba(111, 143, 206, 0.28);
}

.feature-story-note {
  padding: 0.4rem 0.75rem;
  color: #dde6f5;
  background: rgba(15, 23, 38, 0.76);
  border: 1px solid rgba(255, 255, 255, 0.14);
}

.feature-story-meta {
  margin: 0;
  font-size: 0.74rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(221, 230, 245, 0.82);
}

.feature-story-body {
  padding: 1.35rem;
  border-top: 1px solid #253142;
}

.summary-chip,
.filter-chip,
.topic-chip {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
}

.summary-chip {
  border: 1px solid #253142;
  background: #101827;
  padding: 0.48rem 0.8rem;
  font-size: 0.74rem;
  font-weight: 700;
  color: #b4c0d3;
}

.summary-chip-accent,
.topic-chip-accent {
  border-color: rgba(111, 143, 206, 0.32);
  background: rgba(111, 143, 206, 0.14);
  color: #dde6f5;
}

.filter-chip,
.topic-chip {
  border: 1px solid #253142;
  background: #101827;
  padding: 0.38rem 0.72rem;
  font-size: 0.74rem;
  font-weight: 600;
  color: #b4c0d3;
}

.filter-chip-muted {
  background: rgba(15, 23, 38, 0.72);
  color: #7e8fa8;
}

.lead-story-card {
  display: block;
  border: 1px solid #253142;
  border-radius: 1.6rem;
  background: linear-gradient(135deg, rgba(17, 26, 39, 0.98), rgba(13, 21, 36, 0.96));
  padding: 1.2rem;
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.2);
  transition:
    transform 220ms ease,
    box-shadow 220ms ease,
    border-color 220ms ease;
}

.lead-story-card:hover {
  transform: translateY(-2px);
  border-color: #6f8fce66;
  box-shadow: 0 24px 50px rgba(0, 0, 0, 0.26);
}

.lead-story-visual {
  overflow: hidden;
  border-radius: 1.25rem;
  border: 1px solid #253142;
  background: linear-gradient(135deg, #111a27 0%, #1d3049 100%);
  min-height: 240px;
}

.lead-story-placeholder {
  display: grid;
  place-items: center;
  height: 100%;
  padding: 1.5rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #8fa6c9;
}

.feed-article-card {
  border: 1px solid #253142;
  border-radius: 1.4rem;
  background: rgba(17, 26, 39, 0.96);
  padding: 1rem;
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.16);
  transition:
    transform 220ms ease,
    border-color 220ms ease,
    box-shadow 220ms ease;
}

.feed-article-card:hover {
  transform: translateY(-3px);
  border-color: #6f8fce66;
  box-shadow: 0 24px 44px rgba(0, 0, 0, 0.24);
}

.feed-article-media {
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-radius: 1.05rem;
  border: 1px solid #253142;
  background: #101827;
  margin-bottom: 0.9rem;
}

.trend-link {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.9rem;
  align-items: start;
  transition: transform 180ms ease;
}

.trend-link:hover {
  transform: translateX(2px);
}

.trend-rank {
  display: inline-flex;
  min-width: 2.2rem;
  height: 2.2rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.85rem;
  background: linear-gradient(135deg, rgba(111, 143, 206, 0.3), rgba(95, 127, 190, 0.12));
  color: #dde6f5;
  font-size: 0.78rem;
  font-weight: 700;
}

.archive-nav-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #253142;
  border-radius: 1rem;
  background: rgba(16, 24, 39, 0.82);
  padding: 0.9rem 1rem;
  text-align: left;
  color: #dde6f5;
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    background-color 180ms ease;
}

.archive-nav-button:hover {
  transform: translateY(-1px);
  border-color: #6f8fce66;
  background: #13203a;
}

.archive-nav-button-active {
  border-color: rgba(111, 143, 206, 0.32);
  background: rgba(111, 143, 206, 0.12);
}

.project-archive-shortcut {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.9rem;
  border: 1px solid #253142;
  border-radius: 1.15rem;
  background: rgba(16, 24, 39, 0.9);
  padding: 0.9rem 1rem;
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    background-color 180ms ease;
}

.project-archive-shortcut:hover {
  transform: translateY(-1px);
  border-color: #6f8fce66;
  background: #13203a;
}

.project-archive-shortcut-arrow {
  color: #9ab4ea;
  font-size: 0.95rem;
}

.project-archive-card {
  display: flex;
  min-height: 100%;
  flex-direction: column;
  border: 1px solid #253142;
  border-radius: 1.5rem;
  background: linear-gradient(180deg, rgba(17, 26, 39, 0.98) 0%, rgba(13, 21, 36, 0.98) 100%);
  padding: 1rem;
  box-shadow: 0 16px 38px rgba(0, 0, 0, 0.18);
  transition:
    transform 220ms ease,
    border-color 220ms ease,
    box-shadow 220ms ease;
}

.project-archive-card:hover {
  transform: translateY(-3px);
  border-color: #6f8fce66;
  box-shadow: 0 24px 50px rgba(0, 0, 0, 0.24);
}

.project-archive-card-media {
  overflow: hidden;
  border-radius: 1.15rem;
  border: 1px solid #253142;
  background: linear-gradient(135deg, #111a27 0%, #1d3049 100%);
  aspect-ratio: 16 / 10;
}

.project-archive-card-placeholder {
  display: grid;
  height: 100%;
  place-items: center;
  padding: 1.5rem;
  color: #8fa6c9;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

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
    box-shadow: 0 0 0 0 rgba(111, 143, 206, 0.22);
  }
  100% {
    box-shadow: 0 0 0 12px rgba(111, 143, 206, 0);
  }
}

@media (min-width: 1280px) {
  .blog-editorial-grid {
    grid-template-columns: minmax(0, 1.24fr) 380px;
  }
}

@media (min-width: 640px) {
  .blog-stat-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
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
