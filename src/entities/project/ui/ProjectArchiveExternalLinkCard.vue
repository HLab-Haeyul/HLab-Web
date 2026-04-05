<script setup lang="ts">
import type { ExternalLink } from '@/entities/portfolio'

defineProps<{
  link: ExternalLink
  badge: string
}>()
</script>

<template>
  <a :href="link.url" target="_blank" rel="noreferrer" class="project-link-card group">
    <div class="flex items-start justify-between gap-3">
      <span class="project-link-badge">{{ badge }}</span>
      <span
        class="text-xs text-[var(--text-muted)] transition group-hover:text-[var(--text-strong)]"
        >↗</span
      >
    </div>
    <p class="mt-3 text-sm font-semibold leading-6 text-[var(--text-strong)]">{{ link.name }}</p>
    <p class="mt-1 break-all text-xs leading-5 text-[var(--text-soft)]">{{ link.url }}</p>
  </a>
</template>

<style scoped>
.project-link-card {
  display: block;
  border-bottom: 1px solid var(--line-soft);
  padding: 0 0 1rem;
  transition:
    transform 220ms ease,
    border-color 220ms ease,
    color 220ms ease;
}

.project-link-card:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.project-link-card:hover {
  transform: translateX(4px);
  border-color: var(--project-accent);
}

.project-link-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-size: var(--type-label-xs);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--project-accent);
}

@media (prefers-reduced-motion: reduce) {
  .project-link-card {
    transition-duration: 1ms;
  }
}
</style>
