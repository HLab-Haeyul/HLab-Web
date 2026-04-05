<script setup lang="ts">
import type { ProjectToneStyle } from '@/entities/project'

defineProps<{
  label: string
  value?: string | number
  toneStyle?: ProjectToneStyle
  valueClass?: string
}>()
</script>

<template>
  <article class="project-stat-card" :style="toneStyle">
    <p class="project-stat-label">{{ label }}</p>
    <p :class="['project-stat-value', valueClass]">
      <slot>{{ value }}</slot>
    </p>
  </article>
</template>

<style scoped>
.project-stat-card {
  border-top: 1px solid var(--line-strong);
  padding: 0.9rem 0 0;
}

.project-stat-label {
  margin: 0;
  font-size: var(--type-label-xs);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.project-stat-value {
  margin: 0.45rem 0 0;
  font-size: var(--type-data-lg);
  line-height: 1;
  font-weight: 600;
  color: var(--text-strong);
}
</style>
