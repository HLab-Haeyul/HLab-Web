<script setup lang="ts">
import { computed } from 'vue'
import type { PortfolioCopySet, ProfileShowcaseCopy } from '@/data/portfolio/types'

const props = defineProps<{
  copy: PortfolioCopySet
  profileShowcase: ProfileShowcaseCopy
  isAppLayout: boolean
}>()

const profilePhotoSrc = computed(() => props.profileShowcase.photoSrc)
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
        <div :class="isAppLayout ? 'mt-5 grid grid-cols-1 gap-2' : 'mt-6 flex flex-wrap gap-3'">
          <a
            class="inline-flex items-center justify-center rounded-full bg-[#6f8fce] px-4 py-3 text-sm font-semibold !text-white shadow-[0_10px_22px_rgba(79,141,255,0.3)] transition hover:-translate-y-0.5 hover:bg-[#5f7fbe] hover:!text-white"
            :class="isAppLayout ? 'w-full' : 'min-w-40'"
            href="#certificates"
          >
            {{ copy.primaryCta }}
          </a>
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
    </div>
  </section>
</template>
