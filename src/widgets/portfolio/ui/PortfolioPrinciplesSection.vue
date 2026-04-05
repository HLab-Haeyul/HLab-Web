<script setup lang="ts">
import type { PortfolioCopySet } from '@/entities/portfolio'

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
    <article class="border-t border-[var(--line-strong)] pt-4">
      <p class="ui-type-kicker text-zinc-500">{{ copy.principlesKicker }}</p>
      <h2
        class="mt-3 text-zinc-100"
        :class="isAppLayout ? 'ui-type-title-sm-compact' : 'ui-type-title-md'"
      >
        {{ copy.principlesHeading }}
      </h2>
      <p class="ui-type-body mt-4 max-w-[58ch] text-zinc-300">{{ copy.principlesBody }}</p>
    </article>

    <article class="border-t border-[var(--line-strong)] pt-4">
      <ul class="grid gap-3">
        <li
          v-for="rule in copy.principles"
          :key="rule"
          class="ui-type-body border-l-2 border-[var(--line-muted)] pl-3 text-zinc-200"
        >
          {{ rule }}
        </li>
      </ul>
    </article>
  </section>
</template>
