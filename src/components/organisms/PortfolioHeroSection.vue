<script setup lang="ts">
import { computed } from 'vue'
import SkillIcon from '@/components/atoms/SkillIcon.vue'
import PortfolioMetricCard from '@/components/molecules/PortfolioMetricCard.vue'
import type { StackTickerItem } from '@/data/stack/types'
import type { MetricItem, PortfolioCopySet, ProfileShowcaseCopy } from '@/data/portfolio/types'

const props = defineProps<{
  copy: PortfolioCopySet
  profileShowcase: ProfileShowcaseCopy
  stackKicker: string
  stackItems: StackTickerItem[]
  metrics: MetricItem[]
  metricDisplayValues: string[]
  isAppLayout: boolean
}>()

const profilePhotoSrc = computed(() => props.profileShowcase.photoSrc)
const stackTickerLoopItems = computed(() => [...props.stackItems, ...props.stackItems])
</script>

<template>
  <section id="profile" :class="isAppLayout ? 'pt-1' : 'pt-2'">
    <div class="grid grid-cols-1 gap-4" :class="isAppLayout ? '' : 'lg:grid-cols-[1.2fr_0.8fr] lg:items-start'">
      <div class="order-1 min-w-0">
        <p :class="isAppLayout ? 'text-[11px]' : 'text-xs'" class="uppercase tracking-[0.13em] text-zinc-500">
          {{ copy.eyebrow }}
        </p>
        <h1
          class="mt-3 max-w-[17ch] leading-[0.97] tracking-[-0.02em] text-zinc-100 [font-family:var(--font-display)]"
          :class="isAppLayout ? 'text-[clamp(1.9rem,8vw,2.6rem)]' : 'text-[clamp(2.3rem,6vw,5.2rem)]'"
        >
          {{ copy.heroTitle }}
        </h1>
        <p :class="isAppLayout ? 'mt-4 text-[15px]' : 'mt-5 text-base'" class="max-w-[62ch] text-zinc-300">
          {{ copy.heroLead }}
        </p>
        <div :class="isAppLayout ? 'mt-5 space-y-2' : 'mt-6 flex flex-wrap items-start gap-3'">
          <div :class="isAppLayout ? 'grid grid-cols-1 gap-2' : 'flex flex-wrap gap-3'">
            <a
              class="inline-flex items-center justify-center rounded-full bg-[#6f8fce] px-4 py-3 text-sm font-semibold !text-white shadow-[0_10px_22px_rgba(79,141,255,0.3)] transition hover:-translate-y-0.5 hover:bg-[#5f7fbe] hover:!text-white"
              :class="isAppLayout ? 'w-full' : 'min-w-40'"
              href="#work"
            >
              {{ copy.primaryCta }}
            </a>
            <a
              class="inline-flex items-center justify-center rounded-full border border-[#2a2a2a] px-4 py-3 text-sm font-semibold text-zinc-100 transition hover:border-[#6f8fce] hover:text-white"
              :class="isAppLayout ? 'w-full' : 'min-w-40'"
              href="#contact"
            >
              {{ copy.secondaryCta }}
            </a>
          </div>

          <div
            v-if="profileShowcase.certificates.length > 0"
            class="rounded-xl border border-[#2a2a2a] bg-[#101010]"
            :class="isAppLayout ? 'p-2' : 'px-2.5 py-2'"
          >
            <p class="text-[10px] uppercase tracking-[0.12em] text-zinc-500">
              {{ profileShowcase.certificatesTitle }}
            </p>
            <ul class="mt-1.5 flex flex-wrap gap-1.5">
              <li
                v-for="certificate in profileShowcase.certificates"
                :key="`${certificate.year}-${certificate.title}`"
                class="inline-flex items-center gap-1.5 rounded-full border border-[#2a2a2a] bg-[#111111] px-2 py-1"
              >
                <span class="text-[11px] text-zinc-200">{{ certificate.title }}</span>
                <span class="text-[10px] text-zinc-500">{{ certificate.acquiredDate }}</span>
              </li>
            </ul>
          </div>
        </div>

      </div>

      <article class="order-3 rounded-2xl border border-[#2a2a2a] bg-[#131313] p-4 lg:order-2">
        <img
          v-if="profilePhotoSrc"
          :src="profilePhotoSrc"
          :alt="profileShowcase.photoAlt"
          class="h-56 w-full rounded-xl object-cover"
        />
        <div
          v-else
          class="flex h-56 w-full items-center justify-center rounded-xl border border-dashed border-[#313131] bg-[#101010] px-4 text-center text-sm text-zinc-500"
        >
          {{ profileShowcase.photoHint }}
        </div>
      </article>

      <div class="order-2 min-w-0 lg:order-3 lg:col-span-2">
        <section :class="isAppLayout ? 'mt-5' : 'mt-6'">
          <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">{{ stackKicker }}</p>
          <div class="relative mt-3 w-full overflow-hidden rounded-xl border border-[#262626] bg-[#101010]">
            <div
              aria-hidden="true"
              class="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#101010] to-transparent"
            ></div>
            <div
              aria-hidden="true"
              class="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#101010] to-transparent"
            ></div>
            <ul
              class="stack-marquee-track flex w-max items-center gap-2 py-2"
              :style="{ animationDuration: isAppLayout ? '20s' : '26s' }"
            >
              <li
                v-for="(item, index) in stackTickerLoopItems"
                :key="`${item.label}-${index}`"
                class="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#2a2a2a] bg-[#111111] px-3 py-1.5"
              >
                <SkillIcon
                  :image-src="item.imageSrc"
                  :image-alt="item.imageAlt"
                  :icon="item.icon"
                  :label="item.label"
                  image-class="h-4 w-4 object-contain"
                  icon-class="text-sm leading-none"
                />
                <span class="text-xs text-zinc-200">{{ item.label }}</span>
              </li>
            </ul>
          </div>
        </section>

        <section class="mt-5 grid gap-3" :class="isAppLayout ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'">
          <PortfolioMetricCard
            v-for="(item, metricIndex) in metrics"
            :key="item.label"
            :label="item.label"
            :value="metricDisplayValues[metricIndex] ?? item.value"
            :is-app-layout="isAppLayout"
          />
        </section>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stack-marquee-track {
  animation-name: stack-marquee;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  will-change: transform;
}

@keyframes stack-marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .stack-marquee-track {
    animation: none;
  }
}
</style>
