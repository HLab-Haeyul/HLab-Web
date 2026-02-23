<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { portfolioCopyByLocale } from '@/data/portfolio/copy'
import { profileShowcaseByLocale } from '@/data/portfolio/profileShowcase'
import { stackTickerByLocale } from '@/data/stack/stackTicker'
import { useLocale } from '@/composables/useLocale'
import PortfolioAwardsSection from '@/components/organisms/PortfolioAwardsSection.vue'
import PortfolioContactSection from '@/components/organisms/PortfolioContactSection.vue'
import PortfolioHeroSection from '@/components/organisms/PortfolioHeroSection.vue'
import PortfolioMetricsSection from '@/components/organisms/PortfolioMetricsSection.vue'
import PortfolioPrinciplesSection from '@/components/organisms/PortfolioPrinciplesSection.vue'
import PortfolioStackTickerSection from '@/components/organisms/PortfolioStackTickerSection.vue'
import PortfolioWorkSection from '@/components/organisms/PortfolioWorkSection.vue'

const { locale } = useLocale()

const copy = computed(() => portfolioCopyByLocale[locale.value])
const profileShowcase = computed(() => profileShowcaseByLocale[locale.value])
const stackTicker = computed(() => stackTickerByLocale[locale.value])
const tickerLoopItems = computed(() => [...stackTicker.value.items, ...stackTicker.value.items])
const metricDisplayValues = ref<string[]>([])
const currentYear = new Date().getFullYear()
const showIntro = ref(false)

const introKicker = computed(() => (locale.value === 'ko' ? 'INITIAL RENDER' : 'INITIAL RENDER'))
const introSubtitle = computed(() =>
  locale.value === 'ko' ? '페이지를 준비하고 있습니다' : 'Preparing your portfolio experience',
)

const viewportWidth = ref(1280)
const viewportHeight = ref(800)
const isStandaloneMode = ref(false)

let displayModeQuery: MediaQueryList | null = null
let handleDisplayModeChange: ((event: MediaQueryListEvent) => void) | null = null
let introTimer: ReturnType<typeof setTimeout> | undefined
let metricRaf: number | undefined

const INTRO_DURATION_MS = 1450
const INTRO_STORAGE_KEY = 'portfolio_intro_seen'
const METRIC_DURATION_MS = 1050

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

const syncViewport = () => {
  viewportWidth.value = window.innerWidth
  viewportHeight.value = window.innerHeight
}

onMounted(() => {
  syncViewport()

  displayModeQuery = window.matchMedia('(display-mode: standalone)')
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const hasSeenIntro = window.sessionStorage.getItem(INTRO_STORAGE_KEY) === '1'
  const iosStandalone = Boolean(
    (window.navigator as Navigator & { standalone?: boolean }).standalone,
  )

  isStandaloneMode.value = displayModeQuery.matches || iosStandalone

  handleDisplayModeChange = (event) => {
    isStandaloneMode.value = event.matches
  }

  displayModeQuery.addEventListener?.('change', handleDisplayModeChange)
  window.addEventListener('resize', syncViewport)

  if (!reducedMotion && !hasSeenIntro) {
    showIntro.value = true
    introTimer = setTimeout(() => {
      showIntro.value = false
      window.sessionStorage.setItem(INTRO_STORAGE_KEY, '1')
    }, INTRO_DURATION_MS)
  }
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

  document.body.style.overflow = ''
  document.documentElement.style.overflow = ''
})

const isAppLayout = computed(
  () => isStandaloneMode.value || (viewportWidth.value <= 560 && viewportHeight.value >= 620),
)

watch(showIntro, (introOpen) => {
  const value = introOpen ? 'hidden' : ''
  document.body.style.overflow = value
  document.documentElement.style.overflow = value
})

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
    :class="isAppLayout ? 'max-w-[430px] pb-24 sm:px-4' : 'max-w-[1220px] pb-14 sm:px-8 lg:px-12'"
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

    <Transition name="intro-fade">
      <section v-if="showIntro" class="intro-overlay" aria-label="Intro overlay">
        <div class="intro-card">
          <p class="intro-kicker">{{ introKicker }}</p>
          <h1 class="intro-brand">KIMMINJAE</h1>
          <p class="intro-subtitle">{{ introSubtitle }}</p>
          <div class="intro-meter"><span></span></div>
        </div>
      </section>
    </Transition>

    <main
      :class="
        isAppLayout
          ? 'rounded-[26px] border border-[#2a2a2a] bg-[#111111cf] p-3 shadow-[0_22px_60px_rgba(0,0,0,0.45)]'
          : ''
      "
    >
      <PortfolioHeroSection :copy="copy" :profile-showcase="profileShowcase" :is-app-layout="isAppLayout" />
      <PortfolioMetricsSection
        :metrics="copy.metrics"
        :metric-display-values="metricDisplayValues"
        :is-app-layout="isAppLayout"
      />
      <PortfolioStackTickerSection :ticker-loop-items="tickerLoopItems" :is-app-layout="isAppLayout" />
      <PortfolioAwardsSection :profile-showcase="profileShowcase" :is-app-layout="isAppLayout" />
      <PortfolioWorkSection :copy="copy" :is-app-layout="isAppLayout" />
      <PortfolioPrinciplesSection :copy="copy" :is-app-layout="isAppLayout" />
      <PortfolioContactSection :copy="copy" :is-app-layout="isAppLayout" />
    </main>

    <footer :class="isAppLayout ? 'mt-4 text-center' : 'mt-5 text-center'">
      <p class="text-sm text-zinc-500">© {{ currentYear }} {{ copy.footerName }}</p>
    </footer>
  </div>
</template>

<style scoped>
.intro-overlay {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: grid;
  place-items: center;
  padding: 1.25rem;
  background:
    radial-gradient(circle at 50% -10%, rgba(255, 255, 255, 0.12), transparent 42%),
    radial-gradient(circle at 50% 110%, rgba(255, 255, 255, 0.08), transparent 34%),
    linear-gradient(165deg, #0f0f0f 0%, #111111 52%, #121212 100%);
}

.intro-card {
  width: min(560px, 100%);
  border: 1px solid #2a2a2a;
  border-radius: 1rem;
  background: rgba(18, 18, 18, 0.86);
  padding: clamp(1.25rem, 4vw, 2rem);
  backdrop-filter: blur(10px);
}

.intro-kicker {
  margin: 0;
  color: #71717a;
  font-size: 0.72rem;
  letter-spacing: 0.14em;
}

.intro-brand {
  margin: 0.35rem 0 0;
  color: #ffffff;
  font-size: clamp(1.45rem, 6vw, 2.35rem);
  letter-spacing: 0.08em;
  animation: intro-rise 620ms cubic-bezier(0.2, 0.82, 0.2, 1) both;
}

.intro-subtitle {
  margin: 0.42rem 0 0;
  color: #a1a1aa;
  font-size: 0.9rem;
}

.intro-meter {
  margin-top: 0.95rem;
  height: 2px;
  border-radius: 999px;
  background: #27272a;
  overflow: hidden;
}

.intro-meter span {
  display: block;
  width: 100%;
  height: 100%;
  transform-origin: left center;
  background: linear-gradient(90deg, #fafafa, #a1a1aa);
  animation: intro-progress 1.25s linear both;
}

.intro-fade-leave-active {
  transition:
    opacity 420ms ease,
    transform 420ms ease;
}

.intro-fade-leave-from {
  opacity: 1;
  transform: scale(1);
}

.intro-fade-leave-to {
  opacity: 0;
  transform: scale(1.01);
}

@keyframes intro-rise {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes intro-progress {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .intro-brand,
  .intro-meter span {
    animation: none;
  }
}
</style>
