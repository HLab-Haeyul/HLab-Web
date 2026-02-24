<script setup lang="ts">
type Props = {
  searchLabel: string
  searchPlaceholder: string
  modelValue: string
  apiStatusLabel: string
  isLoading: boolean
  loadingLabel: string
  reloadLabel: string
  errorMessage: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  reload: []
}>()
</script>

<template>
  <div class="space-y-4">
    <div
      id="blog-search"
      class="rounded-2xl border border-[#e8eef2] bg-white p-4 shadow-[0_12px_26px_rgba(15,23,42,0.06)]"
    >
      <label class="mb-2 block text-xs uppercase tracking-[0.11em] text-[#868e96]" for="blog-search-input">
        {{ props.searchLabel }}
      </label>
      <div class="flex items-center gap-2 rounded-xl border border-[#dee2e6] bg-[#f8fafb] px-3 py-2">
        <svg
          class="h-4 w-4 shrink-0 text-[#868e96]"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M11 19C15.4 19 19 15.4 19 11C19 6.6 15.4 3 11 3C6.6 3 3 6.6 3 11C3 15.4 6.6 19 11 19Z"
            stroke="currentColor"
            stroke-width="1.8"
          />
          <path d="M21 21L16.7 16.7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
        <input
          id="blog-search-input"
          :value="props.modelValue"
          type="search"
          class="w-full border-0 bg-transparent text-sm text-[#212529] placeholder:text-[#adb5bd] focus:outline-none"
          :placeholder="props.searchPlaceholder"
          @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>

    <div id="blog-sync" class="rounded-2xl border border-[#e8eef2] bg-white p-4 shadow-[0_12px_26px_rgba(15,23,42,0.06)]">
      <div class="flex items-center justify-between gap-2">
        <p class="text-xs text-[#495057]">
          {{ props.apiStatusLabel }}
          <span v-if="props.isLoading" class="text-[#12b886]"> · {{ props.loadingLabel }}</span>
        </p>
        <button
          type="button"
          class="rounded-lg border border-[#dbe4ea] px-2.5 py-1 text-xs font-medium text-[#495057] transition hover:border-[#12b886] hover:text-[#087f5b]"
          @click="emit('reload')"
        >
          {{ props.reloadLabel }}
        </button>
      </div>
      <p v-if="props.errorMessage" class="mt-2 text-xs text-[#e67700]">
        {{ props.errorMessage }}
      </p>
    </div>
  </div>
</template>
