<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminAuth } from '@/composables/useAdminAuth'
import { useLocale } from '@/composables/useLocale'

type AdminNavItem = {
  id: string
  label: string
  to: string
}

const { route, adminPath, adminBlogPath, adminProjectPath, adminPortfolioPath } = useLocale()
const router = useRouter()
const { logout } = useAdminAuth()

const adminLoginPath = computed(() => `${adminPath.value}/login`)

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

const handleLogout = async () => {
  await logout()
  await router.replace(adminLoginPath.value)
}
</script>

<template>
  <aside class="rounded-2xl border border-[#273346] bg-[#101827d9] p-3 shadow-[0_12px_24px_rgba(0,0,0,0.3)]">
    <p class="px-1 text-[11px] uppercase tracking-[0.11em] text-[#8494aa]">관리 메뉴</p>
    <nav class="mt-2 space-y-1" aria-label="관리자 메뉴">
      <RouterLink
        v-for="item in navItems"
        :key="item.id"
        :to="item.to"
        class="block rounded-lg px-3 py-2 text-sm font-medium transition"
        :class="
          isActive(item.to)
            ? 'border border-[#6f8fce] bg-[#152847] text-[#d3ddf2]'
            : 'border border-transparent text-[#c3cfdf] hover:border-[#32405a] hover:bg-[#162237] hover:text-white'
        "
      >
        {{ item.label }}
      </RouterLink>
      <button
        type="button"
        class="mt-2 block w-full rounded-lg border border-[#7e3d3d] bg-[#2a1414] px-3 py-2 text-left text-sm font-medium text-rose-300 transition hover:border-[#a34a4a] hover:bg-[#341818] hover:text-rose-200"
        @click="handleLogout"
      >
        로그아웃
      </button>
    </nav>
  </aside>
</template>
