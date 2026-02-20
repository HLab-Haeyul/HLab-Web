<script setup lang="ts">
import type { MetricItem } from '@/data/portfolio/types'
import PortfolioMetricCard from '@/components/molecules/PortfolioMetricCard.vue'

defineProps<{
  metrics: MetricItem[]
  metricDisplayValues: string[]
  isAppLayout: boolean
}>()
</script>

<template>
  <section
    class="mt-8 grid gap-3"
    :class="isAppLayout ? 'grid-cols-2' : 'grid-cols-1 md:mt-12 md:grid-cols-3'"
  >
    <PortfolioMetricCard
      v-for="(item, metricIndex) in metrics"
      :key="item.label"
      :label="item.label"
      :value="metricDisplayValues[metricIndex] ?? item.value"
      :is-app-layout="isAppLayout"
    />
  </section>
</template>
