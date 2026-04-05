<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

type SidebarLinkItem = {
  label: string
  index: string
  to?: RouteLocationRaw
  href?: string
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
    <p class="mb-2 text-xs uppercase tracking-[0.11em] text-[var(--text-muted)]">
      {{ title }}
    </p>
    <nav class="overflow-hidden" :aria-label="navAriaLabel">
      <template v-for="item in links" :key="`${navAriaLabel}-${item.index}`">
        <a
          v-if="item.href"
          class="group flex items-center justify-between border-b border-[var(--line-soft)] py-3 text-base transition last:border-b-0"
          :href="item.href"
          @click="emit('link-click')"
        >
          <span
            class="origin-left text-[var(--text-soft)] transition-all duration-150 group-hover:scale-[1.03] group-hover:font-semibold group-hover:text-white"
          >
            {{ item.label }}
          </span>
          <span
            class="origin-right text-xs tracking-[0.08em] text-[var(--text-muted)] transition-all duration-150 group-hover:scale-[1.03] group-hover:font-semibold group-hover:text-[var(--text-soft)]"
          >
            {{ item.index }}
          </span>
        </a>
        <RouterLink
          v-else
          class="group flex items-center justify-between border-b border-[var(--line-soft)] py-3 text-base transition last:border-b-0"
          :to="item.to!"
          @click="emit('link-click')"
        >
          <span
            class="origin-left text-[var(--text-soft)] transition-all duration-150 group-hover:scale-[1.03] group-hover:font-semibold group-hover:text-white"
          >
            {{ item.label }}
          </span>
          <span
            class="origin-right text-xs tracking-[0.08em] text-[var(--text-muted)] transition-all duration-150 group-hover:scale-[1.03] group-hover:font-semibold group-hover:text-[var(--text-soft)]"
          >
            {{ item.index }}
          </span>
        </RouterLink>
      </template>
    </nav>
  </section>
</template>
