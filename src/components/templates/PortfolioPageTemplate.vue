<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { portfolioCopyByLocale } from '@/data/portfolio/copy'
import { profileShowcaseByLocale } from '@/data/portfolio/profileShowcase'
import { stackTickerByLocale } from '@/data/stack/stackTicker'
import { useLocale } from '@/composables/useLocale'
import PortfolioAwardsSection from '@/components/organisms/PortfolioAwardsSection.vue'
import PortfolioContactSection from '@/components/organisms/PortfolioContactSection.vue'
import PortfolioHeroSection from '@/components/organisms/PortfolioHeroSection.vue'
import PortfolioPrinciplesSection from '@/components/organisms/PortfolioPrinciplesSection.vue'
import PortfolioWorkSection from '@/components/organisms/PortfolioWorkSection.vue'

const { locale } = useLocale()

const copy = computed(() => portfolioCopyByLocale[locale.value])
const profileShowcase = computed(() => profileShowcaseByLocale[locale.value])
const stackTicker = computed(() => stackTickerByLocale[locale.value])
const metricDisplayValues = ref<string[]>([])
const currentYear = new Date().getFullYear()
const showIntro = ref(false)

const viewportWidth = ref(1280)
const viewportHeight = ref(800)
const isStandaloneMode = ref(false)

let displayModeQuery: MediaQueryList | null = null
let handleDisplayModeChange: ((event: MediaQueryListEvent) => void) | null = null
let introTimer: ReturnType<typeof setTimeout> | undefined
let metricRaf: number | undefined

const INTRO_DURATION_MS = 1450
const METRIC_DURATION_MS = 1050
const SECTION_REVEAL_INTERVAL_MS = 95

const parseMetric = (rawValue: string) => {
  const match = rawValue.match(/^(.*?)(\d+(?:\.\d+)?)(.*)$/)

  if (!match) {
    return null
  }

  const [, prefix = '', numberPart = '0', suffix = ''] = match
  const decimalDigits = numberPart.includes('.') ? (numberPart.split('.')[1]?.length ?? 0) : 0

  return {
    prefix,
    target: Number(numberPart),
    suffix,
    decimalDigits,
  }
}

const runMetricCounter = () => {
  if (metricRaf) {
    cancelAnimationFrame(metricRaf)
  }

  const parsedMetrics = copy.value.metrics.map((metric) => parseMetric(metric.value))

  metricDisplayValues.value = copy.value.metrics.map((metric, index) => {
    const parsed = parsedMetrics[index]

    if (!parsed) {
      return metric.value
    }

    const initial = parsed.decimalDigits > 0 ? (0).toFixed(parsed.decimalDigits) : '0'
    return `${parsed.prefix}${initial}${parsed.suffix}`
  })

  const start = performance.now()

  const animate = (now: number) => {
    const progress = Math.min((now - start) / METRIC_DURATION_MS, 1)
    const eased = 1 - (1 - progress) ** 3

    metricDisplayValues.value = copy.value.metrics.map((metric, index) => {
      const parsed = parsedMetrics[index]

      if (!parsed) {
        return metric.value
      }

      const current =
        parsed.decimalDigits > 0
          ? (parsed.target * eased).toFixed(parsed.decimalDigits)
          : String(Math.round(parsed.target * eased))

      return `${parsed.prefix}${current}${parsed.suffix}`
    })

    if (progress < 1) {
      metricRaf = requestAnimationFrame(animate)
      return
    }

    metricDisplayValues.value = copy.value.metrics.map((metric) => metric.value)
    metricRaf = undefined
  }

  metricRaf = requestAnimationFrame(animate)
}

const getSectionRevealStyle = (sectionIndex: number) => {
  const introOffset = showIntro.value ? Math.max(INTRO_DURATION_MS - 220, 0) : 0
  const delay = introOffset + Math.min(sectionIndex, 9) * SECTION_REVEAL_INTERVAL_MS

  return {
    '--section-reveal-delay': `${delay}ms`,
  }
}

const syncViewport = () => {
  viewportWidth.value = window.innerWidth
  viewportHeight.value = window.innerHeight
}

onMounted(() => {
  syncViewport()

  displayModeQuery = window.matchMedia('(display-mode: standalone)')
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const iosStandalone = Boolean(
    (window.navigator as Navigator & { standalone?: boolean }).standalone,
  )

  isStandaloneMode.value = displayModeQuery.matches || iosStandalone

  handleDisplayModeChange = (event) => {
    isStandaloneMode.value = event.matches
  }

  displayModeQuery.addEventListener?.('change', handleDisplayModeChange)
  window.addEventListener('resize', syncViewport)

  const introDuration = reducedMotion ? 700 : INTRO_DURATION_MS
  showIntro.value = true
  introTimer = setTimeout(() => {
    showIntro.value = false
  }, introDuration)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncViewport)

  if (displayModeQuery && handleDisplayModeChange) {
    displayModeQuery.removeEventListener?.('change', handleDisplayModeChange)
  }

  if (introTimer) {
    clearTimeout(introTimer)
  }

  if (metricRaf) {
    cancelAnimationFrame(metricRaf)
  }
})

const isAppLayout = computed(
  () => isStandaloneMode.value || (viewportWidth.value <= 560 && viewportHeight.value >= 620),
)

watch(
  () => copy.value.metrics.map((metric) => metric.value).join('|'),
  () => {
    runMetricCounter()
  },
  { immediate: true },
)
</script>

<template>
  <div
    class="relative isolate mx-auto w-full px-4 pt-5"
    :class="isAppLayout ? 'max-w-[430px] pb-24 sm:px-4' : 'max-w-[1480px] pb-14 sm:px-8 lg:px-12'"
  >
    <div
      aria-hidden="true"
      class="pointer-events-none fixed inset-0 -z-10 [mask-image:linear-gradient(180deg,rgba(0,0,0,0.88),rgba(0,0,0,0.42))]"
      :class="
        isAppLayout
          ? 'bg-[radial-gradient(circle_at_50%_-10%,rgba(255,255,255,0.09),transparent_36%),radial-gradient(circle_at_50%_110%,rgba(255,255,255,0.06),transparent_34%)]'
          : 'bg-[radial-gradient(circle_at_18%_-4%,rgba(255,255,255,0.08),transparent_30%),radial-gradient(circle_at_82%_108%,rgba(255,255,255,0.07),transparent_34%)]'
      "
    ></div>

    <main
      :class="
        isAppLayout
          ? 'rounded-[26px] border border-[#2a2a2a] bg-[#111111cf] p-3 shadow-[0_22px_60px_rgba(0,0,0,0.45)]'
          : ''
      "
    >
      <div class="section-reveal" :style="getSectionRevealStyle(0)">
        <PortfolioHeroSection
          :copy="copy"
          :profile-showcase="profileShowcase"
          :stack-kicker="stackTicker.kicker"
          :stack-items="stackTicker.items"
          :metrics="copy.metrics"
          :metric-display-values="metricDisplayValues"
          :is-app-layout="isAppLayout"
        />
      </div>
      <div class="section-reveal" :style="getSectionRevealStyle(1)">
        <PortfolioWorkSection :copy="copy" :is-app-layout="isAppLayout" />
      </div>
      <div class="section-reveal" :style="getSectionRevealStyle(2)">
        <PortfolioAwardsSection :profile-showcase="profileShowcase" :is-app-layout="isAppLayout" />
      </div>
      <div class="section-reveal" :style="getSectionRevealStyle(3)">
        <PortfolioPrinciplesSection :copy="copy" :is-app-layout="isAppLayout" />
      </div>
      <div class="section-reveal" :style="getSectionRevealStyle(4)">
        <PortfolioContactSection :copy="copy" :is-app-layout="isAppLayout" />
      </div>
    </main>

    <footer
      class="section-reveal"
      :style="getSectionRevealStyle(5)"
      :class="isAppLayout ? 'mt-4 text-center' : 'mt-5 text-center'"
    >
      <p class="text-sm text-zinc-500">© {{ currentYear }} {{ copy.footerName }}</p>
    </footer>
  </div>
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
