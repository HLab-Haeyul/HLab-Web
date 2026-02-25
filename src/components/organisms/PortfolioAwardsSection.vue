<script setup lang="ts">
import type { ProfileShowcaseCopy } from '@/data/portfolio/types'
import AwardTimelineCard from '@/components/molecules/AwardTimelineCard.vue'

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
        :class="
          isAppLayout ? 'text-[clamp(1.3rem,5vw,1.6rem)]' : 'text-[clamp(1.5rem,3.1vw,2.2rem)]'
        "
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
          <AwardTimelineCard
            v-for="(award, awardIndex) in profileShowcase.awards"
            :key="`${award.year}-${award.title}`"
            :award="award"
            :index="awardIndex"
          />
        </ul>
      </div>
    </article>
  </section>
</template>
