<script setup lang="ts">
defineProps<{
  label: string
  value: string
  note: string
}>()
</script>

<template>
  <article class="rounded-2xl border border-[#2a2a2a] bg-[#121212dd] p-4">
    <p class="text-xs uppercase tracking-[0.08em] text-zinc-500">{{ label }}</p>
    <p class="mt-2 text-2xl font-semibold text-zinc-100">{{ value }}</p>
    <p class="mt-1 text-xs text-zinc-400">{{ note }}</p>
  </article>
</template>
