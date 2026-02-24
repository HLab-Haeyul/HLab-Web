<script setup lang="ts">
import type { PopularPost } from '@/data/blog/types'

type Props = {
  popularKicker: string
  popularHeading: string
  popularDescription: string
  emptyLabel: string
  posts: PopularPost[]
  activeIndex: number
  readLabel: string
  viewLabel: string
  buildPostPath: (id: string) => string
  resolveViewCount: (id: string) => number
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
    class="rounded-[1.4rem] border border-[#e8eef2] bg-white p-3 shadow-[0_16px_40px_rgba(15,23,42,0.08)] sm:p-4"
  >
    <div class="mb-4 px-1">
      <p class="text-xs font-semibold uppercase tracking-[0.11em] text-[#12b886]">{{ props.popularKicker }}</p>
      <h2 class="mt-2 text-xl font-semibold text-[#212529] sm:text-2xl">{{ props.popularHeading }}</h2>
      <p class="mt-2 text-sm text-[#495057]">{{ props.popularDescription }}</p>
    </div>

    <div
      v-if="props.posts.length > 0"
      class="overflow-hidden rounded-2xl border border-[#e9ecef] bg-[#f8fafb]"
    >
      <div
        class="flex transition-transform duration-500 ease-out"
        :style="{ transform: `translate3d(-${props.activeIndex * 100}%, 0, 0)` }"
      >
        <article
          v-for="post in props.posts"
          :key="`popular-${post.id}`"
          class="min-w-full p-3 sm:p-4"
        >
          <RouterLink
            :to="props.buildPostPath(post.id)"
            :aria-label="`${post.title} ${props.readLabel}`"
            class="block rounded-2xl border border-[#e5eaee] p-4 transition hover:border-[#12b886] hover:shadow-[0_12px_24px_rgba(15,23,42,0.1)] sm:p-5"
            :style="{ background: post.bannerBackground }"
          >
            <p class="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#e9fff8]">{{ post.heroTag }}</p>
            <h3 class="mt-2.5 text-[clamp(1.1rem,2.7vw,1.7rem)] font-semibold leading-snug text-white">
              {{ post.title }}
            </h3>
            <p class="mt-2 text-sm text-[#ecfdf5] sm:text-base">{{ post.highlight }}</p>
            <p class="mt-4 text-sm text-[#d9f7ec]">{{ post.excerpt }}</p>
            <div class="mt-5 flex flex-wrap gap-2">
              <span
                v-for="tag in post.tags"
                :key="`${post.id}-${tag}`"
                class="rounded-full border border-[#ffffff80] bg-[#ffffff30] px-2.5 py-1 text-[11px] text-white"
              >
                {{ tag }}
              </span>
            </div>
            <p class="mt-5 text-xs tracking-[0.06em] text-[#def7ef]">
              {{ post.publishedAt }} · {{ post.readTime }} · {{ props.viewLabel }} {{ formatViewCount(props.resolveViewCount(post.id)) }}
            </p>
          </RouterLink>
        </article>
      </div>
    </div>

    <p
      v-else
      class="rounded-2xl border border-dashed border-[#cfd8de] bg-[#f8fafb] px-4 py-8 text-center text-sm text-[#868e96]"
    >
      {{ props.emptyLabel }}
    </p>

    <div v-if="props.posts.length > 0" class="mt-4 flex items-center justify-between gap-3 px-1">
      <div class="inline-flex items-center gap-2">
        <button
          type="button"
          class="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#d9e2e7] bg-white text-[#495057] transition hover:border-[#12b886] hover:text-[#087f5b]"
          aria-label="Previous popular post"
          @click="emit('prev')"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M14.5 6L8.5 12L14.5 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          class="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#d9e2e7] bg-white text-[#495057] transition hover:border-[#12b886] hover:text-[#087f5b]"
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
          :key="`popular-dot-${post.id}`"
          type="button"
          class="h-2.5 rounded-full transition"
          :class="index === props.activeIndex ? 'w-6 bg-[#12b886]' : 'w-2.5 bg-[#c5d1d8] hover:bg-[#96a4ad]'"
          :aria-label="`Go to popular post ${index + 1}`"
          @click="emit('move', index)"
        ></button>
      </div>
    </div>
  </section>
</template>
