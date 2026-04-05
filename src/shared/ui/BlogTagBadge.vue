<script setup lang="ts">
defineProps<{
  tag: string
}>()

const formatTagLabel = (value: string) => value.replace(/^#+/, '')
</script>

<template>
  <span
    class="rounded-full border border-[#2b384f] bg-[#0f1726] px-2 py-0.5 text-[11px] text-zinc-300"
  >
    #{{ formatTagLabel(tag) }}
  </span>
</template>
