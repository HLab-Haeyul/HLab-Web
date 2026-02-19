<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { portfolioCopyByLocale } from '../../data/portfolio/copy'
import { stackTickerByLocale } from '../../data/stack/stackTicker'
import { useLocale } from '../../composables/useLocale'
import SidebarNavSection from '../molecules/SidebarNavSection.vue'

const { route, locale, basePath, stackPath, isStackPage, koPath, enPath } = useLocale()
const copy = computed(() => portfolioCopyByLocale[locale.value])
const stackTicker = computed(() => stackTickerByLocale[locale.value])
const isSidebarOpen = ref(false)

const pageGroupTitle = computed(() => (locale.value === 'en' ? 'Page Navigation' : '페이지 이동'))
const sectionGroupTitle = computed(() =>
  locale.value === 'en' ? 'Section Navigation' : '페이지 내 위치 이동',
)
const homeNavLabel = computed(() => (locale.value === 'en' ? 'Main' : '메인'))
const profileNavLabel = computed(() => (locale.value === 'en' ? 'Profile' : '프로필'))
const stackOverviewLabel = computed(() => (locale.value === 'en' ? 'Overview' : '개요'))
const stackMatrixLabel = computed(() => (locale.value === 'en' ? 'Skill Matrix' : '기술 매트릭스'))

type SidebarLinkItem = {
  label: string
  to: RouteLocationRaw
  index: string
}

const pageLinks = computed<SidebarLinkItem[]>(() => [
  {
    label: homeNavLabel.value,
    to: basePath.value,
    index: '01',
  },
  {
    label: stackTicker.value.kicker,
    to: stackPath.value,
    index: '02',
  },
])

const sectionLinks = computed<SidebarLinkItem[]>(() => {
  if (isStackPage.value) {
    return [
      {
        label: stackOverviewLabel.value,
        to: {
          path: stackPath.value,
          hash: '#stack-overview',
        },
        index: '01',
      },
      {
        label: stackMatrixLabel.value,
        to: {
          path: stackPath.value,
          hash: '#stack-matrix',
        },
        index: '02',
      },
    ]
  }

  return [
    {
      label: profileNavLabel.value,
      to: {
        path: basePath.value,
        hash: '#profile',
      },
      index: '01',
    },
    {
      label: copy.value.navWork,
      to: {
        path: basePath.value,
        hash: '#work',
      },
      index: '02',
    },
    {
      label: copy.value.navPrinciples,
      to: {
        path: basePath.value,
        hash: '#principles',
      },
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
  ]
})

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
    <header
      class="rounded-2xl border border-[#2a2a2a] bg-[#121212d6] px-3 py-2.5 backdrop-blur sm:px-4 sm:py-3"
    >
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
            <path
              d="M4 7H20M4 12H20M4 17H20"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
          </svg>
        </button>

        <RouterLink
          class="inline-flex items-center gap-2 text-xs font-bold tracking-[0.14em] text-zinc-100"
          :to="basePath"
        >
          <img
            src="../../assets/images/logo.svg"
            alt="HLab logo"
            class="h-5 w-5 shrink-0 rounded-md border border-[#2a2a2a] bg-[#111111] object-contain sm:h-6 sm:w-6"
            loading="eager"
          />
          <span>KIMMINJAE</span>
        </RouterLink>

        <div class="inline-flex rounded-full border border-[#2a2a2a] p-0.5">
          <RouterLink
            class="min-w-9 rounded-full px-2 py-1 text-center text-[11px] tracking-[0.08em] transition"
            :class="
              locale === 'ko' ? 'bg-white !text-[#0f0f0f]' : 'text-zinc-400 hover:text-zinc-100'
            "
            :to="koPath"
          >
            KO
          </RouterLink>
          <RouterLink
            class="min-w-9 rounded-full px-2 py-1 text-center text-[11px] tracking-[0.08em] transition"
            :class="
              locale === 'en' ? 'bg-white !text-[#0f0f0f]' : 'text-zinc-400 hover:text-zinc-100'
            "
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
    :class="
      isSidebarOpen ? 'pointer-events-auto translate-x-0' : 'pointer-events-none -translate-x-full'
    "
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
          <path
            d="M6 6L18 18M18 6L6 18"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </div>

    <div class="space-y-5">
      <SidebarNavSection
        :title="pageGroupTitle"
        nav-aria-label="Page Navigation"
        :links="pageLinks"
        @link-click="closeSidebar"
      />

      <SidebarNavSection
        :title="sectionGroupTitle"
        nav-aria-label="Section Navigation"
        :links="sectionLinks"
        @link-click="closeSidebar"
      />
    </div>
  </aside>
</template>
