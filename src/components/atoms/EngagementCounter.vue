<script setup lang="ts">
defineProps<{
  /** 'like' or 'comment' */
  type: 'like' | 'comment'
  count: number
}>()
</script>

<template>
  <span class="inline-flex items-center gap-1 text-[11px] text-zinc-500">
    <!-- heart icon -->
    <svg
      v-if="type === 'like'"
      class="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 20.5C11.7 20.5 11.4 20.4 11.2 20.2L5.2 14.8C3.8 13.5 3 11.8 3 10.1C3 7.2 5.2 5 8.1 5C9.7 5 11.1 5.7 12 6.9C12.9 5.7 14.3 5 15.9 5C18.8 5 21 7.2 21 10.1C21 11.8 20.2 13.5 18.8 14.8L12.8 20.2C12.6 20.4 12.3 20.5 12 20.5Z"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linejoin="round"
      />
    </svg>
    <!-- comment icon -->
    <svg v-else class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 14.5C20 16.4 18.4 18 16.5 18H9L5 21V18.2C3.8 17.7 3 16.6 3 15.3V7.5C3 5.6 4.6 4 6.5 4H16.5C18.4 4 20 5.6 20 7.5V14.5Z"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linejoin="round"
      />
    </svg>
    {{ count }}
  </span>
</template>
