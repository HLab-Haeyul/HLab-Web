<script setup lang="ts">
type Props = {
  kicker?: string
  title: string
  description?: string
}

const props = defineProps<Props>()
</script>

<template>
  <div>
    <p v-if="props.kicker" class="text-xs font-medium text-zinc-500">{{ props.kicker }}</p>
    <h2 class="mt-1 text-2xl font-semibold text-zinc-100">{{ props.title }}</h2>
    <p v-if="props.description" class="mt-1 text-sm text-zinc-400">{{ props.description }}</p>
  </div>
</template>
