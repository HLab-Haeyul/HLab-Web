<script setup lang="ts">
import type { PortfolioCopySet } from '@/data/portfolio/types'
import PortfolioWorkCard from '@/components/molecules/PortfolioWorkCard.vue'

defineProps<{
  copy: PortfolioCopySet
  isAppLayout: boolean
}>()
</script>

<template>
  <section id="work" :class="isAppLayout ? 'mt-10' : 'mt-12 md:mt-20'">
    <div>
      <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">{{ copy.workKicker }}</p>
      <h2
        class="mt-3 max-w-[26ch] break-keep leading-[1.05] text-zinc-100 [font-family:var(--font-display)]"
        :class="isAppLayout ? 'text-[clamp(1.35rem,5.2vw,1.7rem)]' : 'text-[clamp(1.6rem,3.6vw,2.8rem)]'"
      >
        {{ copy.workHeading }}
      </h2>
    </div>

    <div class="mt-5 grid grid-cols-1 gap-3" :class="isAppLayout ? '' : 'md:grid-cols-2 xl:grid-cols-3'">
      <PortfolioWorkCard v-for="work in copy.works" :key="work.title" :work="work" />
    </div>
  </section>
</template>
