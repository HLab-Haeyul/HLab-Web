<script setup lang="ts">
import { computed } from 'vue'
import { useBlogPostContent } from '../../composables/useBlogPostContent'
import { useLocale } from '../../composables/useLocale'

const { locale, route, blogPath } = useLocale()

const slug = computed(() => {
  const raw = route.params.slug
  const value = Array.isArray(raw) ? raw[0] : raw

  if (typeof value !== 'string') {
    return ''
  }

  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
})

const { post, dataSource, isLoading, errorMessage, reload } = useBlogPostContent(locale, slug)

const backLabel = computed(() => (locale.value === 'en' ? 'Back to blog' : '블로그 목록으로'))
const statusLabel = computed(() =>
  dataSource.value === 'api'
    ? locale.value === 'en'
      ? 'API Connected'
      : 'API 연결됨'
    : locale.value === 'en'
      ? 'Fallback Data'
      : 'Fallback 데이터',
)
const loadingLabel = computed(() => (locale.value === 'en' ? 'Loading...' : '불러오는 중...'))
const retryLabel = computed(() => (locale.value === 'en' ? 'Reload' : '다시 불러오기'))
const notFoundTitle = computed(() =>
  locale.value === 'en' ? 'Post not found' : '글을 찾을 수 없습니다',
)
const notFoundDescription = computed(() =>
  locale.value === 'en'
    ? 'This article is missing or unavailable right now.'
    : '요청한 글이 없거나 현재 사용할 수 없습니다.',
)
</script>

<template>
  <div class="relative isolate mx-auto min-h-screen w-full max-w-[980px] px-4 pb-14 pt-5 sm:px-8 lg:px-12">
    <div
      aria-hidden="true"
      class="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_-4%,rgba(255,255,255,0.08),transparent_30%),radial-gradient(circle_at_82%_108%,rgba(255,255,255,0.07),transparent_34%)] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.88),rgba(0,0,0,0.42))]"
    ></div>

    <main class="space-y-4">
      <div class="flex items-center justify-between gap-2 rounded-2xl border border-[#2a2a2a] bg-[#111111d1] p-3">
        <RouterLink
          :to="blogPath"
          class="rounded-lg border border-[#313131] px-2.5 py-1 text-xs text-zinc-300 transition hover:border-[#5b5b5b] hover:text-white"
        >
          {{ backLabel }}
        </RouterLink>

        <div class="flex items-center gap-2">
          <p class="text-xs text-zinc-400">
            {{ statusLabel }}
            <span v-if="isLoading"> · {{ loadingLabel }}</span>
          </p>
          <button
            type="button"
            class="rounded-lg border border-[#313131] px-2.5 py-1 text-xs text-zinc-300 transition hover:border-[#5b5b5b] hover:text-white"
            @click="reload"
          >
            {{ retryLabel }}
          </button>
        </div>
      </div>

      <p v-if="errorMessage" class="rounded-xl border border-[#47361b] bg-[#2a1f11] px-3 py-2 text-xs text-amber-300">
        {{ errorMessage }}
      </p>

      <article
        v-if="post"
        id="post-overview"
        class="rounded-[1.4rem] border border-[#2a2a2a] bg-[#101010cc] p-5 sm:p-7"
      >
        <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">{{ post.heroTag }}</p>
        <h1 class="mt-3 text-[clamp(1.6rem,4vw,2.6rem)] leading-[1.07] text-zinc-100 [font-family:var(--font-display)]">
          {{ post.title }}
        </h1>
        <p class="mt-3 text-zinc-300">{{ post.excerpt }}</p>

        <div class="mt-5 flex flex-wrap items-center gap-2">
          <span
            v-for="tag in post.tags"
            :key="`${post.slug}-${tag}`"
            class="rounded-full border border-[#353535] bg-[#151515] px-2.5 py-1 text-xs text-zinc-300"
          >
            #{{ tag }}
          </span>
        </div>

        <p class="mt-5 text-xs text-zinc-500">{{ post.publishedAt }} · {{ post.readTime }} · {{ post.authorName }}</p>

        <div class="mt-7 h-px w-full bg-[#2a2a2a]"></div>

        <div id="post-content" class="mt-7 space-y-4 text-[15px] leading-8 text-zinc-200 sm:text-base">
          <p v-for="(paragraph, index) in post.content" :key="`${post.slug}-content-${index}`">
            {{ paragraph }}
          </p>
        </div>
      </article>

      <section
        v-else
        class="rounded-[1.4rem] border border-[#2a2a2a] bg-[#101010cc] p-8 text-center sm:p-10"
      >
        <h1 class="text-2xl font-semibold text-zinc-100">{{ notFoundTitle }}</h1>
        <p class="mt-2 text-sm text-zinc-400">{{ notFoundDescription }}</p>
      </section>
    </main>
  </div>
</template>
