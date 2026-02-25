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
    <p class="mb-2 text-[11px] uppercase tracking-[0.11em] text-[#8494aa]">
      {{ title }}
    </p>
    <nav class="overflow-hidden rounded-xl border border-[#273346] bg-[#111a2a]" :aria-label="navAriaLabel">
      <RouterLink
        v-for="item in links"
        :key="`${navAriaLabel}-${item.index}`"
        class="group flex items-center justify-between border-b border-[#1f2a3c] px-3 py-3 text-[15px] transition hover:bg-[#172235] last:border-b-0"
        :to="item.to"
        @click="emit('link-click')"
      >
        <span
          class="origin-left text-[#c3cfdf] transition-all duration-150 group-hover:scale-[1.03] group-hover:font-semibold group-hover:text-white"
        >
          {{ item.label }}
        </span>
        <span
          class="origin-right text-xs tracking-[0.08em] text-[#8494aa] transition-all duration-150 group-hover:scale-[1.03] group-hover:font-semibold group-hover:text-[#a9badb]"
        >
          {{ item.index }}
        </span>
      </RouterLink>
    </nav>
  </section>
</template>
