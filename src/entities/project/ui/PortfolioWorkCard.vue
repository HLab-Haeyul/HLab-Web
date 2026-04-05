<script setup lang="ts">
import type { WorkItem } from '@/entities/portfolio'

defineProps<{
  work: WorkItem
}>()
</script>

<template>
  <article
    class="ui-surface-panel group flex flex-col gap-2 rounded-xl p-3 transition hover:-translate-y-0.5 hover:border-[var(--line-muted)]"
  >
    <figure class="ui-surface-card-soft relative overflow-hidden rounded-xl">
      <img
        v-if="work.imageSrc"
        :src="work.imageSrc"
        :alt="work.imageAlt ?? work.title"
        class="h-28 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        loading="lazy"
      />
      <div
        v-else
        class="flex h-28 w-full items-center justify-center bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_45%),linear-gradient(160deg,#1a1a1a,#141414)] px-3 text-center text-sm text-zinc-300"
      >
        {{ work.title }}
      </div>
    </figure>

    <h3 class="text-base text-white">{{ work.title }}</h3>
    <p class="text-sm text-zinc-300">{{ work.summary }}</p>
    <strong class="text-xs text-zinc-200">{{ work.impact }}</strong>

    <ul class="mt-1 flex flex-wrap gap-1.5">
      <li
        v-for="item in work.stack"
        :key="`${work.title}-${item}`"
        class="ui-surface-chip rounded-full px-1.5 py-0.5 text-xs"
      >
        {{ item }}
      </li>
    </ul>
  </article>
</template>
