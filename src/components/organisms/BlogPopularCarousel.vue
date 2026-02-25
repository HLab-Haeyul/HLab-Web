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
    class="rounded-[1.4rem] border border-[#273346] bg-[#111a27] p-3 sm:p-4"
  >
    <div class="mb-4 px-1">
      <p class="text-xs font-semibold uppercase tracking-[0.11em] text-[#a9badb]">{{ props.popularKicker }}</p>
      <h2 class="mt-2 text-xl font-semibold text-zinc-100 sm:text-2xl">{{ props.popularHeading }}</h2>
      <p class="mt-2 text-sm text-zinc-400">{{ props.popularDescription }}</p>
    </div>

    <div
      v-if="props.posts.length > 0"
      class="overflow-hidden rounded-2xl border border-[#273346] bg-[#0f1726]"
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
            class="block rounded-2xl border border-[#2a3950] p-4 transition hover:border-[#6f8fce] sm:p-5"
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
      class="rounded-2xl border border-dashed border-[#2a3950] bg-[#0f1726] px-4 py-8 text-center text-sm text-zinc-500"
    >
      {{ props.emptyLabel }}
    </p>

    <div v-if="props.posts.length > 0" class="mt-4 flex items-center justify-between gap-3 px-1">
      <div class="inline-flex items-center gap-2">
        <button
          type="button"
          class="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#2a3950] bg-[#141f31] text-zinc-300 transition hover:border-[#6f8fce] hover:text-white"
          aria-label="Previous popular post"
          @click="emit('prev')"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M14.5 6L8.5 12L14.5 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          class="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#2a3950] bg-[#141f31] text-zinc-300 transition hover:border-[#6f8fce] hover:text-white"
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
          :class="index === props.activeIndex ? 'w-6 bg-[#6f8fce]' : 'w-2.5 bg-[#324258] hover:bg-[#4d6280]'"
          :aria-label="`Go to popular post ${index + 1}`"
          @click="emit('move', index)"
        ></button>
      </div>
    </div>
  </section>
</template>
