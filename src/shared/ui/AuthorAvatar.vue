<script setup lang="ts">
defineProps<{
  initials: string
  name: string
}>()
</script>

<template>
  <div class="inline-flex items-center gap-2">
    <span
      class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#2b384f] bg-[#0f1726] text-[9px] font-semibold text-[#d3ddf2]"
    >
      {{ initials }}
    </span>
    <span class="text-[11px] text-zinc-500">{{ name }}</span>
  </div>
</template>
