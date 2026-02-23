<script setup lang="ts">
import type { WorkItem } from '@/data/portfolio/types'

defineProps<{
  work: WorkItem
}>()
</script>

<template>
  <article
    class="group flex flex-col gap-3 rounded-2xl border border-[#2a2a2a] bg-gradient-to-br from-[#151515] to-[#121212] p-4 transition hover:-translate-y-1 hover:border-[#393939]"
  >
    <figure class="relative overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#101010]">
      <img
        v-if="work.imageSrc"
        :src="work.imageSrc"
        :alt="work.imageAlt ?? work.title"
        class="h-36 w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        loading="lazy"
      />
      <div
        v-else
        class="flex h-36 w-full items-center justify-center bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.14),transparent_45%),linear-gradient(160deg,#181818,#101010)] px-3 text-center text-sm text-zinc-300"
      >
        {{ work.title }}
      </div>
    </figure>

    <h3 class="text-lg text-white">{{ work.title }}</h3>
    <p class="text-[15px] text-zinc-300">{{ work.summary }}</p>
    <strong class="text-sm text-zinc-200">{{ work.impact }}</strong>

    <ul class="mt-1 flex flex-wrap gap-2">
      <li
        v-for="item in work.stack"
        :key="`${work.title}-${item}`"
        class="rounded-full border border-[#2f2f2f] px-2 py-1 text-xs text-zinc-500"
      >
        {{ item }}
      </li>
    </ul>
  </article>
</template>
