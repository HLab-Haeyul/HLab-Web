<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from 'vue-router'

const props = withDefaults(
  defineProps<{
    id: string
    title: string
    description: string
    status: string
    to?: RouteLocationRaw
    variant?: 'ready' | 'planned'
  }>(),
  {
    to: undefined,
    variant: 'ready',
  },
)

const rootClass =
  props.variant === 'planned'
    ? 'rounded-2xl border border-dashed border-[#3b3b3b] bg-[#111111cc] p-4'
    : 'group rounded-2xl border border-[#263140] bg-[#0f141dd9] p-4 transition hover:border-[#4f76c7] hover:bg-[#121b2a]'

const descriptionClass =
  props.variant === 'planned'
    ? 'mt-2 text-sm text-zinc-400'
    : 'mt-2 text-sm text-zinc-400 group-hover:text-zinc-300'

const statusClass =
  props.variant === 'planned'
    ? 'rounded-full border border-[var(--line-strong)] bg-[rgba(255,255,255,0.06)] px-2 py-0.5 text-xs text-[var(--text-soft)]'
    : 'rounded-full border border-[#34538f] bg-[#14223a] px-2 py-0.5 text-xs text-blue-200'
</script>

<template>
  <component
    :is="props.to ? RouterLink : 'article'"
    :id="props.id"
    v-bind="props.to ? { to: props.to } : {}"
    :class="rootClass"
  >
    <div class="flex items-center justify-between gap-2">
      <h2 class="text-sm font-semibold text-zinc-100 sm:text-base">{{ props.title }}</h2>
      <span :class="statusClass">{{ props.status }}</span>
    </div>
    <p :class="descriptionClass">{{ props.description }}</p>
  </component>
</template>
