<script setup lang="ts">
import { computed } from 'vue'
import type { PortfolioCopySet, ProfileShowcaseCopy } from '@/entities/portfolio'

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
        <p class="ui-type-kicker text-zinc-500">
          {{ copy.eyebrow }}
        </p>
        <h1
          class="mt-3 max-w-[17ch] whitespace-pre-line text-zinc-100"
          :class="isAppLayout ? 'ui-type-hero-compact' : 'ui-type-hero'"
        >
          {{ copy.heroTitle }}
        </h1>
        <p :class="isAppLayout ? 'mt-4' : 'mt-5'" class="ui-type-body max-w-[62ch] text-zinc-300">
          {{ copy.heroLead }}
        </p>
      </div>

      <article class="order-3 lg:order-2 lg:pl-10">
        <img
          v-if="profilePhotoSrc"
          :src="profilePhotoSrc"
          :alt="profileShowcase.photoAlt"
          class="h-64 w-full rounded-[1.75rem] object-cover lg:max-w-[24rem]"
        />
        <div
          v-else
          class="flex h-64 w-full items-center justify-center rounded-[1.75rem] bg-[radial-gradient(circle_at_20%_20%,rgba(129,215,179,0.14),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] px-4 text-center text-sm text-[var(--text-muted)] lg:max-w-[24rem]"
        >
          {{ profileShowcase.photoHint }}
        </div>
      </article>
    </div>
  </section>
</template>
