<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  PortfolioAwardsSection,
  PortfolioCareerTimelineSection,
  PortfolioCertificatesSection,
  PortfolioHeroSection,
  PortfolioMetricsSection,
  PortfolioPrinciplesSection,
  PortfolioStackTickerSection,
} from '@/widgets/portfolio'
import { useAppLayout } from '@/shared/lib/layout'
import { usePortfolioCertificates } from '@/entities/certificate'
import { usePortfolioMetrics } from '@/features/portfolio/metrics'
import { usePortfolioProfileContent } from '@/entities/profile'
import { useLocale } from '@/shared/lib/routing'
import { SceneDivider } from '@/shared/ui'
import PublicPageLayout from '@/widgets/public-layout'

const { locale } = useLocale()
const { certificatesCopy } = usePortfolioCertificates(locale)
const { careerTimeline, portfolioCopy, profileShowcase, stackTicker } =
  usePortfolioProfileContent(locale)
const { metricDisplayValues } = usePortfolioMetrics({
  locale,
  careerTimeline,
})

const copy = portfolioCopy
const tickerLoopItems = computed(() => [...stackTicker.value.items, ...stackTicker.value.items])
const currentYear = new Date().getFullYear()
const showIntro = ref(false)
const { isAppLayout } = useAppLayout()

let introTimer: ReturnType<typeof setTimeout> | undefined

const INTRO_DURATION_MS = 1450
const SECTION_REVEAL_INTERVAL_MS = 95

const getSectionRevealStyle = (sectionIndex: number) => {
  const introOffset = showIntro.value ? Math.max(INTRO_DURATION_MS - 220, 0) : 0
  const delay = introOffset + Math.min(sectionIndex, 9) * SECTION_REVEAL_INTERVAL_MS

  return {
    '--section-reveal-delay': `${delay}ms`,
  }
}

onMounted(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const introDuration = reducedMotion ? 700 : INTRO_DURATION_MS
  showIntro.value = true
  introTimer = setTimeout(() => {
    showIntro.value = false
  }, introDuration)
})

onBeforeUnmount(() => {
  if (introTimer) {
    clearTimeout(introTimer)
  }
})
</script>

<template>
  <PublicPageLayout bottom-spacing="roomy">
    <div :class="isAppLayout ? 'mx-auto max-w-[430px]' : ''">
      <main class="space-y-0">
        <section class="section-reveal" :style="getSectionRevealStyle(0)">
          <PortfolioHeroSection
            :copy="copy"
            :profile-showcase="profileShowcase"
            :is-app-layout="isAppLayout"
          />
          <PortfolioMetricsSection
            :metrics="copy.metrics"
            :metric-display-values="metricDisplayValues"
            :is-app-layout="isAppLayout"
          />
          <PortfolioStackTickerSection
            :ticker-loop-items="tickerLoopItems"
            :is-app-layout="isAppLayout"
          />
        </section>

        <div class="section-reveal" :style="getSectionRevealStyle(2)">
          <SceneDivider
            variant="tree"
            :compact="isAppLayout"
            class="mx-auto mb-[-1.5rem] md:mb-[-2.5rem]"
          />
          <PortfolioPrinciplesSection :copy="copy" :is-app-layout="isAppLayout" />
        </div>
        <div class="section-reveal" :style="getSectionRevealStyle(3)">
          <SceneDivider
            variant="stones"
            :compact="isAppLayout"
            class="mx-auto mb-[-1.25rem] md:mb-[-2rem]"
          />
          <PortfolioCareerTimelineSection
            :profile-showcase="profileShowcase"
            :is-app-layout="isAppLayout"
          />
        </div>
        <div class="section-reveal" :style="getSectionRevealStyle(4)">
          <SceneDivider
            variant="beacon"
            :compact="isAppLayout"
            class="mx-auto mb-[-1.5rem] md:mb-[-2.25rem]"
          />
          <PortfolioAwardsSection :profile-showcase="profileShowcase" :is-app-layout="isAppLayout" />
        </div>
        <div class="section-reveal" :style="getSectionRevealStyle(5)">
          <SceneDivider
            variant="tree"
            :compact="isAppLayout"
            class="mx-auto mb-[-1.5rem] md:mb-[-2.75rem]"
          />
          <PortfolioCertificatesSection :copy="certificatesCopy" :is-app-layout="isAppLayout" />
        </div>
      </main>

      <footer
        class="section-reveal"
        :style="getSectionRevealStyle(6)"
        :class="isAppLayout ? 'mt-4 text-center' : 'mt-5 text-center'"
      >
        <p class="text-sm text-zinc-500">© {{ currentYear }} {{ copy.footerName }}</p>
      </footer>
    </div>
  </PublicPageLayout>
</template>

<style scoped>
.section-reveal {
  opacity: 0;
  transform: translateY(12px);
  animation: section-fade-up 560ms cubic-bezier(0.22, 0.8, 0.2, 1) forwards;
  animation-delay: var(--section-reveal-delay, 0ms);
}

@keyframes section-fade-up {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .section-reveal {
    opacity: 1;
    transform: none;
    animation: none;
  }
}
</style>
