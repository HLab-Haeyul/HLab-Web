<script setup lang="ts">
import type { ProfileShowcaseCopy } from '@/data/portfolio/types'

defineProps<{
  profileShowcase: ProfileShowcaseCopy
  isAppLayout: boolean
}>()
</script>

<template>
  <section id="hobbies" class="mt-12" :class="isAppLayout ? '' : 'md:mt-20'">
    <article class="rounded-2xl border border-[#2a2a2a] bg-[#131313] p-4">
      <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">{{ profileShowcase.hobbiesTitle }}</p>

      <div v-if="profileShowcase.hobbies.length > 0" class="mt-3 rounded-lg border border-[#242424] bg-[#101010]">
        <ul class="divide-y divide-[#242424]">
          <li
            v-for="(hobby, hobbyIndex) in profileShowcase.hobbies"
            :key="`hobby-${hobbyIndex}-${hobby.name}`"
            class="px-3 py-2.5"
          >
            <p class="text-xs font-medium text-zinc-200">{{ hobby.name }}</p>
            <p class="mt-0.5 text-[11px] text-zinc-500">{{ hobby.description }}</p>
          </li>
        </ul>
      </div>

      <p v-else class="mt-4 text-xs text-zinc-500">{{ profileShowcase.hobbiesEmptyLabel }}</p>
    </article>
  </section>
</template>
