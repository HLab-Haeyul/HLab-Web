<script setup lang="ts">
import type { BlogPost } from '@/data/blog/types'
import BlogTagBadge from '@/components/atoms/BlogTagBadge.vue'
import BlogCategoryLabel from '@/components/atoms/BlogCategoryLabel.vue'
import AuthorAvatar from '@/components/atoms/AuthorAvatar.vue'
import EngagementCounter from '@/components/atoms/EngagementCounter.vue'

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
      <p class="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#d3ddf2]">
        {{ props.groupTitle }}
      </p>
      <p class="mt-2 max-w-[85%] text-sm font-semibold text-white">
        #{{ formatTagLabel(props.post.tags[0] ?? props.groupTitle) }}
      </p>
      <BlogCategoryLabel label="BLOG" />
    </div>

    <div class="flex flex-1 flex-col p-3">
      <p
        class="line-clamp-2 text-sm font-semibold leading-snug text-zinc-100 transition group-hover:text-[#a9badb]"
      >
        {{ props.post.title }}
      </p>
      <p class="mt-1.5 line-clamp-3 text-xs leading-relaxed text-zinc-400">
        {{ props.post.excerpt }}
      </p>

      <div class="mt-2.5 flex flex-wrap gap-1.5">
        <BlogTagBadge v-for="tag in props.post.tags" :key="`${props.post.id}-${tag}`" :tag="tag" />
      </div>

      <p class="mt-3 text-[11px] text-zinc-500">
        {{ props.post.publishedAt }} · {{ props.post.readTime }} · {{ props.viewLabel }}
        {{ formatViewCount(props.viewCount) }}
      </p>
    </div>

    <div class="flex items-center justify-between border-t border-[#273346] px-3 py-2.5">
      <AuthorAvatar initials="KM" :name="props.authorName" />

      <div class="inline-flex items-center gap-2.5">
        <span
          class="rounded-md border border-[#2b384f] bg-[#0f1726] px-2 py-0.5 text-[11px] font-semibold text-[#d3ddf2] transition hover:border-[#6f8fce] hover:text-white"
        >
          {{ props.readLabel }}
        </span>
        <EngagementCounter type="like" :count="props.engagement.likes" />
        <EngagementCounter type="comment" :count="props.engagement.comments" />
      </div>
    </div>
  </RouterLink>
</template>
