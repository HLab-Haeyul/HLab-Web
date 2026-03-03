<script setup lang="ts">
import type { ExperienceItem } from '@/data/portfolio/types'
import AwardYearBadge from '@/components/atoms/AwardYearBadge.vue'
import TimelineDot from '@/components/atoms/TimelineDot.vue'

defineProps<{
  experience: ExperienceItem
  /** 0-based index for alternating left/right layout */
  index: number
}>()
</script>

<template>
  <li class="relative pl-7 pb-5 last:pb-0 md:pl-0 md:pb-6">
    <TimelineDot :index="index" />

    <div
      class="rounded-xl border border-[#242424] bg-[#101010] px-3 py-3"
      :class="index % 2 === 0 ? 'md:mr-[calc(50%+2rem)]' : 'md:ml-[calc(50%+2rem)]'"
    >
      <div class="flex items-start justify-between gap-3">
        <p class="text-sm font-medium text-zinc-200">{{ experience.title }}</p>
        <AwardYearBadge :year="experience.year" />
      </div>

      <p class="mt-1 text-xs text-zinc-500">{{ experience.organizer }}</p>
      <p class="mt-2 text-xs leading-relaxed text-zinc-300">{{ experience.description }}</p>
    </div>
  </li>
</template>
