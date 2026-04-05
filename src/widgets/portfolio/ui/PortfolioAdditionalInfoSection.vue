<script setup lang="ts">
import type { ProfileShowcaseCopy } from '@/data/portfolio/types'
import ExperienceTimelineCard from '@/components/molecules/ExperienceTimelineCard.vue'

defineProps<{
  profileShowcase: ProfileShowcaseCopy
  isAppLayout: boolean
}>()
</script>

<template>
  <section id="additional-info" class="mt-12" :class="isAppLayout ? '' : 'md:mt-20'">
    <article class="rounded-2xl border border-[#2a2a2a] bg-[#131313] p-4">
      <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">{{ profileShowcase.experiencesTitle }}</p>

      <div v-if="profileShowcase.experiences.length > 0" class="relative mt-4">
        <span
          aria-hidden="true"
          class="pointer-events-none absolute inset-y-6 left-3 z-0 w-px bg-gradient-to-b from-transparent via-[#343434] to-transparent md:left-1/2 md:-translate-x-1/2"
        ></span>

        <ul>
          <ExperienceTimelineCard
            v-for="(experience, experienceIndex) in profileShowcase.experiences"
            :key="`experience-${experience.year}-${experience.title}`"
            :experience="experience"
            :index="experienceIndex"
          />
        </ul>
      </div>

      <p v-else class="mt-4 text-xs text-zinc-500">{{ profileShowcase.experiencesEmptyLabel }}</p>
    </article>
  </section>
</template>
