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
  <section class="mt-5 rounded-2xl border border-[#273346] bg-[#111a27] p-3.5 sm:p-4">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <p class="text-xs uppercase tracking-[0.11em] text-zinc-500">{{ props.projectSelectorLabel }}</p>
      <p class="text-xs text-zinc-500">{{ props.projectSelectorHint }}</p>
    </div>

    <div class="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <button
        v-for="(work, workIndex) in props.works"
        :key="`retro-work-${work.title}`"
        type="button"
        class="rounded-xl border p-3 text-left transition"
        :class="
          props.selectedProjectIndex === workIndex
            ? 'border-[#6f8fce] bg-[#14243d]'
            : 'border-[#2b384f] bg-[#0f1726] hover:border-[#3c4f6d] hover:bg-[#152134]'
        "
        :aria-pressed="props.selectedProjectIndex === workIndex"
        @click="emit('select', workIndex)"
      >
        <p class="text-sm font-semibold text-zinc-100">{{ work.title }}</p>
        <p class="mt-1 text-xs text-zinc-500">{{ work.summary }}</p>
        <p class="mt-2 text-xs text-zinc-300">{{ work.impact }}</p>
      </button>
    </div>
  </section>

  <div
    class="mt-4 flex items-center justify-between gap-2 rounded-xl border border-[#273346] bg-[#101827] px-3 py-2.5"
  >
    <p class="text-sm font-semibold text-zinc-100">{{ props.retrospectiveHeadingLabel }}</p>
    <p v-if="props.selectedProjectTitle" class="text-xs text-zinc-500">{{ props.selectedProjectTitle }}</p>
  </div>
</template>
