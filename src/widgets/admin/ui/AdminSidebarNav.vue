<script setup lang="ts">
import type { AdminNavItem } from '@/widgets/admin'

const props = defineProps<{
  items: AdminNavItem[]
  activePath: string
}>()

const emit = defineEmits<{
  logout: []
}>()

const isActive = (path: string) =>
  props.activePath === path || props.activePath.startsWith(`${path}/`)
</script>

<template>
  <aside class="rounded-2xl border border-[var(--line-strong)] bg-[rgba(20,20,20,0.85)] p-3 shadow-[0_12px_24px_rgba(0,0,0,0.3)]">
    <p class="px-1 text-xs uppercase tracking-[0.11em] text-[var(--text-muted)]">관리 메뉴</p>
    <nav class="mt-2 space-y-1" aria-label="관리자 메뉴">
      <RouterLink
        v-for="item in props.items"
        :key="item.id"
        :to="item.to"
        class="block rounded-lg px-3 py-2 text-sm font-medium transition"
        :class="
          isActive(item.to)
            ? 'border border-[var(--brand-primary)] bg-[rgba(255,255,255,0.08)] text-[var(--text-strong)]'
            : 'border border-transparent text-[var(--text-soft)] hover:border-[var(--line-muted)] hover:bg-[rgba(255,255,255,0.04)] hover:text-white'
        "
      >
        {{ item.label }}
      </RouterLink>
      <button
        type="button"
        class="mt-2 block w-full rounded-lg border border-[#7e3d3d] bg-[#2a1414] px-3 py-2 text-left text-sm font-medium text-rose-300 transition hover:border-[#a34a4a] hover:bg-[#341818] hover:text-rose-200"
        @click="emit('logout')"
      >
        로그아웃
      </button>
    </nav>
  </aside>
</template>
