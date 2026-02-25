<script setup lang="ts">
defineProps<{
  /** 0-based index — even = left side, odd = right side on md+ */
  index: number
}>()
</script>

<template>
  <!-- outer ring -->
  <span
    aria-hidden="true"
    class="absolute left-3 top-6 z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#8a8a8a] bg-[#131313] shadow-[0_0_0_6px_#131313] md:left-1/2"
  ></span>
  <!-- inner dot -->
  <span
    aria-hidden="true"
    class="absolute left-3 top-6 z-10 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-200 md:left-1/2"
  ></span>
  <!-- horizontal connector (desktop only) -->
  <span
    aria-hidden="true"
    class="pointer-events-none absolute top-6 z-0 hidden h-px -translate-y-1/2 bg-[#3a3a3a] md:block"
    :class="index % 2 === 0 ? 'right-[calc(50%+0.65rem)] w-6' : 'left-[calc(50%+0.65rem)] w-6'"
  ></span>
</template>
