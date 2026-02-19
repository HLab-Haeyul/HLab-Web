<script setup lang="ts">
import type { PortfolioCopySet } from '../../data/portfolio/types'

defineProps<{
  copy: PortfolioCopySet
  isAppLayout: boolean
}>()
</script>

<template>
  <section
    id="principles"
    class="mt-12 grid grid-cols-1 gap-3"
    :class="isAppLayout ? '' : 'md:mt-20 lg:grid-cols-[1.2fr_0.8fr]'"
  >
    <article class="rounded-2xl border border-[#2a2a2a] bg-[#141414] p-4">
      <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">{{ copy.principlesKicker }}</p>
      <h2
        class="mt-3 text-zinc-100 [font-family:var(--font-display)]"
        :class="isAppLayout ? 'text-[clamp(1.3rem,5vw,1.6rem)]' : 'text-[clamp(1.5rem,3.1vw,2.3rem)]'"
      >
        {{ copy.principlesHeading }}
      </h2>
      <p class="mt-4 max-w-[58ch] text-zinc-300">{{ copy.principlesBody }}</p>
    </article>

    <article class="rounded-2xl border border-[#2a2a2a] bg-[#141414] p-4">
      <ul class="grid gap-3">
        <li
          v-for="rule in copy.principles"
          :key="rule"
          class="border-l-2 border-[#2c2c2c] pl-3 text-[15px] text-zinc-200"
        >
          {{ rule }}
        </li>
      </ul>
    </article>
  </section>
</template>
