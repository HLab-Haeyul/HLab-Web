<script setup lang="ts">
defineProps<{
  year: string
}>()
</script>

<template>
  <span class="shrink-0 rounded-full border border-[#2f2f2f] px-2 py-0.5 text-[11px] text-zinc-500">
    {{ year }}
  </span>
</template>
