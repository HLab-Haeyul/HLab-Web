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
  <section class="mt-5 rounded-2xl border border-[#e8eef2] bg-[#fcfefe] p-3.5 sm:p-4">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <p class="text-xs uppercase tracking-[0.11em] text-[#868e96]">{{ props.projectSelectorLabel }}</p>
      <p class="text-xs text-[#868e96]">{{ props.projectSelectorHint }}</p>
    </div>

    <div class="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <button
        v-for="(work, workIndex) in props.works"
        :key="`retro-work-${work.title}`"
        type="button"
        class="rounded-xl border p-3 text-left transition"
        :class="
          props.selectedProjectIndex === workIndex
            ? 'border-[#12b886] bg-white shadow-[0_10px_20px_rgba(18,184,134,0.18)]'
            : 'border-[#e5eaed] bg-white hover:border-[#ced4da] hover:bg-[#f8fafb]'
        "
        :aria-pressed="props.selectedProjectIndex === workIndex"
        @click="emit('select', workIndex)"
      >
        <p class="text-sm font-semibold text-[#212529]">{{ work.title }}</p>
        <p class="mt-1 text-xs text-[#868e96]">{{ work.summary }}</p>
        <p class="mt-2 text-xs text-[#495057]">{{ work.impact }}</p>
      </button>
    </div>
  </section>

  <div
    class="mt-4 flex items-center justify-between gap-2 rounded-xl border border-[#e8eef2] bg-white px-3 py-2.5"
  >
    <p class="text-sm font-semibold text-[#212529]">{{ props.retrospectiveHeadingLabel }}</p>
    <p v-if="props.selectedProjectTitle" class="text-xs text-[#868e96]">{{ props.selectedProjectTitle }}</p>
  </div>
</template>
