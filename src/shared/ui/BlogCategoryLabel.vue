<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <span
    class="absolute bottom-3 right-3 rounded-md border border-[#ffffff66] bg-[#0d1726cc] px-2 py-0.5 text-[10px] font-semibold tracking-[0.08em] text-[#d3ddf2]"
  >
    {{ label }}
  </span>
</template>
