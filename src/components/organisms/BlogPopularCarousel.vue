<script setup lang="ts">
import type { PopularPost } from '@/data/blog/types'

type Props = {
  popularKicker: string
  popularHeading: string
  popularDescription: string
  posts: PopularPost[]
  activeIndex: number
  readLabel: string
  viewLabel: string
  buildPostPath: (slug: string) => string
  resolveViewCount: (slug: string) => number
}

const props = defineProps<Props>()

const formatViewCount = (value: number) => value.toLocaleString()

const emit = defineEmits<{
  prev: []
  next: []
  move: [index: number]
}>()
</script>

<template>
  <section
    id="popular"
    class="rounded-[1.4rem] border border-[#2a2a2a] bg-[#101010cc] p-2.5 shadow-[0_20px_52px_rgba(0,0,0,0.38)] sm:p-3.5"
  >
    <div class="mb-4 px-1">
      <p class="text-xs uppercase tracking-[0.11em] text-zinc-500">{{ props.popularKicker }}</p>
      <h2 class="mt-2 text-xl font-semibold text-zinc-100 sm:text-2xl">{{ props.popularHeading }}</h2>
      <p class="mt-2 text-sm text-zinc-400">{{ props.popularDescription }}</p>
    </div>

    <div class="overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#121212]">
      <div
        class="flex transition-transform duration-500 ease-out"
        :style="{ transform: `translate3d(-${props.activeIndex * 100}%, 0, 0)` }"
      >
        <article
          v-for="post in props.posts"
          :key="`popular-${post.slug}`"
          class="min-w-full p-3 sm:p-4"
        >
          <div
            class="rounded-2xl border border-[#343434] p-4 sm:p-5"
            :style="{ background: post.bannerBackground }"
          >
            <p class="text-[11px] uppercase tracking-[0.12em] text-zinc-400">{{ post.heroTag }}</p>
            <h3 class="mt-2.5 text-[clamp(1.1rem,2.7vw,1.7rem)] leading-snug text-zinc-100">
              {{ post.title }}
            </h3>
            <p class="mt-2 text-sm text-zinc-300 sm:text-base">{{ post.highlight }}</p>
            <p class="mt-4 text-sm text-zinc-400">{{ post.excerpt }}</p>
            <RouterLink
              :to="props.buildPostPath(post.slug)"
              class="mt-4 inline-flex rounded-lg border border-[#3a3a3a] bg-[#10101066] px-2.5 py-1 text-xs text-zinc-200 transition hover:border-[#5f5f5f] hover:text-white"
            >
              {{ props.readLabel }}
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
              {{ post.publishedAt }} · {{ post.readTime }} · {{ props.viewLabel }} {{ formatViewCount(props.resolveViewCount(post.slug)) }}
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
          aria-label="Previous popular post"
          @click="emit('prev')"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M14.5 6L8.5 12L14.5 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          class="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#2f2f2f] text-zinc-200 transition hover:border-[#5a5a5a] hover:text-white"
          aria-label="Next popular post"
          @click="emit('next')"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M9.5 6L15.5 12L9.5 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>

      <div class="inline-flex items-center gap-2">
        <button
          v-for="(post, index) in props.posts"
          :key="`popular-dot-${post.slug}`"
          type="button"
          class="h-2.5 rounded-full transition"
          :class="index === props.activeIndex ? 'w-6 bg-zinc-100' : 'w-2.5 bg-zinc-600 hover:bg-zinc-400'"
          :aria-label="`Go to popular post ${index + 1}`"
          @click="emit('move', index)"
        ></button>
      </div>
    </div>
  </section>
</template>
