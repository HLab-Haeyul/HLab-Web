<script setup lang="ts">
import type { CertificateItem } from '@/data/portfolio/types'
import AwardYearBadge from '@/components/atoms/AwardYearBadge.vue'
import TimelineDot from '@/components/atoms/TimelineDot.vue'

defineProps<{
  certificate: CertificateItem
  /** 0-based index for alternating left/right layout */
  index: number
  dateLabel: string
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
        <p class="text-sm font-medium text-zinc-200">{{ certificate.title }}</p>
        <AwardYearBadge :year="certificate.year" />
      </div>

      <p class="mt-1 text-xs text-zinc-500">{{ certificate.organizer }}</p>
      <p class="mt-2 text-xs leading-relaxed text-zinc-300">{{ certificate.description }}</p>
      <p class="mt-2 text-[11px] text-zinc-400">{{ dateLabel }}: {{ certificate.acquiredDate }}</p>

      <figure v-if="certificate.proofImageSrc" class="mt-3 overflow-hidden rounded-lg border border-[#2f2f2f] bg-[#0d0d0d]">
        <img
          :src="certificate.proofImageSrc"
          :alt="certificate.proofImageAlt || `${certificate.title} proof image`"
          class="h-40 w-full object-cover"
          loading="lazy"
        />
      </figure>
    </div>
  </li>
</template>
