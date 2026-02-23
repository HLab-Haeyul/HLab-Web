<script setup lang="ts">
import type { ProfileShowcaseCopy } from '@/data/portfolio/types'

defineProps<{
  profileShowcase: ProfileShowcaseCopy
  isAppLayout: boolean
}>()
</script>

<template>
  <section :class="isAppLayout ? 'mt-10' : 'mt-12 md:mt-16'">
    <div>
      <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">{{ profileShowcase.kicker }}</p>
      <h2
        class="mt-3 leading-[1.08] text-zinc-100 [font-family:var(--font-display)]"
        :class="isAppLayout ? 'text-[clamp(1.3rem,5vw,1.6rem)]' : 'text-[clamp(1.5rem,3.1vw,2.2rem)]'"
      >
        {{ profileShowcase.heading }}
      </h2>
    </div>

    <article class="mt-4 rounded-2xl border border-[#2a2a2a] bg-[#131313] p-4">
      <p class="text-sm text-zinc-400">{{ profileShowcase.awardsTitle }}</p>
      <div class="relative mt-4">
        <span
          aria-hidden="true"
          class="pointer-events-none absolute inset-y-6 left-3 z-0 w-px bg-gradient-to-b from-transparent via-[#343434] to-transparent md:left-1/2 md:-translate-x-1/2"
        ></span>

        <ul>
          <li
            v-for="(award, awardIndex) in profileShowcase.awards"
            :key="`${award.year}-${award.title}`"
            class="relative pl-7 pb-5 last:pb-0 md:pl-0 md:pb-6"
          >
            <span
              aria-hidden="true"
              class="absolute left-3 top-6 z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#8a8a8a] bg-[#131313] shadow-[0_0_0_6px_#131313] md:left-1/2"
            ></span>
            <span
              aria-hidden="true"
              class="absolute left-3 top-6 z-10 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-200 md:left-1/2"
            ></span>
            <span
              aria-hidden="true"
              class="pointer-events-none absolute top-6 z-0 hidden h-px -translate-y-1/2 bg-[#3a3a3a] md:block"
              :class="
                awardIndex % 2 === 0
                  ? 'right-[calc(50%+0.65rem)] w-6'
                  : 'left-[calc(50%+0.65rem)] w-6'
              "
            ></span>
            <div
              class="rounded-xl border border-[#242424] bg-[#101010] px-3 py-3"
              :class="awardIndex % 2 === 0 ? 'md:mr-[calc(50%+2rem)]' : 'md:ml-[calc(50%+2rem)]'"
            >
              <div class="flex items-start justify-between gap-3">
                <p class="text-sm font-medium text-zinc-200">{{ award.title }}</p>
                <span class="shrink-0 rounded-full border border-[#2f2f2f] px-2 py-0.5 text-[11px] text-zinc-500">
                  {{ award.year }}
                </span>
              </div>
              <p class="mt-1 text-xs text-zinc-500">{{ award.organizer }}</p>
            </div>
          </li>
        </ul>
      </div>
    </article>
  </section>
</template>
