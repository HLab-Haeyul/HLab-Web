<script setup lang="ts">
import type { BlogPost } from '@/data/blog/types'

type Props = {
  post: BlogPost
  thumbnailSrc?: string
  categoryLabel: string
  isManagingPost: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  open: [id: string]
  delete: [id: string]
}>()

const openPost = () => emit('open', props.post.id)
const deletePost = () => emit('delete', props.post.id)
</script>

<template>
  <article
    role="button"
    tabindex="0"
    class="group cursor-pointer rounded-xl border border-[#2d2d2d] bg-[#111111] p-4 transition hover:border-[#5f5544] hover:bg-[#161513] focus:outline-none focus-visible:border-[#8f784d]"
    @click="openPost"
    @keydown.enter.prevent="openPost"
    @keydown.space.prevent="openPost"
  >
    <div
      v-if="props.thumbnailSrc"
      class="mb-3 overflow-hidden rounded-lg border border-[#2f2f2f] bg-[#161616]"
    >
      <img
        :src="props.thumbnailSrc"
        :alt="`${props.post.title} 썸네일`"
        class="h-36 w-full object-cover"
        loading="lazy"
      />
    </div>
    <p class="font-mono text-[11px] text-zinc-500">{{ props.post.id }}</p>
    <h3 class="mt-2 line-clamp-2 text-sm font-semibold text-zinc-100">{{ props.post.title }}</h3>
    <p class="mt-1 line-clamp-2 text-xs text-zinc-400">{{ props.post.excerpt }}</p>
    <div class="mt-3 flex items-center justify-between gap-2 text-xs">
      <span class="rounded-full border border-[#343434] px-2 py-0.5 text-zinc-300">
        {{ props.categoryLabel }}
      </span>
      <span class="text-zinc-500">{{ props.post.publishedAt }}</span>
    </div>
    <div class="mt-3 flex items-center justify-between gap-2">
      <p class="text-xs text-amber-300">댓글 관리 화면으로 이동</p>
      <button
        type="button"
        class="rounded-md border border-[#5a2f2f] px-2.5 py-1 text-[11px] text-rose-300 transition hover:border-[#7e3d3d] hover:text-rose-200 disabled:opacity-50"
        :disabled="props.isManagingPost"
        @click.stop="deletePost"
      >
        글 삭제
      </button>
    </div>
  </article>
</template>
