<script setup lang="ts">
import type { StackTickerItem } from '@/entities/stack'
import { SkillIcon } from '@/shared/ui'

defineProps<{
  tickerLoopItems: StackTickerItem[]
  isAppLayout: boolean
}>()
</script>

<template>
  <section :class="isAppLayout ? 'mt-5' : 'mt-6'">
    <div class="relative w-full max-w-full overflow-hidden">
      <div class="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[var(--surface-card)] to-transparent"></div>
      <div class="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[var(--surface-card)] to-transparent"></div>

      <div
        class="stack-ticker-track flex w-max items-center gap-2 py-3"
        :style="{ animationDuration: isAppLayout ? '20s' : '26s' }"
      >
        <article
          v-for="(item, index) in tickerLoopItems"
          :key="`${item.label}-${index}`"
          class="ui-surface-chip shrink-0 flex items-center gap-2 rounded-full px-3 py-1.5"
        >
          <SkillIcon
            :image-src="item.imageSrc"
            :image-alt="item.imageAlt"
            :icon="item.icon"
            :label="item.label"
            image-class="h-4 w-4 object-contain"
            icon-class="text-base leading-none"
          />
          <span class="text-sm text-zinc-200">{{ item.label }}</span>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stack-ticker-track {
  animation-name: ticker-marquee;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes ticker-marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .stack-ticker-track {
    animation: none;
  }
}
</style>
