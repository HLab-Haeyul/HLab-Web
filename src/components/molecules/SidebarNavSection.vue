<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

type SidebarLinkItem = {
  label: string
  to: RouteLocationRaw
  index: string
}

defineProps<{
  title: string
  navAriaLabel: string
  links: SidebarLinkItem[]
}>()

const emit = defineEmits<{
  (event: 'link-click'): void
}>()
</script>

<template>
  <section>
    <p class="mb-2 text-[11px] uppercase tracking-[0.11em] text-zinc-500">
      {{ title }}
    </p>
    <nav class="border-y border-[#222222]" :aria-label="navAriaLabel">
      <RouterLink
        v-for="item in links"
        :key="`${navAriaLabel}-${item.index}`"
        class="group flex items-center justify-between border-b border-[#222222] py-3 text-[15px] transition last:border-b-0"
        :to="item.to"
        @click="emit('link-click')"
      >
        <span
          class="origin-left text-zinc-300 transition-all duration-150 group-hover:scale-[1.05] group-hover:font-semibold group-hover:text-white"
        >
          {{ item.label }}
        </span>
        <span
          class="origin-right text-xs tracking-[0.08em] text-zinc-600 transition-all duration-150 group-hover:scale-[1.05] group-hover:font-semibold group-hover:text-white"
        >
          {{ item.index }}
        </span>
      </RouterLink>
    </nav>
  </section>
</template>
