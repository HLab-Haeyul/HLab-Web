<script setup lang="ts">
import type { BlogPost } from '@/data/blog/types'

type Props = {
  post: BlogPost
  groupTitle: string
  readLabel: string
  authorName: string
  to: string
  coverBackground: string
  viewLabel: string
  viewCount: number
  engagement: {
    likes: number
    comments: number
  }
}

const props = defineProps<Props>()

const formatViewCount = (value: number) => value.toLocaleString()
const formatTagLabel = (value: string) => value.replace(/^#+/, '')
</script>

<template>
  <RouterLink
    :to="props.to"
    :aria-label="`${props.post.title} ${props.readLabel}`"
    class="group flex h-full flex-col overflow-hidden rounded-xl border border-[#273346] bg-[#111a27] transition duration-200 hover:-translate-y-0.5 hover:border-[#6f8fce]"
  >
    <div
      class="relative aspect-[16/9] border-b border-[#273346] p-3"
      :style="{ background: props.coverBackground }"
    >
      <p class="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#d3ddf2]">{{ props.groupTitle }}</p>
      <p class="mt-2 max-w-[85%] text-sm font-semibold text-white">
        #{{ formatTagLabel(props.post.tags[0] ?? props.groupTitle) }}
      </p>
      <span
        class="absolute bottom-3 right-3 rounded-md border border-[#ffffff66] bg-[#0d1726cc] px-2 py-0.5 text-[10px] font-semibold tracking-[0.08em] text-[#d3ddf2]"
      >
        BLOG
      </span>
    </div>

    <div class="flex flex-1 flex-col p-3">
      <p class="line-clamp-2 text-sm font-semibold leading-snug text-zinc-100 transition group-hover:text-[#a9badb]">
        {{ props.post.title }}
      </p>
      <p class="mt-1.5 line-clamp-3 text-xs leading-relaxed text-zinc-400">{{ props.post.excerpt }}</p>

      <div class="mt-2.5 flex flex-wrap gap-1.5">
        <span
          v-for="tag in props.post.tags"
          :key="`${props.post.id}-${tag}`"
          class="rounded-full border border-[#2b384f] bg-[#0f1726] px-2 py-0.5 text-[11px] text-zinc-300"
        >
          #{{ formatTagLabel(tag) }}
        </span>
      </div>

      <p class="mt-3 text-[11px] text-zinc-500">
        {{ props.post.publishedAt }} · {{ props.post.readTime }} · {{ props.viewLabel }} {{ formatViewCount(props.viewCount) }}
      </p>
    </div>

    <div class="flex items-center justify-between border-t border-[#273346] px-3 py-2.5">
      <div class="inline-flex items-center gap-2">
        <span
          class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#2b384f] bg-[#0f1726] text-[9px] font-semibold text-[#d3ddf2]"
        >
          KM
        </span>
        <span class="text-[11px] text-zinc-500">{{ props.authorName }}</span>
      </div>

      <div class="inline-flex items-center gap-2.5 text-[11px] text-zinc-500">
        <span
          class="rounded-md border border-[#2b384f] bg-[#0f1726] px-2 py-0.5 text-[11px] font-semibold text-[#d3ddf2] transition hover:border-[#6f8fce] hover:text-white"
        >
          {{ props.readLabel }}
        </span>
        <span class="inline-flex items-center gap-1">
          <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 20.5C11.7 20.5 11.4 20.4 11.2 20.2L5.2 14.8C3.8 13.5 3 11.8 3 10.1C3 7.2 5.2 5 8.1 5C9.7 5 11.1 5.7 12 6.9C12.9 5.7 14.3 5 15.9 5C18.8 5 21 7.2 21 10.1C21 11.8 20.2 13.5 18.8 14.8L12.8 20.2C12.6 20.4 12.3 20.5 12 20.5Z"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linejoin="round"
            />
          </svg>
          {{ props.engagement.likes }}
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
          {{ props.engagement.comments }}
        </span>
      </div>
    </div>
  </RouterLink>
</template>
