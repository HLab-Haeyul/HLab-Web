<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { portfolioCopyByLocale } from '../features/portfolio/copy'
import { stackTickerByLocale } from '../features/portfolio/stackTicker'
import type { Locale } from '../features/portfolio/types'

const route = useRoute()
const locale = computed<Locale>(() => (route.path.startsWith('/en') ? 'en' : 'ko'))
const copy = computed(() => portfolioCopyByLocale[locale.value])
const stackTicker = computed(() => stackTickerByLocale[locale.value])
const isSidebarOpen = ref(false)

const basePath = computed(() => (locale.value === 'en' ? '/en' : '/ko'))
const stackPath = computed(() => `${basePath.value}/stack`)
const koPath = computed(() => (route.path.endsWith('/stack') ? '/ko/stack' : '/ko'))
const enPath = computed(() => (route.path.endsWith('/stack') ? '/en/stack' : '/en'))

const navLinks = computed(() => [
  {
    label: copy.value.navWork,
    to: {
      path: basePath.value,
      hash: '#work',
    },
    index: '01',
  },
  {
    label: copy.value.navPrinciples,
    to: {
      path: basePath.value,
      hash: '#principles',
    },
    index: '02',
  },
  {
    label: stackTicker.value.kicker,
    to: stackPath.value,
    index: '03',
  },
  {
    label: copy.value.navContact,
    to: {
      path: basePath.value,
      hash: '#contact',
    },
    index: '04',
  },
])

const closeSidebar = () => {
  isSidebarOpen.value = false
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

watch(
  () => route.fullPath,
  () => {
    closeSidebar()
  },
)
</script>

<template>
  <div class="sticky top-3 z-30 mx-auto w-full max-w-[1220px] px-4 pt-5 sm:px-8 lg:px-12">
    <header class="rounded-2xl border border-[#2a2a2a] bg-[#121212d6] px-3 py-2.5 backdrop-blur sm:px-4 sm:py-3">
      <div class="flex items-center justify-between gap-3">
        <button
          type="button"
          class="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#2a2a2a] text-zinc-200"
          @click="toggleSidebar"
          aria-label="Open sidebar"
          :aria-expanded="isSidebarOpen"
          aria-controls="site-sidebar"
        >
          <svg
            class="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </button>

        <RouterLink class="text-xs font-bold tracking-[0.14em] text-zinc-100" :to="basePath">KIMMINJAE</RouterLink>

        <div class="inline-flex rounded-full border border-[#2a2a2a] p-0.5">
          <RouterLink
            class="min-w-9 rounded-full px-2 py-1 text-center text-[11px] tracking-[0.08em] transition"
            :class="locale === 'ko' ? 'bg-white !text-[#0f0f0f]' : 'text-zinc-400 hover:text-zinc-100'"
            :to="koPath"
          >
            KO
          </RouterLink>
          <RouterLink
            class="min-w-9 rounded-full px-2 py-1 text-center text-[11px] tracking-[0.08em] transition"
            :class="locale === 'en' ? 'bg-white !text-[#0f0f0f]' : 'text-zinc-400 hover:text-zinc-100'"
            :to="enPath"
          >
            EN
          </RouterLink>
        </div>
      </div>
    </header>
  </div>

  <aside
    id="site-sidebar"
    class="fixed left-0 top-0 z-40 h-full w-[78%] max-w-[320px] border-r border-[#2a2a2a] bg-[#101010] p-4 shadow-2xl transition-transform duration-300 sm:w-[360px] sm:max-w-[360px]"
    :class="isSidebarOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none'"
  >
    <div class="mb-5 flex items-center justify-between">
      <p class="text-xs tracking-[0.14em] text-zinc-400">MENU</p>
      <button
        type="button"
        class="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#2a2a2a] text-zinc-300"
        @click="closeSidebar"
        aria-label="Close sidebar"
      >
        <svg
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
      </button>
    </div>

    <nav class="border-y border-[#222222]" aria-label="Primary Sidebar">
      <RouterLink
        v-for="item in navLinks"
        :key="item.index"
        class="group flex items-center justify-between border-b border-[#222222] py-3 text-[15px] transition last:border-b-0"
        :to="item.to"
        @click="closeSidebar"
      >
        <span class="text-zinc-300 transition-colors group-hover:text-white">{{ item.label }}</span>
        <span class="text-xs tracking-[0.08em] text-zinc-600 transition-colors group-hover:text-white">
          {{ item.index }}
        </span>
      </RouterLink>
    </nav>
  </aside>
</template>
