<script setup lang="ts">
import type { PortfolioCopySet } from '../../data/portfolio/types'

defineProps<{
  copy: PortfolioCopySet
  isAppLayout: boolean
}>()
</script>

<template>
  <section
    id="contact"
    class="mt-12 rounded-2xl border border-[#303030] bg-gradient-to-br from-[#141414] to-[#101010] p-5"
    :class="isAppLayout ? '' : 'md:mt-20'"
  >
    <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">{{ copy.contactKicker }}</p>
    <h2
      class="mt-3 max-w-[26ch] leading-[1.08] text-zinc-100 [font-family:var(--font-display)]"
      :class="isAppLayout ? 'text-[clamp(1.3rem,5vw,1.6rem)]' : 'text-[clamp(1.5rem,3.1vw,2.3rem)]'"
    >
      {{ copy.contactHeading }}
    </h2>

    <div :class="isAppLayout ? 'mt-5 grid grid-cols-1 gap-2' : 'mt-6 flex flex-wrap gap-3'">
      <a
        class="inline-flex items-center justify-center rounded-full bg-white px-4 py-3 text-sm font-semibold !text-[#0f0f0f] transition hover:!text-[#0f0f0f]"
        :class="isAppLayout ? 'w-full' : 'min-w-40'"
        href="kimminje661@outlook.kr"
      >
        {{ copy.emailCta }}
      </a>
      <a
        class="inline-flex items-center justify-center rounded-full border border-[#2a2a2a] px-4 py-3 text-sm font-semibold text-zinc-100 transition"
        :class="isAppLayout ? 'w-full' : 'min-w-40'"
        href="https://github.com/fixgramwork"
        target="_blank"
        rel="noopener"
      >
        {{ copy.githubCta }}
      </a>
    </div>
  </section>
</template>
