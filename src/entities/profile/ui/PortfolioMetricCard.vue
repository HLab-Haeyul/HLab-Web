<script setup lang="ts">
defineProps<{
  label: string
  value: string
  isAppLayout: boolean
}>()
</script>

<template>
  <article class="flex min-w-0 flex-col gap-1.5 py-1">
    <p class="ui-type-kicker whitespace-nowrap text-[var(--text-muted)]">{{ label }}</p>
    <strong
      :class="isAppLayout ? 'text-xl' : 'text-2xl'"
      class="whitespace-nowrap tracking-[-0.03em] text-zinc-100"
    >
      {{ value }}
    </strong>
  </article>
</template>
