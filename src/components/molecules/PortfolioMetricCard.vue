<script setup lang="ts">
defineProps<{
  label: string
  value: string
  isAppLayout: boolean
}>()
</script>

<template>
  <article class="rounded-2xl border border-[#2a2a2a] bg-[#141414] p-4">
    <p class="text-sm text-zinc-500">{{ label }}</p>
    <strong :class="isAppLayout ? 'text-xl' : 'text-2xl'" class="mt-2 block text-white">
      {{ value }}
    </strong>
  </article>
</template>
