<script setup lang="ts">
import type { WorkItem } from '@/data/portfolio/types'

type Props = {
  projectSelectorLabel: string
  projectSelectorHint: string
  retrospectiveHeadingLabel: string
  works: WorkItem[]
  selectedProjectIndex: number | null
  selectedProjectTitle: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [index: number]
}>()
</script>

<template>
  <section class="mt-4 rounded-2xl border border-[#2d2d2d] bg-[#151515] p-3.5 sm:p-4">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <p class="text-xs uppercase tracking-[0.11em] text-zinc-500">{{ props.projectSelectorLabel }}</p>
      <p class="text-xs text-zinc-400">{{ props.projectSelectorHint }}</p>
    </div>

    <div class="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <button
        v-for="(work, workIndex) in props.works"
        :key="`retro-work-${work.title}`"
        type="button"
        class="rounded-xl border p-3 text-left transition"
        :class="
          props.selectedProjectIndex === workIndex
            ? 'border-zinc-100 bg-[#202020] shadow-[0_14px_28px_rgba(0,0,0,0.28)]'
            : 'border-[#2f2f2f] bg-[#1a1a1a] hover:border-[#4a4a4a] hover:bg-[#202020]'
        "
        :aria-pressed="props.selectedProjectIndex === workIndex"
        @click="emit('select', workIndex)"
      >
        <p class="text-sm font-semibold text-zinc-100">{{ work.title }}</p>
        <p class="mt-1 text-xs text-zinc-400">{{ work.summary }}</p>
        <p class="mt-2 text-xs text-zinc-300">{{ work.impact }}</p>
      </button>
    </div>
  </section>

  <div
    class="mt-4 flex items-center justify-between gap-2 rounded-xl border border-[#2d2d2d] bg-[#141414] px-3 py-2.5"
  >
    <p class="text-sm font-semibold text-zinc-100">{{ props.retrospectiveHeadingLabel }}</p>
    <p v-if="props.selectedProjectTitle" class="text-xs text-zinc-400">{{ props.selectedProjectTitle }}</p>
  </div>
</template>
