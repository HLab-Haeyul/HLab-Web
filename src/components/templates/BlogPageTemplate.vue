<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { BLOG_CATEGORY_KEYS, type BlogCategoryKey, type BlogPost } from '@/data/blog/content'
import { worksByLocale } from '@/data/portfolio/works'
import { useBlogContent } from '@/composables/useBlogContent'
import { useLocale } from '@/composables/useLocale'
import { getEstimatedViewCount } from '@/utils/blogViews'
import BlogCategoryTabs from '@/components/molecules/BlogCategoryTabs.vue'
import BlogPostPreviewCard from '@/components/molecules/BlogPostPreviewCard.vue'
import BlogPopularCarousel from '@/components/organisms/BlogPopularCarousel.vue'
import BlogRetrospectiveSelector from '@/components/organisms/BlogRetrospectiveSelector.vue'
import BlogSearchSyncPanel from '@/components/organisms/BlogSearchSyncPanel.vue'

const AUTO_PLAY_MS = 4500

const { locale } = useLocale()
const route = useRoute()
const router = useRouter()
const { copy, dataSource, isLoading, errorMessage, reload } = useBlogContent(locale)
const activePopularIndex = ref(0)

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
const authorName = computed(() => (locale.value === 'en' ? 'Kim Minjae' : '김민재'))
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
const viewLabel = computed(() => (locale.value === 'en' ? 'Views' : '조회수'))
const projectSelectorLabel = computed(() => (locale.value === 'en' ? 'My Projects' : '내 프로젝트'))
const projectSelectorHint = computed(() =>
  locale.value === 'en'
    ? 'Choose a project to view related retrospectives below.'
    : '프로젝트를 선택하면 아래에 관련 회고 글이 표시됩니다.',
)
const retrospectiveHeadingLabel = computed(() =>
  locale.value === 'en' ? 'Project Retrospectives' : '프로젝트 회고 글',
)
const retrospectiveUnselectedLabel = computed(() =>
  locale.value === 'en'
    ? 'Select a project above to see its retrospectives.'
    : '위에서 프로젝트를 선택하면 회고 글을 볼 수 있습니다.',
)
const retrospectiveEmptyLabel = computed(() =>
  locale.value === 'en'
    ? 'No retrospective post is linked to this project yet.'
    : '선택한 프로젝트에 연결된 회고 글이 아직 없습니다.',
)
const apiStatusLabel = computed(() =>
  dataSource.value === 'api'
    ? locale.value === 'en'
      ? 'API Connected'
      : 'API 연결됨'
    : locale.value === 'en'
      ? 'Fallback Data'
      : 'Fallback 데이터',
)
const reloadLabel = computed(() => (locale.value === 'en' ? 'Reload' : '다시 불러오기'))
const loadingLabel = computed(() => (locale.value === 'en' ? 'Loading...' : '불러오는 중...'))
const buildPostPath = (slug: string) => `${locale.value === 'en' ? '/en' : '/ko'}/blog/${slug}`

const coverPaletteByCategory: Record<BlogCategoryKey, string[]> = {
  tech: [
    'linear-gradient(140deg, rgba(56,56,56,0.95) 0%, rgba(24,24,24,0.94) 58%, rgba(10,10,10,0.95) 100%)',
    'linear-gradient(135deg, rgba(62,62,62,0.95) 0%, rgba(26,26,26,0.94) 53%, rgba(12,12,12,0.95) 100%)',
  ],
  retrospective: [
    'linear-gradient(132deg, rgba(67,67,67,0.95) 0%, rgba(30,30,30,0.94) 56%, rgba(12,12,12,0.95) 100%)',
    'linear-gradient(146deg, rgba(58,58,58,0.95) 0%, rgba(26,26,26,0.94) 52%, rgba(11,11,11,0.95) 100%)',
  ],
  selfDev: [
    'linear-gradient(128deg, rgba(60,60,60,0.95) 0%, rgba(28,28,28,0.94) 50%, rgba(11,11,11,0.95) 100%)',
    'linear-gradient(140deg, rgba(52,52,52,0.95) 0%, rgba(24,24,24,0.94) 55%, rgba(10,10,10,0.95) 100%)',
  ],
}

const getCoverBackground = (category: BlogCategoryKey, index: number) => {
  const palette = coverPaletteByCategory[category]

  return palette[index % palette.length] ?? palette[0] ?? '#1a1a1a'
}

const getEngagement = (slug: string) => {
  const seed = [...slug].reduce((acc, char) => acc + char.charCodeAt(0), 0)

  return {
    likes: 30 + (seed % 220),
    comments: 4 + (seed % 24),
  }
}

const getViewCount = (slug: string) => getEstimatedViewCount(slug)

const selectedProjectIndex = ref<number | null>(null)
const projectWorks = computed(() => worksByLocale[locale.value])
const selectedProject = computed(() => {
  const index = selectedProjectIndex.value

  if (index === null || index < 0 || index >= projectWorks.value.length) {
    return null
  }

  return projectWorks.value[index]
})

const normalizeToken = (value: string) => value.toLocaleLowerCase().replace(/\s+/g, '')

const projectKeywordMap: Record<string, string[]> = {
  hlab: ['hlab', 'docker', 'deploy', 'pipeline', '배포'],
  clue: ['clue', 'portfolio', '포트폴리오', 'planning', 'v1'],
  sizz: ['sizz', 'news', '뉴스'],
}

const isRetrospectiveLinkedToProject = (post: BlogPost, projectTitle: string) => {
  const key = normalizeToken(projectTitle)
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

const filteredSelectedPosts = computed(() => {
  const group = selectedGroup.value

  if (!group) {
    return []
  }

  const { keywords, tagTerms } = parseSearchTerms(searchQuery.value)

  const searchedPosts =
    keywords.length === 0 && tagTerms.length === 0
      ? group.posts
      : group.posts.filter((post) => {
          const title = post.title.toLocaleLowerCase()
          const excerpt = post.excerpt.toLocaleLowerCase()
          const normalizedTags = post.tags.map((tag) => tag.toLocaleLowerCase())
          const keywordTarget = `${title} ${excerpt}`

          const matchesKeywords =
            keywords.length === 0 || keywords.every((keyword) => keywordTarget.includes(keyword))
          const matchesTags =
            tagTerms.length === 0 ||
            tagTerms.every((tagTerm) => normalizedTags.some((tag) => tag.includes(tagTerm)))

          return matchesKeywords && matchesTags
        })

  if (group.key !== 'retrospective') {
    return searchedPosts
  }

  const project = selectedProject.value

  if (!project) {
    return []
  }

  return searchedPosts.filter((post) => isRetrospectiveLinkedToProject(post, project.title))
})

const emptyStateLabel = computed(() => {
  if (selectedCategory.value !== 'retrospective') {
    return searchNoResult.value
  }

  if (!selectedProject.value) {
    return retrospectiveUnselectedLabel.value
  }

  return retrospectiveEmptyLabel.value
})

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

let autoPlayTimer: ReturnType<typeof window.setInterval> | undefined

const nextPopular = () => {
  const count = copy.value.popularPosts.length

  if (count === 0) {
    return
  }

  activePopularIndex.value = (activePopularIndex.value + 1) % count
}

const prevPopular = () => {
  const count = copy.value.popularPosts.length

  if (count === 0) {
    return
  }

  activePopularIndex.value = (activePopularIndex.value - 1 + count) % count
}

const clearAutoPlay = () => {
  if (autoPlayTimer) {
    window.clearInterval(autoPlayTimer)
    autoPlayTimer = undefined
  }
}

const startAutoPlay = () => {
  clearAutoPlay()

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reducedMotion || copy.value.popularPosts.length < 2) {
    return
  }

  autoPlayTimer = window.setInterval(() => {
    nextPopular()
  }, AUTO_PLAY_MS)
}

const moveToPopular = (index: number) => {
  activePopularIndex.value = index
  startAutoPlay()
}

const handleNext = () => {
  nextPopular()
  startAutoPlay()
}

const handlePrev = () => {
  prevPopular()
  startAutoPlay()
}

onMounted(() => {
  startAutoPlay()
})

onBeforeUnmount(() => {
  clearAutoPlay()
})

watch(
  () => locale.value,
  () => {
    activePopularIndex.value = 0
    searchQuery.value = ''
    selectedProjectIndex.value = null
    startAutoPlay()
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
  () => copy.value.popularPosts.length,
  (count) => {
    if (count === 0) {
      activePopularIndex.value = 0
      return
    }

    if (activePopularIndex.value > count - 1) {
      activePopularIndex.value = 0
    }
  },
)
</script>

<template>
  <div class="relative isolate mx-auto min-h-screen w-full max-w-[1220px] px-4 pb-14 pt-5 sm:px-8 lg:px-12">
    <div
      aria-hidden="true"
      class="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_-4%,rgba(255,255,255,0.08),transparent_30%),radial-gradient(circle_at_82%_108%,rgba(255,255,255,0.07),transparent_34%)] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.88),rgba(0,0,0,0.42))]"
    ></div>

    <main class="space-y-8">

      <BlogPopularCarousel
        :popular-kicker="copy.popularKicker"
        :popular-heading="copy.popularHeading"
        :popular-description="copy.popularDescription"
        :posts="copy.popularPosts"
        :active-index="activePopularIndex"
        :read-label="copy.readLabel"
        :view-label="viewLabel"
        :build-post-path="buildPostPath"
        :resolve-view-count="getViewCount"
        @prev="handlePrev"
        @next="handleNext"
        @move="moveToPopular"
      />

      <section id="blog-categories" class="space-y-4">
        <BlogCategoryTabs
          :groups="groupedPosts"
          :selected-category="selectedCategory"
          @select="selectCategory($event as BlogCategoryKey)"
        />

        <div>
          <BlogSearchSyncPanel
            v-model="searchQuery"
            :search-label="searchLabel"
            :search-placeholder="searchPlaceholder"
            :api-status-label="apiStatusLabel"
            :is-loading="isLoading"
            :loading-label="loadingLabel"
            :reload-label="reloadLabel"
            :error-message="errorMessage"
            @reload="reload"
          />
        </div>

        <article
          v-if="selectedGroup"
          :id="selectedGroup.anchor"
          :key="`category-${selectedGroup.key}`"
          class="rounded-[1.2rem] border border-[#2a2a2a] bg-[#101010cc] p-4 sm:p-6"
        >
          <p class="text-[11px] uppercase tracking-[0.11em] text-zinc-500">{{ categoryLabel }}</p>
          <h2 class="mt-2 text-xl font-semibold text-zinc-100 sm:text-2xl">{{ selectedGroup.title }}</h2>
          <p class="mt-2 text-sm text-zinc-400">{{ selectedGroup.description }}</p>

          <BlogRetrospectiveSelector
            v-if="selectedGroup.key === 'retrospective'"
            :project-selector-label="projectSelectorLabel"
            :project-selector-hint="projectSelectorHint"
            :retrospective-heading-label="retrospectiveHeadingLabel"
            :works="projectWorks"
            :selected-project-index="selectedProjectIndex"
            :selected-project-title="selectedProject?.title ?? ''"
            @select="selectProjectWork"
          />

          <div
            v-if="selectedGroup.key !== 'retrospective' || selectedProject"
            class="mt-4 grid gap-4 sm:mt-5 md:grid-cols-2 xl:grid-cols-3"
          >
            <BlogPostPreviewCard
              v-for="(post, postIndex) in filteredSelectedPosts"
              :key="`post-${post.slug}`"
              :post="post"
              :group-title="selectedGroup.title"
              :read-label="copy.readLabel"
              :author-name="authorName"
              :to="buildPostPath(post.slug)"
              :cover-background="getCoverBackground(post.category, postIndex)"
              :view-label="viewLabel"
              :view-count="getViewCount(post.slug)"
              :engagement="getEngagement(post.slug)"
            />
          </div>

          <p v-if="filteredSelectedPosts.length === 0" class="mt-5 text-sm text-zinc-400">
            {{ emptyStateLabel }}
          </p>
        </article>
      </section>
    </main>
  </div>
</template>
