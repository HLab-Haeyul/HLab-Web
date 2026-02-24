<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@/composables/useLocale'

type AdminNavItem = {
  id: string
  label: string
  to: string
}

const { route, adminBlogPath, adminProjectPath, adminPortfolioPath } = useLocale()

const navItems = computed<AdminNavItem[]>(() => [
  {
    id: 'admin-nav-blog',
    label: '글 관리',
    to: adminBlogPath.value,
  },
  {
    id: 'admin-nav-projects',
    label: '프로젝트 관리',
    to: adminProjectPath.value,
  },
  {
    id: 'admin-nav-portfolio',
    label: '포트폴리오 관리',
    to: adminPortfolioPath.value,
  },
])

const isActive = (path: string) => route.path === path || route.path.startsWith(`${path}/`)
</script>

<template>
  <aside class="rounded-2xl border border-[#2a2a2a] bg-[#111111e0] p-3">
    <p class="px-1 text-[11px] uppercase tracking-[0.11em] text-zinc-500">관리 메뉴</p>
    <nav class="mt-2 space-y-1" aria-label="관리자 메뉴">
      <RouterLink
        v-for="item in navItems"
        :key="item.id"
        :to="item.to"
        class="block rounded-lg px-3 py-2 text-sm font-medium transition"
        :class="
          isActive(item.to)
            ? 'border border-[#5f5544] bg-[#211b12] text-amber-200'
            : 'border border-transparent text-zinc-300 hover:border-[#3a3731] hover:bg-[#171717] hover:text-zinc-100'
        "
      >
        {{ item.label }}
      </RouterLink>
    </nav>
  </aside>
</template>
