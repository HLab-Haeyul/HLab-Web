<script setup lang="ts">
type Props = {
  message: string
}

const props = defineProps<Props>()
</script>

<template>
  <div class="rounded-lg border border-[#2a2a2a] bg-[#0f0f0f] px-3 py-4 text-center text-sm text-zinc-500">
    {{ props.message }}
  </div>
</template>
