<script setup lang="ts">
import type { HobbyItem } from '@/data/portfolio/types'

defineProps<{
  hobby: HobbyItem
}>()
</script>

<template>
  <li class="rounded-xl border border-[#242424] bg-[#101010] px-3 py-3">
    <p class="text-sm font-medium text-zinc-200">{{ hobby.name }}</p>
    <p class="mt-1 text-xs leading-relaxed text-zinc-400">{{ hobby.description }}</p>
  </li>
</template>
