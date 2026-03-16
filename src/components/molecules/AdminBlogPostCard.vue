<script setup lang="ts">
import type { AdminBlogPostCardItem } from '@/types/adminBlog'

type Props = {
  item: AdminBlogPostCardItem
  deleteDisabled?: boolean
  openHint?: string
  deleteLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  deleteDisabled: false,
  openHint: '댓글 관리 화면으로 이동',
  deleteLabel: '글 삭제',
})

const emit = defineEmits<{
  open: [id: string]
  delete: [id: string]
}>()

const openCard = () => emit('open', props.item.id)
const deleteCard = () => emit('delete', props.item.id)
</script>

<template>
  <article
    role="button"
    tabindex="0"
    class="group cursor-pointer rounded-xl border border-[#2d2d2d] bg-[#111111] p-4 transition hover:border-[#4f76c7] hover:bg-[#131c2a] focus:outline-none focus-visible:border-[#5f8cff]"
    @click="openCard"
    @keydown.enter.prevent="openCard"
    @keydown.space.prevent="openCard"
  >
    <div
      v-if="props.item.thumbnailSrc"
      class="mb-3 overflow-hidden rounded-lg border border-[#2f2f2f] bg-[#161616]"
    >
      <img
        :src="props.item.thumbnailSrc"
        :alt="`${props.item.title} 썸네일`"
        class="h-36 w-full object-cover"
        loading="lazy"
      />
    </div>
    <p class="font-mono text-[11px] text-zinc-500">{{ props.item.id }}</p>
    <h3 class="mt-2 line-clamp-2 text-sm font-semibold text-zinc-100">{{ props.item.title }}</h3>
    <p class="mt-1 line-clamp-2 text-xs text-zinc-400">{{ props.item.excerpt }}</p>
    <div class="mt-3 flex items-center justify-between gap-2 text-xs">
      <span class="rounded-full border border-[#343434] px-2 py-0.5 text-zinc-300">
        {{ props.item.categoryTitle }}
      </span>
      <span class="text-zinc-500">{{ props.item.publishedAt }}</span>
    </div>
    <div class="mt-3 flex items-center justify-between gap-2">
      <p class="text-xs text-blue-300">
        {{ props.openHint }}
      </p>
      <button
        type="button"
        class="rounded-md border border-[#5a2f2f] px-2.5 py-1 text-[11px] text-rose-300 transition hover:border-[#7e3d3d] hover:text-rose-200 disabled:opacity-50"
        :disabled="props.deleteDisabled"
        @click.stop="deleteCard"
      >
        {{ props.deleteLabel }}
      </button>
    </div>
  </article>
</template>
