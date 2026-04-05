<script setup lang="ts">
import type { MetricItem } from '@/entities/portfolio'
import { PortfolioMetricCard } from '@/entities/profile'

defineProps<{
  metrics: MetricItem[]
  metricDisplayValues: string[]
  isAppLayout: boolean
}>()
</script>

<template>
  <section
    class="mt-6 border-y border-[var(--line-soft)] py-3"
    :class="isAppLayout ? '' : 'md:mt-9 md:py-4'"
  >
    <div
      :class="
        isAppLayout
          ? 'flex gap-5 overflow-x-auto pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
          : 'grid grid-cols-3 divide-x divide-[var(--line-soft)]'
      "
    >
      <PortfolioMetricCard
        v-for="(item, metricIndex) in metrics"
        :key="item.label"
        :label="item.label"
        :value="metricDisplayValues[metricIndex] ?? item.value"
        :is-app-layout="isAppLayout"
        :class="isAppLayout ? 'min-w-[8.75rem]' : 'px-5 first:pl-0 last:pr-0'"
      />
    </div>
  </section>
</template>
