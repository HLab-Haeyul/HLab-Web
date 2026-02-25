<script setup lang="ts">
import type { BlogPostDetail } from '@/data/blog/types'

type Props = {
  post: BlogPostDetail
  viewLabel: string
  viewCount: number
  liked: boolean
  likes: number
  likeLabel: string
  likeAriaLabel: string
  commentHeading: string
  commentCount: number
  showCommentBadge?: boolean
}

const props = defineProps<Props>()

const formatViewCount = (value: number) => value.toLocaleString()

const emit = defineEmits<{
  toggleLike: []
}>()
</script>

<template>
  <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">{{ props.post.heroTag }}</p>
  <h1 class="mt-3 text-[clamp(1.6rem,4vw,2.6rem)] leading-[1.07] text-zinc-100 [font-family:var(--font-display)]">
    {{ props.post.title }}
  </h1>
  <p class="mt-3 text-zinc-300">{{ props.post.excerpt }}</p>

  <div class="mt-5 flex flex-wrap items-center gap-2">
    <span
      v-for="tag in props.post.tags"
      :key="`${props.post.id}-${tag}`"
      class="rounded-full border border-[#353535] bg-[#151515] px-2.5 py-1 text-xs text-zinc-300"
    >
      #{{ tag }}
    </span>
  </div>

  <p class="mt-5 text-xs text-zinc-500">
    {{ props.post.publishedAt }} · {{ props.post.readTime }} · {{ props.viewLabel }} {{ formatViewCount(props.viewCount) }} · {{ props.post.authorName }}
  </p>

  <div class="mt-5 flex items-center gap-2 text-xs">
    <button
      type="button"
      class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 transition"
      :class="
        props.liked
          ? 'border-[#a03c4f] bg-[#4a1b25] text-rose-200'
          : 'border-[#343434] bg-[#171717] text-zinc-300 hover:border-[#575757]'
      "
      :aria-label="props.likeAriaLabel"
      @click="emit('toggleLike')"
    >
      <svg
        class="h-3.5 w-3.5"
        viewBox="0 0 24 24"
        :fill="props.liked ? 'currentColor' : 'none'"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M12 20.5C11.7 20.5 11.4 20.4 11.2 20.2L5.2 14.8C3.8 13.5 3 11.8 3 10.1C3 7.2 5.2 5 8.1 5C9.7 5 11.1 5.7 12 6.9C12.9 5.7 14.3 5 15.9 5C18.8 5 21 7.2 21 10.1C21 11.8 20.2 13.5 18.8 14.8L12.8 20.2C12.6 20.4 12.3 20.5 12 20.5Z"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linejoin="round"
        />
      </svg>
      <span>{{ props.likeLabel }} {{ props.likes }}</span>
    </button>

    <span
      v-if="props.showCommentBadge !== false"
      class="inline-flex items-center gap-1 rounded-full border border-[#343434] bg-[#171717] px-3 py-1.5 text-zinc-300"
    >
      <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M20 14.5C20 16.4 18.4 18 16.5 18H9L5 21V18.2C3.8 17.7 3 16.6 3 15.3V7.5C3 5.6 4.6 4 6.5 4H16.5C18.4 4 20 5.6 20 7.5V14.5Z"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linejoin="round"
        />
      </svg>
      {{ props.commentHeading }} {{ props.commentCount }}
    </span>
  </div>

  <div class="mt-7 h-px w-full bg-[#2a2a2a]"></div>
</template>
