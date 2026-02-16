<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { portfolioCopyByLocale } from '../features/portfolio/copy'
import { profileShowcaseByLocale } from '../features/portfolio/profileShowcase'
import { stackTickerByLocale } from '../features/portfolio/stackTicker'
import type { Locale } from '../features/portfolio/types'

const route = useRoute()
const locale = computed<Locale>(() => (route.path.startsWith('/en') ? 'en' : 'ko'))
const copy = computed(() => portfolioCopyByLocale[locale.value])
const profileShowcase = computed(() => profileShowcaseByLocale[locale.value])
const stackTicker = computed(() => stackTickerByLocale[locale.value])
const stackDetailPath = computed(() => (locale.value === 'en' ? '/en/stack' : '/ko/stack'))
const tickerLoopItems = computed(() => [...stackTicker.value.items, ...stackTicker.value.items])
const uploadedPhotoSrc = ref('')
const profilePhotoSrc = computed(() => uploadedPhotoSrc.value || profileShowcase.value.photoSrc)
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

const INTRO_DURATION_MS = 1450
const INTRO_STORAGE_KEY = 'portfolio_intro_seen'

const revokeUploadedPhotoUrl = () => {
  if (uploadedPhotoSrc.value.startsWith('blob:')) {
    URL.revokeObjectURL(uploadedPhotoSrc.value)
  }
}

const handleProfilePhotoChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    return
  }

  revokeUploadedPhotoUrl()
  uploadedPhotoSrc.value = URL.createObjectURL(file)
  input.value = ''
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

  revokeUploadedPhotoUrl()
  document.body.style.overflow = ''
  document.documentElement.style.overflow = ''
})

const isAppLayout = computed(
  () =>
    isStandaloneMode.value || (viewportWidth.value <= 560 && viewportHeight.value >= 620),
)

watch(showIntro, (introOpen) => {
  const value = introOpen ? 'hidden' : ''
  document.body.style.overflow = value
  document.documentElement.style.overflow = value
})
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
      <section :class="isAppLayout ? 'pt-1' : 'pt-2'">
        <p :class="isAppLayout ? 'text-[11px]' : 'text-xs'" class="uppercase tracking-[0.13em] text-zinc-500">
          {{ copy.eyebrow }}
        </p>
        <h1
          class="mt-3 max-w-[17ch] leading-[0.97] tracking-[-0.02em] text-white [font-family:var(--font-display)]"
          :class="isAppLayout ? 'text-[clamp(1.9rem,8vw,2.6rem)]' : 'text-[clamp(2.3rem,6vw,5.2rem)]'"
        >
          {{ copy.heroTitle }}
        </h1>
        <p :class="isAppLayout ? 'mt-4 text-[15px]' : 'mt-5 text-base'" class="max-w-[62ch] text-zinc-300">
          {{ copy.heroLead }}
        </p>
        <div :class="isAppLayout ? 'mt-5 grid grid-cols-1 gap-2' : 'mt-6 flex flex-wrap gap-3'">
          <a
            class="inline-flex items-center justify-center rounded-full bg-white px-4 py-3 text-sm font-semibold !text-[#0f0f0f] transition hover:-translate-y-0.5 hover:!text-[#0f0f0f]"
            :class="isAppLayout ? 'w-full' : 'min-w-40'"
            href="#work"
          >
            {{ copy.primaryCta }}
          </a>
          <a
            class="inline-flex items-center justify-center rounded-full border border-[#2a2a2a] px-4 py-3 text-sm font-semibold text-zinc-100 transition hover:-translate-y-0.5"
            :class="isAppLayout ? 'w-full' : 'min-w-40'"
            href="#contact"
          >
            {{ copy.secondaryCta }}
          </a>
        </div>
      </section>

      <section
        class="mt-8 grid gap-3"
        :class="isAppLayout ? 'grid-cols-2' : 'grid-cols-1 md:mt-12 md:grid-cols-3'"
      >
        <article
          v-for="item in copy.metrics"
          :key="item.label"
          class="rounded-2xl border border-[#2a2a2a] bg-[#141414] p-4"
        >
          <p class="text-sm text-zinc-500">{{ item.label }}</p>
          <strong :class="isAppLayout ? 'text-xl' : 'text-2xl'" class="mt-2 block text-white">
            {{ item.value }}
          </strong>
        </article>
      </section>

      <section :class="isAppLayout ? 'mt-10' : 'mt-12 md:mt-16'">
        <div>
          <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">{{ profileShowcase.kicker }}</p>
          <h2
            class="mt-3 leading-[1.08] text-zinc-100 [font-family:var(--font-display)]"
            :class="isAppLayout ? 'text-[clamp(1.3rem,5vw,1.6rem)]' : 'text-[clamp(1.5rem,3.1vw,2.2rem)]'"
          >
            {{ profileShowcase.heading }}
          </h2>
        </div>

        <div class="mt-4 grid grid-cols-1 gap-3" :class="isAppLayout ? '' : 'lg:grid-cols-[0.7fr_1.3fr]'">
          <article class="rounded-2xl border border-[#2a2a2a] bg-[#131313] p-4">
            <p class="text-sm text-zinc-400">{{ profileShowcase.photoTitle }}</p>

            <img
              v-if="profilePhotoSrc"
              :src="profilePhotoSrc"
              :alt="profileShowcase.photoAlt"
              class="mt-3 h-56 w-full rounded-xl object-cover"
            />
            <div
              v-else
              class="mt-3 flex h-56 w-full items-center justify-center rounded-xl border border-dashed border-[#313131] bg-[#101010] px-4 text-center text-sm text-zinc-500"
            >
              {{ profileShowcase.photoHint }}
            </div>

            <label
              class="mt-3 inline-flex cursor-pointer items-center justify-center rounded-full border border-[#2a2a2a] bg-[#101010] px-4 py-2.5 text-xs font-semibold text-zinc-200 transition hover:border-[#3a3a3a] hover:text-white"
            >
              <input class="sr-only" type="file" accept="image/*" @change="handleProfilePhotoChange" />
              {{ profileShowcase.photoUploadLabel }}
            </label>
            <p class="mt-2 text-xs text-zinc-500">{{ profileShowcase.photoUploadHint }}</p>
          </article>

          <article class="rounded-2xl border border-[#2a2a2a] bg-[#131313] p-4">
            <p class="text-sm text-zinc-400">{{ profileShowcase.awardsTitle }}</p>
            <ul class="mt-3 grid gap-3">
              <li
                v-for="award in profileShowcase.awards"
                :key="`${award.year}-${award.title}`"
                class="rounded-xl border border-[#242424] bg-[#101010] px-3 py-3"
              >
                <div class="flex items-start justify-between gap-3">
                  <p class="text-sm text-zinc-200">{{ award.title }}</p>
                  <span class="text-xs text-zinc-500">{{ award.year }}</span>
                </div>
                <p class="mt-1 text-xs text-zinc-500">{{ award.organizer }}</p>
              </li>
            </ul>
          </article>
        </div>
      </section>

      <section id="work" :class="isAppLayout ? 'mt-10' : 'mt-12 md:mt-20'">
        <div>
          <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">{{ copy.workKicker }}</p>
          <h2
            class="mt-3 max-w-[26ch] leading-[1.05] text-zinc-100 [font-family:var(--font-display)]"
            :class="isAppLayout ? 'text-[clamp(1.35rem,5.2vw,1.7rem)]' : 'text-[clamp(1.6rem,3.6vw,2.8rem)]'"
          >
            {{ copy.workHeading }}
          </h2>
        </div>
        <div class="mt-5 grid grid-cols-1 gap-3" :class="isAppLayout ? '' : 'md:grid-cols-2 xl:grid-cols-3'">
          <article
            v-for="work in copy.works"
            :key="work.title"
            class="flex flex-col gap-3 rounded-2xl border border-[#2a2a2a] bg-gradient-to-br from-[#151515] to-[#121212] p-4 transition hover:-translate-y-1 hover:border-[#393939]"
          >
            <h3 class="text-lg text-white">{{ work.title }}</h3>
            <p class="text-[15px] text-zinc-300">{{ work.summary }}</p>
            <strong class="text-sm text-zinc-200">{{ work.impact }}</strong>
            <ul class="mt-1 flex flex-wrap gap-2">
              <li
                v-for="item in work.stack"
                :key="`${work.title}-${item}`"
                class="rounded-full border border-[#2f2f2f] px-2 py-1 text-xs text-zinc-500"
              >
                {{ item }}
              </li>
            </ul>
          </article>
        </div>
      </section>

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
            href="mailto:hello@kimminje.dev"
          >
            {{ copy.emailCta }}
          </a>
          <a
            class="inline-flex items-center justify-center rounded-full border border-[#2a2a2a] px-4 py-3 text-sm font-semibold text-zinc-100 transition"
            :class="isAppLayout ? 'w-full' : 'min-w-40'"
            href="https://github.com"
            target="_blank"
            rel="noopener"
          >
            {{ copy.githubCta }}
          </a>
        </div>
      </section>

      <section :class="isAppLayout ? 'mt-10' : 'mt-12 md:mt-16'">
        <div class="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">{{ stackTicker.kicker }}</p>
            <h2
              class="mt-3 leading-[1.08] text-zinc-100 [font-family:var(--font-display)]"
              :class="isAppLayout ? 'text-[clamp(1.3rem,5vw,1.6rem)]' : 'text-[clamp(1.5rem,3.1vw,2.2rem)]'"
            >
              {{ stackTicker.heading }}
            </h2>
          </div>
          <RouterLink
            :to="stackDetailPath"
            class="inline-flex items-center justify-center rounded-full border border-[#2a2a2a] bg-[#101010] px-4 py-2 text-xs font-semibold tracking-[0.08em] text-zinc-200 transition hover:border-[#3a3a3a] hover:text-white"
          >
            {{ stackTicker.viewAllCta }}
          </RouterLink>
        </div>

        <div class="relative mt-4 overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#131313]">
          <div class="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#131313] to-transparent"></div>
          <div class="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#131313] to-transparent"></div>

          <div
            class="stack-ticker-track flex w-max items-center gap-2 py-3"
            :style="{ animationDuration: isAppLayout ? '20s' : '26s' }"
          >
            <article
              v-for="(item, index) in tickerLoopItems"
              :key="`${item.label}-${index}`"
              class="shrink-0 flex items-center gap-2 rounded-full border border-[#2a2a2a] bg-[#111111] px-3 py-1.5"
            >
              <img
                v-if="item.imageSrc"
                :src="item.imageSrc"
                :alt="item.imageAlt ?? item.label"
                class="h-4 w-4 object-contain"
                loading="lazy"
              />
              <span v-else class="text-base leading-none">{{ item.icon ?? '•' }}</span>
              <span class="text-sm text-zinc-200">{{ item.label }}</span>
            </article>
          </div>
        </div>
      </section>
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

.stack-ticker-track {
  animation-name: ticker-marquee;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
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

@keyframes ticker-marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .intro-brand,
  .intro-meter span {
    animation: none;
  }

  .stack-ticker-track {
    animation: none;
  }
}
</style>
