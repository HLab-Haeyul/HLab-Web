<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { BLOG_CATEGORY_KEYS, type BlogCategoryKey } from '../../data/blog/content'
import { useBlogContent } from '../../composables/useBlogContent'
import { useLocale } from '../../composables/useLocale'

const AUTO_PLAY_MS = 4500

const { locale } = useLocale()
const { copy, dataSource, isLoading, errorMessage, reload } = useBlogContent(locale)
const activePopularIndex = ref(0)
const searchQuery = ref('')
const authorName = computed(() => (locale.value === 'en' ? 'Kim Minjae' : '김민재'))
const categoryLabel = computed(() => (locale.value === 'en' ? 'Category' : '카테고리'))
const searchLabel = computed(() => (locale.value === 'en' ? 'Search posts' : '글 검색'))
const searchPlaceholder = computed(() =>
  locale.value === 'en' ? 'Search by title, summary, or tag' : '제목, 요약, 태그로 검색',
)
const searchNoResult = computed(() =>
  locale.value === 'en' ? 'No posts match your search.' : '검색 결과가 없습니다.',
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

  return palette[index % palette.length]
}

const getEngagement = (slug: string) => {
  const seed = [...slug].reduce((acc, char) => acc + char.charCodeAt(0), 0)

  return {
    likes: 30 + (seed % 220),
    comments: 4 + (seed % 24),
  }
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
const selectedCategory = ref<BlogCategoryKey>(defaultCategory)
const selectedGroup = computed(
  () => groupedPosts.value.find((group) => group.key === selectedCategory.value) ?? groupedPosts.value[0],
)
const filteredSelectedPosts = computed(() => {
  const group = selectedGroup.value

  if (!group) {
    return []
  }

  const query = searchQuery.value.trim().toLocaleLowerCase()

  if (!query) {
    return group.posts
  }

  return group.posts.filter((post) => {
    const title = post.title.toLocaleLowerCase()
    const excerpt = post.excerpt.toLocaleLowerCase()
    const tags = post.tags.join(' ').toLocaleLowerCase()

    return title.includes(query) || excerpt.includes(query) || tags.includes(query)
  })
})

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
    startAutoPlay()
  },
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
      <section>
        <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">{{ copy.kicker }}</p>
        <h1 class="mt-3 text-[clamp(1.8rem,5vw,3rem)] leading-[1.03] text-zinc-100 [font-family:var(--font-display)]">
          {{ copy.heading }}
        </h1>
        <p class="mt-4 max-w-[72ch] text-zinc-300">{{ copy.description }}</p>
      </section>

      <section
        id="popular"
        class="rounded-[1.4rem] border border-[#2a2a2a] bg-[#101010cc] p-3 shadow-[0_20px_52px_rgba(0,0,0,0.38)] sm:p-4"
      >
        <div class="mb-4 px-1">
          <p class="text-xs uppercase tracking-[0.11em] text-zinc-500">{{ copy.popularKicker }}</p>
          <h2 class="mt-2 text-xl font-semibold text-zinc-100 sm:text-2xl">{{ copy.popularHeading }}</h2>
          <p class="mt-2 text-sm text-zinc-400">{{ copy.popularDescription }}</p>
        </div>

        <div class="overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#121212]">
          <div
            class="flex transition-transform duration-500 ease-out"
            :style="{ transform: `translate3d(-${activePopularIndex * 100}%, 0, 0)` }"
          >
            <article
              v-for="post in copy.popularPosts"
              :key="`popular-${post.slug}`"
              class="min-w-full p-4 sm:p-6"
            >
              <div
                class="rounded-2xl border border-[#343434] p-5 sm:p-7"
                :style="{ background: post.bannerBackground }"
              >
                <p class="text-[11px] uppercase tracking-[0.12em] text-zinc-400">{{ post.heroTag }}</p>
                <h3 class="mt-3 text-[clamp(1.2rem,3vw,1.9rem)] leading-snug text-zinc-100">
                  {{ post.title }}
                </h3>
                <p class="mt-2 text-sm text-zinc-300 sm:text-base">{{ post.highlight }}</p>
                <p class="mt-4 text-sm text-zinc-400">{{ post.excerpt }}</p>
                <RouterLink
                  :to="buildPostPath(post.slug)"
                  class="mt-4 inline-flex rounded-lg border border-[#3a3a3a] bg-[#10101066] px-2.5 py-1 text-xs text-zinc-200 transition hover:border-[#5f5f5f] hover:text-white"
                >
                  {{ copy.readLabel }}
                </RouterLink>
                <div class="mt-5 flex flex-wrap gap-2">
                  <span
                    v-for="tag in post.tags"
                    :key="`${post.slug}-${tag}`"
                    class="rounded-full border border-[#3d3d3d] bg-[#12121290] px-2.5 py-1 text-[11px] text-zinc-300"
                  >
                    {{ tag }}
                  </span>
                </div>
                <p class="mt-5 text-xs tracking-[0.06em] text-zinc-400">
                  {{ post.publishedAt }} · {{ post.readTime }}
                </p>
              </div>
            </article>
          </div>
        </div>

        <div class="mt-4 flex items-center justify-between gap-3 px-1">
          <div class="inline-flex items-center gap-2">
            <button
              type="button"
              class="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#2f2f2f] text-zinc-200 transition hover:border-[#5a5a5a] hover:text-white"
              @click="handlePrev"
              aria-label="Previous popular post"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M14.5 6L8.5 12L14.5 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              class="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#2f2f2f] text-zinc-200 transition hover:border-[#5a5a5a] hover:text-white"
              @click="handleNext"
              aria-label="Next popular post"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M9.5 6L15.5 12L9.5 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>

          <div class="inline-flex items-center gap-2">
            <button
              v-for="(post, index) in copy.popularPosts"
              :key="`popular-dot-${post.slug}`"
              type="button"
              class="h-2.5 rounded-full transition"
              :class="index === activePopularIndex ? 'w-6 bg-zinc-100' : 'w-2.5 bg-zinc-600 hover:bg-zinc-400'"
              :aria-label="`Go to popular post ${index + 1}`"
              @click="moveToPopular(index)"
            ></button>
          </div>
        </div>
      </section>

      <section id="blog-categories" class="space-y-4">
        <div
          class="flex flex-wrap items-center gap-2 rounded-2xl border border-[#2a2a2a] bg-[#111111d1] p-2.5"
          role="tablist"
          aria-label="Blog categories"
        >
          <button
            v-for="group in groupedPosts"
            :key="`category-tab-${group.key}`"
            type="button"
            role="tab"
            :aria-selected="selectedCategory === group.key"
            class="rounded-xl px-3 py-2 text-sm font-medium transition"
            :class="
              selectedCategory === group.key
                ? 'bg-white text-[#0f0f0f]'
                : 'bg-[#181818] text-zinc-300 hover:bg-[#242424] hover:text-zinc-100'
            "
            @click="selectedCategory = group.key"
          >
            {{ group.title }}
          </button>
        </div>

        <div id="blog-search" class="rounded-2xl border border-[#2a2a2a] bg-[#111111d1] p-3">
          <label class="mb-2 block text-xs uppercase tracking-[0.11em] text-zinc-500" for="blog-search-input">
            {{ searchLabel }}
          </label>
          <div class="flex items-center gap-2 rounded-xl border border-[#2e2e2e] bg-[#161616] px-3 py-2">
            <svg
              class="h-4 w-4 shrink-0 text-zinc-500"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M11 19C15.4 19 19 15.4 19 11C19 6.6 15.4 3 11 3C6.6 3 3 6.6 3 11C3 15.4 6.6 19 11 19Z"
                stroke="currentColor"
                stroke-width="1.8"
              />
              <path d="M21 21L16.7 16.7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
            <input
              id="blog-search-input"
              v-model="searchQuery"
              type="search"
              class="w-full border-0 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none"
              :placeholder="searchPlaceholder"
            />
          </div>
        </div>

        <div id="blog-sync" class="rounded-2xl border border-[#2a2a2a] bg-[#111111d1] p-3">
          <div class="flex items-center justify-between gap-2">
            <p class="text-xs text-zinc-400">
              {{ apiStatusLabel }}
              <span v-if="isLoading"> · {{ loadingLabel }}</span>
            </p>
            <button
              type="button"
              class="rounded-lg border border-[#313131] px-2.5 py-1 text-xs text-zinc-300 transition hover:border-[#5b5b5b] hover:text-white"
              @click="reload"
            >
              {{ reloadLabel }}
            </button>
          </div>
          <p v-if="errorMessage" class="mt-2 text-xs text-amber-300">
            {{ errorMessage }}
          </p>
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

          <div class="mt-4 grid gap-4 sm:mt-5 md:grid-cols-2 xl:grid-cols-3">
            <article
              v-for="(post, postIndex) in filteredSelectedPosts"
              :key="`post-${post.slug}`"
              class="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#2d2d2d] bg-[#171717] shadow-[0_18px_28px_rgba(0,0,0,0.25)] transition duration-200 hover:-translate-y-1 hover:border-[#4a4a4a] hover:shadow-[0_22px_34px_rgba(0,0,0,0.34)]"
            >
              <div
                class="relative aspect-[16/9] border-b border-[#2d2d2d] p-4"
                :style="{ background: getCoverBackground(post.category, postIndex) }"
              >
                <p class="text-[11px] uppercase tracking-[0.12em] text-zinc-300">{{ selectedGroup.title }}</p>
                <p class="mt-2 max-w-[85%] text-sm font-medium text-zinc-100">
                  {{ post.tags[0] ?? selectedGroup.title }}
                </p>
                <span
                  class="absolute bottom-3 right-3 rounded-md border border-[#ffffff2e] bg-[#10101075] px-2 py-0.5 text-[10px] tracking-[0.08em] text-zinc-200"
                >
                  BLOG
                </span>
              </div>

              <div class="flex flex-1 flex-col p-4">
                <RouterLink :to="buildPostPath(post.slug)" class="line-clamp-2 text-base font-semibold leading-snug text-zinc-100 transition hover:text-white/90">
                  {{ post.title }}
                </RouterLink>
                <p class="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-400">{{ post.excerpt }}</p>

                <div class="mt-3 flex flex-wrap gap-1.5">
                  <span
                    v-for="tag in post.tags"
                    :key="`${post.slug}-${tag}`"
                    class="rounded-full bg-[#262626] px-2 py-0.5 text-[11px] text-zinc-300"
                  >
                    #{{ tag }}
                  </span>
                </div>

                <p class="mt-4 text-xs text-zinc-500">{{ post.publishedAt }} · {{ post.readTime }}</p>
              </div>

              <div class="flex items-center justify-between border-t border-[#2d2d2d] px-4 py-3">
                <div class="inline-flex items-center gap-2">
                  <span
                    class="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#3a3a3a] bg-[#222222] text-[10px] font-semibold text-zinc-200"
                  >
                    KM
                  </span>
                  <span class="text-xs text-zinc-400">{{ authorName }}</span>
                </div>

                <div class="inline-flex items-center gap-3 text-xs text-zinc-400">
                  <RouterLink
                    :to="buildPostPath(post.slug)"
                    class="rounded-md border border-[#3a3a3a] px-2 py-0.5 text-[11px] text-zinc-300 transition hover:border-[#5f5f5f] hover:text-white"
                  >
                    {{ copy.readLabel }}
                  </RouterLink>
                  <span class="inline-flex items-center gap-1">
                    <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M12 20.5C11.7 20.5 11.4 20.4 11.2 20.2L5.2 14.8C3.8 13.5 3 11.8 3 10.1C3 7.2 5.2 5 8.1 5C9.7 5 11.1 5.7 12 6.9C12.9 5.7 14.3 5 15.9 5C18.8 5 21 7.2 21 10.1C21 11.8 20.2 13.5 18.8 14.8L12.8 20.2C12.6 20.4 12.3 20.5 12 20.5Z"
                        stroke="currentColor"
                        stroke-width="1.6"
                        stroke-linejoin="round"
                      />
                    </svg>
                    {{ getEngagement(post.slug).likes }}
                  </span>
                  <span class="inline-flex items-center gap-1">
                    <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M20 14.5C20 16.4 18.4 18 16.5 18H9L5 21V18.2C3.8 17.7 3 16.6 3 15.3V7.5C3 5.6 4.6 4 6.5 4H16.5C18.4 4 20 5.6 20 7.5V14.5Z"
                        stroke="currentColor"
                        stroke-width="1.6"
                        stroke-linejoin="round"
                      />
                    </svg>
                    {{ getEngagement(post.slug).comments }}
                  </span>
                </div>
              </div>
            </article>
          </div>

          <p v-if="filteredSelectedPosts.length === 0" class="mt-5 text-sm text-zinc-400">
            {{ searchNoResult }}
          </p>
        </article>
      </section>
    </main>
  </div>
</template>
