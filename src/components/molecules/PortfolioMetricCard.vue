<script setup lang="ts">
defineProps<{
  label: string
  value: string
  isAppLayout: boolean
}>()
</script>

<template>
  <article class="rounded-2xl border border-[#273346] bg-[#111a27] p-4">
    <p class="text-sm text-zinc-500">{{ label }}</p>
    <strong :class="isAppLayout ? 'text-xl' : 'text-2xl'" class="mt-2 block text-zinc-100">
      {{ value }}
    </strong>
  </article>
</template>
