<script setup lang="ts">
import type { AdminProjectRecord } from '@/types/adminProject'

type Props = {
  project: AdminProjectRecord
  selected: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  open: [id: string]
  edit: [id: string]
  delete: [id: string]
}>()

const open = () => emit('open', props.project.id)
const openEditor = () => emit('edit', props.project.id)
const remove = () => emit('delete', props.project.id)
</script>

<template>
  <article
    role="button"
    tabindex="0"
    class="group cursor-pointer rounded-xl border bg-[#111111] p-4 transition focus:outline-none"
    :class="
      props.selected
        ? 'border-[#8f784d] bg-[#181611]'
        : 'border-[#2d2d2d] hover:border-[#5f5544] hover:bg-[#161513]'
    "
    @click="open"
    @keydown.enter.prevent="open"
    @keydown.space.prevent="open"
  >
    <div v-if="props.project.imageSrc" class="mb-3 overflow-hidden rounded-lg border border-[#2f2f2f] bg-[#161616]">
      <img
        :src="props.project.imageSrc"
        :alt="props.project.imageAlt || `${props.project.title} 썸네일`"
        class="h-24 w-full object-cover"
        loading="lazy"
      />
    </div>
    <p
      v-else
      class="mb-3 rounded-lg border border-dashed border-[#2f2f2f] bg-[#141414] px-3 py-8 text-center text-xs text-zinc-500"
    >
      이미지 없음
    </p>

    <p class="text-sm font-semibold text-zinc-100">{{ props.project.title }}</p>
    <p class="mt-1 line-clamp-2 text-xs text-zinc-400">{{ props.project.summary }}</p>
    <p class="mt-2 text-xs text-zinc-300">{{ props.project.impact }}</p>

    <div class="mt-3 flex items-center gap-2">
      <button
        type="button"
        class="rounded-md border border-[#3a3731] px-2.5 py-1 text-[11px] text-zinc-200 transition hover:border-[#5f5544] hover:text-white"
        @click.stop="openEditor"
      >
        수정
      </button>
      <button
        type="button"
        class="rounded-md border border-[#7e3d3d] bg-[#2a1414] px-2.5 py-1 text-[11px] text-rose-300 transition hover:border-[#a34a4a] hover:bg-[#341818] hover:text-rose-200"
        @click.stop="remove"
      >
        삭제
      </button>
    </div>
  </article>
</template>
