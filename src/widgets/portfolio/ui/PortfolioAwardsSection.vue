<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import type { AwardItem, ProfileShowcaseCopy } from '@/entities/portfolio'

const props = defineProps<{
  profileShowcase: ProfileShowcaseCopy
  isAppLayout: boolean
}>()

const sectionRef = ref<HTMLElement | null>(null)
const timelineRef = ref<HTMLElement | null>(null)
const selectedAwardIndex = ref(0)
const isSectionVisible = ref(false)
const isAutoRotatePaused = ref(false)
const awardTrailMetrics = ref<{
  key: number
  top: string
  height: string
  distance: string
} | null>(null)

const awardButtonElements = new Map<number, HTMLButtonElement>()
const awardDotElements = new Map<number, HTMLSpanElement>()

let sectionObserver: IntersectionObserver | null = null
let reducedMotionQuery: MediaQueryList | null = null
let handleReducedMotionChange: ((event: MediaQueryListEvent) => void) | null = null
let autoRotateTimer: ReturnType<typeof setInterval> | undefined
let autoRotateResumeTimer: ReturnType<typeof setTimeout> | undefined
let awardTrailTimer: ReturnType<typeof setTimeout> | undefined
let prefersReducedMotion = false
let awardTrailAnimationKey = 0

const AUTO_ROTATE_INTERVAL_MS = 2800
const AUTO_ROTATE_RESUME_DELAY_MS = 5200
const AWARD_TRAIL_ANIMATION_DURATION_MS = 640

const selectedAward = computed<AwardItem | null>(() => {
  const index = selectedAwardIndex.value
  const awards = props.profileShowcase.awards

  if (index < 0 || index >= awards.length) {
    return awards[0] ?? null
  }

  return awards[index] ?? null
})

const selectedAwardImageAlt = computed(() => {
  if (!selectedAward.value) {
    return ''
  }

  return selectedAward.value.imageAlt ?? selectedAward.value.title
})
const awardPreviewHint = computed(() =>
  selectedAward.value?.imageSrc
    ? props.profileShowcase.awardPreviewHintWithImage
    : props.profileShowcase.awardPreviewHintWithoutImage,
)

const clearAutoRotateResumeTimer = () => {
  if (autoRotateResumeTimer) {
    clearTimeout(autoRotateResumeTimer)
    autoRotateResumeTimer = undefined
  }
}

const stopAutoRotate = () => {
  if (autoRotateTimer) {
    clearInterval(autoRotateTimer)
    autoRotateTimer = undefined
  }
}

const clearAwardTrail = () => {
  if (awardTrailTimer) {
    clearTimeout(awardTrailTimer)
    awardTrailTimer = undefined
  }

  awardTrailMetrics.value = null
}

const normalizeAwardIndex = (index: number) => {
  const count = props.profileShowcase.awards.length

  if (count === 0) {
    return 0
  }

  return ((index % count) + count) % count
}

const setAwardButtonRef = (
  element: Element | ComponentPublicInstance | null,
  awardIndex: number,
) => {
  if (element instanceof HTMLButtonElement) {
    awardButtonElements.set(awardIndex, element)
    return
  }

  awardButtonElements.delete(awardIndex)
}

const setAwardDotRef = (
  element: Element | ComponentPublicInstance | null,
  awardIndex: number,
) => {
  if (element instanceof HTMLSpanElement) {
    awardDotElements.set(awardIndex, element)
    return
  }

  awardDotElements.delete(awardIndex)
}

const animateAwardTrail = (fromIndex: number, toIndex: number) => {
  if (prefersReducedMotion || toIndex <= fromIndex) {
    clearAwardTrail()
    return
  }

  const timelineElement = timelineRef.value
  const fromDot = awardDotElements.get(fromIndex)
  const toDot = awardDotElements.get(toIndex)

  if (!timelineElement || !fromDot || !toDot) {
    clearAwardTrail()
    return
  }

  const timelineRect = timelineElement.getBoundingClientRect()
  const fromDotRect = fromDot.getBoundingClientRect()
  const toDotRect = toDot.getBoundingClientRect()
  const startY = fromDotRect.top - timelineRect.top + fromDotRect.height / 2
  const endY = toDotRect.top - timelineRect.top + toDotRect.height / 2
  const distance = endY - startY

  if (distance <= 0) {
    clearAwardTrail()
    return
  }

  clearAwardTrail()
  awardTrailAnimationKey += 1
  awardTrailMetrics.value = {
    key: awardTrailAnimationKey,
    top: `${startY}px`,
    height: `${distance}px`,
    distance: `${distance}px`,
  }

  awardTrailTimer = setTimeout(() => {
    awardTrailMetrics.value = null
    awardTrailTimer = undefined
  }, AWARD_TRAIL_ANIMATION_DURATION_MS)
}

const scrollSelectedAwardIntoView = (behavior: ScrollBehavior = 'smooth') => {
  if (!props.isAppLayout) {
    return
  }

  const activeButton = awardButtonElements.get(selectedAwardIndex.value)

  activeButton?.scrollIntoView({
    behavior,
    block: 'nearest',
    inline: 'nearest',
  })
}

const queueSelectedAwardScroll = (behavior: ScrollBehavior = 'smooth') => {
  if (!props.isAppLayout) {
    return
  }

  void nextTick(() => {
    scrollSelectedAwardIntoView(behavior)
  })
}

const syncAutoRotate = () => {
  stopAutoRotate()

  if (
    prefersReducedMotion ||
    isAutoRotatePaused.value ||
    !isSectionVisible.value ||
    props.profileShowcase.awards.length < 2
  ) {
    return
  }

  autoRotateTimer = setInterval(() => {
    selectAward(selectedAwardIndex.value + 1, {
      animateTrail: true,
    })
  }, AUTO_ROTATE_INTERVAL_MS)
}

const pauseAutoRotate = (delay = AUTO_ROTATE_RESUME_DELAY_MS) => {
  if (props.profileShowcase.awards.length < 2) {
    return
  }

  clearAutoRotateResumeTimer()
  isAutoRotatePaused.value = true

  autoRotateResumeTimer = setTimeout(() => {
    isAutoRotatePaused.value = false
  }, delay)
}

const selectAward = (
  awardIndex: number,
  options: {
    pauseAutoRotate?: boolean
    scrollBehavior?: ScrollBehavior
    animateTrail?: boolean
  } = {},
) => {
  if (props.profileShowcase.awards.length === 0) {
    return
  }

  const nextAwardIndex = normalizeAwardIndex(awardIndex)
  const previousAwardIndex = selectedAwardIndex.value

  if (options.animateTrail && nextAwardIndex !== previousAwardIndex) {
    animateAwardTrail(previousAwardIndex, nextAwardIndex)
  } else {
    clearAwardTrail()
  }

  selectedAwardIndex.value = nextAwardIndex

  if (options.pauseAutoRotate) {
    pauseAutoRotate()
  }

  queueSelectedAwardScroll(options.scrollBehavior)
}

watch(
  () => props.profileShowcase.awards.length,
  (count) => {
    if (count === 0) {
      clearAwardTrail()
      selectedAwardIndex.value = 0
      return
    }

    if (selectedAwardIndex.value > count - 1) {
      clearAwardTrail()
      selectedAwardIndex.value = 0
    }
  },
  { immediate: true },
)

watch(
  [isSectionVisible, isAutoRotatePaused, () => props.profileShowcase.awards.length],
  () => {
    syncAutoRotate()
  },
  { immediate: true },
)

onMounted(() => {
  reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion = reducedMotionQuery.matches

  handleReducedMotionChange = (event) => {
    prefersReducedMotion = event.matches
    syncAutoRotate()
  }

  reducedMotionQuery.addEventListener?.('change', handleReducedMotionChange)

  if ('IntersectionObserver' in window && sectionRef.value) {
    sectionObserver = new IntersectionObserver(
      ([entry]) => {
        isSectionVisible.value = entry?.isIntersecting === true && entry.intersectionRatio >= 0.1
      },
      {
        threshold: [0.1, 0.3],
      },
    )

    sectionObserver.observe(sectionRef.value)
    return
  }

  isSectionVisible.value = true
})

onBeforeUnmount(() => {
  stopAutoRotate()
  clearAutoRotateResumeTimer()
  clearAwardTrail()
  sectionObserver?.disconnect()

  if (reducedMotionQuery && handleReducedMotionChange) {
    reducedMotionQuery.removeEventListener?.('change', handleReducedMotionChange)
  }
})
</script>

<template>
  <section ref="sectionRef" :class="isAppLayout ? 'mt-10' : 'mt-12 md:mt-16'">
    <div>
      <p class="ui-type-kicker text-zinc-500">{{ profileShowcase.kicker }}</p>
      <h2
        class="mt-3 text-zinc-100"
        :class="isAppLayout ? 'ui-type-title-sm-compact' : 'ui-type-title-md'"
      >
        {{ profileShowcase.heading }}
      </h2>
    </div>

    <article class="mt-5 border-t border-[var(--line-strong)] pt-5">
      <p class="text-sm text-zinc-400">{{ profileShowcase.awardsTitle }}</p>

      <div class="mt-3 grid gap-4 xl:grid-cols-[minmax(0,720px)_minmax(300px,360px)] xl:items-start xl:justify-between">
        <div ref="timelineRef" class="relative xl:max-w-[720px]">
          <span
            aria-hidden="true"
            class="pointer-events-none absolute inset-y-6 left-3.5 z-0 w-px bg-gradient-to-b from-transparent via-[var(--line-muted)] to-transparent"
          ></span>
          <span
            v-if="awardTrailMetrics"
            :key="awardTrailMetrics.key"
            aria-hidden="true"
            class="portfolio-awards__trail pointer-events-none absolute left-3.5 z-20"
            :style="{
              top: awardTrailMetrics.top,
              height: awardTrailMetrics.height,
              '--award-trail-distance': awardTrailMetrics.distance,
            }"
          >
            <span class="portfolio-awards__trail-line"></span>
            <span class="portfolio-awards__trail-head"></span>
          </span>

          <ul>
            <li
              v-for="(award, awardIndex) in profileShowcase.awards"
              :key="`${award.year}-${award.title}`"
              class="relative pl-9 pb-4 last:pb-0"
            >
              <span
                aria-hidden="true"
                :ref="(element) => setAwardDotRef(element, awardIndex)"
                class="absolute left-3.5 top-7 z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--line-muted)] bg-[var(--surface-card)] shadow-[0_0_0_6px_var(--surface-card)]"
              ></span>
              <span
                aria-hidden="true"
                class="absolute left-3.5 top-7 z-10 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                :class="selectedAwardIndex === awardIndex ? 'bg-[var(--brand-primary)]' : 'bg-zinc-200'"
              ></span>

              <button
                type="button"
                class="block w-full border-b border-[var(--line-soft)] px-0 py-3 text-left transition"
                :ref="(element) => setAwardButtonRef(element, awardIndex)"
                :class="
                  [
                    selectedAwardIndex === awardIndex
                      ? 'border-[var(--brand-primary)] text-[var(--brand-primary)]'
                      : 'hover:border-[var(--line-muted)]',
                  ]
                "
                @click="selectAward(awardIndex, { pauseAutoRotate: true })"
              >
                <div class="flex items-start justify-between gap-3">
                  <p
                    class="text-sm font-medium"
                    :class="selectedAwardIndex === awardIndex ? 'text-[var(--text-strong)]' : 'text-zinc-200'"
                  >
                    {{ award.title }}
                  </p>
                  <span
                    class="shrink-0 rounded-full border px-2 py-0.5 text-xs"
                    :class="
                      selectedAwardIndex === awardIndex
                        ? 'border-[var(--line-muted)] text-[var(--text-soft)]'
                        : 'border-[var(--line-soft)] text-zinc-500'
                    "
                  >
                    {{ award.year }}
                  </span>
                </div>
                <p
                  class="mt-1 text-xs"
                  :class="selectedAwardIndex === awardIndex ? 'text-[var(--text-soft)]' : 'text-zinc-500'"
                >
                  {{ award.organizer }}
                </p>
              </button>
            </li>
          </ul>
        </div>

        <aside
          v-if="selectedAward"
          class="border-t border-[var(--line-strong)] pt-4 xl:sticky xl:top-24"
        >
          <div
            v-if="selectedAward.imageSrc"
            class="aspect-[4/5] overflow-hidden rounded-[1.6rem] bg-[var(--surface-card-strong)]"
          >
            <img
              :src="selectedAward.imageSrc"
              :alt="selectedAwardImageAlt"
              class="h-full w-full object-cover"
              loading="lazy"
            />
          </div>

          <div
            v-else
            class="relative flex aspect-[4/5] items-end overflow-hidden rounded-[1.6rem] bg-[radial-gradient(circle_at_20%_20%,rgba(129,215,179,0.18),transparent_34%),radial-gradient(circle_at_82%_16%,rgba(255,255,255,0.06),transparent_26%),linear-gradient(160deg,#161616_0%,#1b1b1b_48%,#202020_100%)] p-5"
          >
            <div
              aria-hidden="true"
              class="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(21,21,21,0.6)] text-[var(--text-strong)]"
            >
              <svg
                class="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 4H16V7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7V4Z"
                  stroke="currentColor"
                  stroke-width="1.7"
                />
                <path
                  d="M8 6H5V7C5 9.20914 6.79086 11 9 11"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                />
                <path
                  d="M16 6H19V7C19 9.20914 17.2091 11 15 11"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                />
                <path
                  d="M12 11V15"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                />
                <path
                  d="M9 20H15"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                />
                <path
                  d="M10 15H14V17C14 18.1046 13.1046 19 12 19C10.8954 19 10 18.1046 10 17V15Z"
                  stroke="currentColor"
                  stroke-width="1.7"
                />
              </svg>
            </div>

            <div class="relative max-w-[20rem]">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-soft)]">
                {{ props.profileShowcase.awardPreviewLabel }}
              </p>
              <h3 class="mt-3 text-xl font-semibold leading-snug text-[var(--text-strong)]">
                {{ selectedAward.title }}
              </h3>
              <p class="mt-3 text-sm leading-6 text-[var(--text-soft)]">
                {{ selectedAward.organizer }}
              </p>
            </div>
          </div>

          <div class="space-y-3 pt-5">
            <div class="flex items-center justify-between gap-3">
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                {{ props.profileShowcase.selectedAwardLabel }}
              </p>
              <span class="px-0 py-1 text-xs text-[var(--text-soft)]">
                {{ selectedAward.year }}
              </span>
            </div>

            <h3 class="text-base font-semibold leading-7 text-[var(--text-strong)]">
              {{ selectedAward.title }}
            </h3>
            <p class="text-sm leading-6 text-[var(--text-soft)]">
              {{ selectedAward.organizer }}
            </p>
            <p class="text-xs leading-5 text-[var(--text-muted)]">{{ awardPreviewHint }}</p>
          </div>
        </aside>
      </div>
    </article>
  </section>
</template>

<style scoped>
.portfolio-awards__trail {
  width: 0;
  transform: translateX(-50%);
}

.portfolio-awards__trail-line {
  position: absolute;
  inset: 0 auto 0 50%;
  width: 2px;
  transform: translateX(-50%) scaleY(0);
  transform-origin: top center;
  border-radius: 999px;
  background:
    linear-gradient(
      180deg,
      rgba(129, 215, 179, 0.08) 0%,
      rgba(129, 215, 179, 0.94) 46%,
      rgba(129, 215, 179, 0.18) 100%
    );
  box-shadow: 0 0 16px rgba(129, 215, 179, 0.28);
  animation: portfolio-awards-trail-line 640ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.portfolio-awards__trail-head {
  position: absolute;
  left: 50%;
  top: 0;
  height: 0.75rem;
  width: 0.75rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.34);
  background:
    radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.18) 36%, rgba(129, 215, 179, 0.94) 100%);
  box-shadow:
    0 0 0 6px rgba(129, 215, 179, 0.08),
    0 0 18px rgba(129, 215, 179, 0.35);
  transform: translate(-50%, -50%) scale(0.8);
  animation: portfolio-awards-trail-head 640ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes portfolio-awards-trail-line {
  0% {
    opacity: 0;
    transform: translateX(-50%) scaleY(0);
  }

  14% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translateX(-50%) scaleY(1);
  }
}

@keyframes portfolio-awards-trail-head {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }

  16% {
    opacity: 1;
  }

  78% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translate(-50%, calc(var(--award-trail-distance) - 50%)) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .portfolio-awards__trail {
    display: none;
  }
}
</style>
