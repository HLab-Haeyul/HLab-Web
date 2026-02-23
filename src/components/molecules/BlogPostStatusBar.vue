<script setup lang="ts">
type Props = {
  blogPath: string
  backLabel: string
  statusLabel: string
  engagementStatusLabel: string
  isLoading: boolean
  loadingLabel: string
  retryLabel: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  reload: []
}>()
</script>

<template>
  <div class="flex items-center justify-between gap-2 rounded-2xl border border-[#2a2a2a] bg-[#111111d1] p-3">
    <RouterLink
      :to="props.blogPath"
      class="rounded-lg border border-[#313131] px-2.5 py-1 text-xs text-zinc-300 transition hover:border-[#5b5b5b] hover:text-white"
    >
      {{ props.backLabel }}
    </RouterLink>

    <div class="flex items-center gap-2">
      <p class="text-xs text-zinc-400">
        {{ props.statusLabel }} · {{ props.engagementStatusLabel }}
        <span v-if="props.isLoading"> · {{ props.loadingLabel }}</span>
      </p>
      <button
        type="button"
        class="rounded-lg border border-[#313131] px-2.5 py-1 text-xs text-zinc-300 transition hover:border-[#5b5b5b] hover:text-white"
        @click="emit('reload')"
      >
        {{ props.retryLabel }}
      </button>
    </div>
  </div>
</template>
