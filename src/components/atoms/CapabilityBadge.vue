<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  value: boolean
  yesLabel: string
  noLabel: string
}>()

const badgeClass = computed(() =>
  props.value
    ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-300'
    : 'border-zinc-700 bg-zinc-900 text-zinc-400',
)
</script>

<template>
  <span class="inline-flex rounded-full border px-2.5 py-1 text-xs" :class="badgeClass">
    {{ value ? yesLabel : noLabel }}
  </span>
</template>
