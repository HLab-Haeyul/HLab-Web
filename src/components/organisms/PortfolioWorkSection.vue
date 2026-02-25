<script setup lang="ts">
import { useLocale } from '@/composables/useLocale'
import type { PortfolioCopySet } from '@/data/portfolio/types'
import PortfolioWorkCard from '@/components/molecules/PortfolioWorkCard.vue'

defineProps<{
  copy: PortfolioCopySet
  isAppLayout: boolean
}>()

const { projectPath } = useLocale()

const getWorkCardRevealStyle = (index: number) => ({
  '--work-card-delay': `${Math.min(index, 11) * 55}ms`,
})
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
      <RouterLink
        v-for="(work, workIndex) in copy.works"
        :key="work.title"
        :to="{
          path: projectPath,
          query: { project: String(workIndex) },
          hash: '#project-detail',
        }"
        class="work-card-reveal block"
        :style="getWorkCardRevealStyle(workIndex)"
        :aria-label="`${work.title} 프로젝트 상세 보기`"
      >
        <PortfolioWorkCard :work="work" />
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.work-card-reveal {
  opacity: 0;
  transform: translateY(10px);
  animation: work-card-rise 520ms cubic-bezier(0.22, 0.8, 0.2, 1) forwards;
  animation-delay: var(--work-card-delay, 0ms);
}

@keyframes work-card-rise {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .work-card-reveal {
    opacity: 1;
    transform: none;
    animation: none;
  }
}
</style>
