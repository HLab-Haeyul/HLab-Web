<script setup lang="ts">
defineProps<{
  label: string
  value: string
}>()
</script>

<template>
  <dl class="project-meta-card">
    <dt>{{ label }}</dt>
    <dd>{{ value }}</dd>
  </dl>
</template>

<style scoped>
.project-meta-card {
  border-top: 1px solid var(--line-strong);
  padding: 0.95rem 0 0;
}

.project-meta-card dt {
  font-size: var(--type-label-xs);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.project-meta-card dd {
  margin: 0.55rem 0 0;
  font-size: var(--type-body-md);
  line-height: 1.75;
  color: var(--text-strong);
}
</style>
