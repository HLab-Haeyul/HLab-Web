<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  value: boolean
  yesLabel: string
  noLabel: string
}>()

const badgeClass = computed(() =>
  props.value
    ? 'border-[rgba(129,215,179,0.4)] bg-[rgba(129,215,179,0.16)] text-[var(--brand-primary-strong)]'
    : 'border-[rgba(248,113,113,0.34)] bg-[rgba(248,113,113,0.14)] text-[rgb(252,165,165)]',
)
</script>

<template>
  <span class="inline-flex rounded-full border px-2.5 py-1 text-xs" :class="badgeClass">
    {{ value ? yesLabel : noLabel }}
  </span>
</template>
