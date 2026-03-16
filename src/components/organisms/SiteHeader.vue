<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { stackTickerByLocale } from '@/data/stack/stackTicker'
import { useLocale } from '@/composables/useLocale'
import SidebarNavSection from '@/components/molecules/SidebarNavSection.vue'
import logoSrc from '@/assets/images/logo.svg'

const {
  route,
  locale,
  basePath,
  stackPath,
  blogPath,
  projectPath,
  koPath,
  enPath,
} = useLocale()
const stackTicker = computed(() => stackTickerByLocale[locale.value])
const isSidebarOpen = ref(false)
const portfolioPdfHref = `${import.meta.env.BASE_URL}downloads/kimminjae-portfolio.pdf`

const pageGroupTitle = computed(() => (locale.value === 'en' ? 'Page Navigation' : '페이지 이동'))
const homeNavLabel = computed(() => (locale.value === 'en' ? 'Main' : '메인'))
const projectNavLabel = computed(() => (locale.value === 'en' ? 'Projects' : '프로젝트'))
const blogNavLabel = computed(() => (locale.value === 'en' ? 'Blog' : '블로그'))
const portfolioPdfLabel = computed(() =>
  locale.value === 'en' ? 'Portfolio PDF' : '포폴 PDF 받기',
)
const portfolioPdfAriaLabel = computed(() =>
  locale.value === 'en' ? 'Download portfolio PDF' : '포트폴리오 PDF 다운로드',
)

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
  {
    label: projectNavLabel.value,
    to: projectPath.value,
    index: '03',
  },
  {
    label: blogNavLabel.value,
    to: blogPath.value,
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
  <div class="sticky top-2 z-30 mx-auto w-full max-w-[1480px] px-4 pt-4 sm:px-8 lg:px-12">
    <header
      class="rounded-xl border border-[#1f3049] bg-[#050911de] px-3 py-2.5 shadow-[0_18px_42px_rgba(6,18,42,0.38)] backdrop-blur sm:px-4 sm:py-3"
    >
      <div class="flex items-center justify-between gap-2.5">
        <button
          type="button"
          class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#243654] bg-[#08101c] text-[#c3cfdf] transition hover:border-[#5f8cff] hover:bg-[#101a2c] hover:text-white"
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
          class="inline-flex items-center gap-2 text-[13px] font-bold tracking-[0.08em] text-[#dde6f5]"
          :to="basePath"
        >
          <img
            :src="logoSrc"
            alt="HLab logo"
            class="h-5 w-5 shrink-0 rounded-md border border-[#243654] bg-[#0b1322] object-contain sm:h-6 sm:w-6"
            loading="eager"
          />
          <span>KIMMINJAE</span>
        </RouterLink>

        <div class="flex items-center gap-2">
          <a
            class="inline-flex h-9 items-center gap-2 rounded-full border border-[#4167b6] bg-[#142243] px-3 text-[11px] font-semibold tracking-[0.08em] text-[#eef4ff] shadow-[0_10px_24px_rgba(28,61,128,0.28)] transition hover:border-[#5f8cff] hover:bg-[#1a2d57]"
            :href="portfolioPdfHref"
            download="kimminjae-portfolio.pdf"
            :aria-label="portfolioPdfAriaLabel"
          >
            <svg
              class="h-3.5 w-3.5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M12 4V14M12 14L8.5 10.5M12 14L15.5 10.5M5 18H19"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span class="sm:hidden">PDF</span>
            <span class="hidden sm:inline">{{ portfolioPdfLabel }}</span>
          </a>

          <div class="inline-flex rounded-full border border-[#243654] bg-[#08101c] p-1">
            <RouterLink
              class="min-w-9 rounded-full px-2 py-1 text-center text-[11px] tracking-[0.08em] transition"
              :class="
                locale === 'ko'
                  ? 'bg-[#5f8cff] !text-white shadow-[0_8px_18px_rgba(95,140,255,0.34)]'
                  : 'text-[#b4c0d3] hover:text-[#dde6f5]'
              "
              :to="koPath"
            >
              KO
            </RouterLink>
            <RouterLink
              class="min-w-9 rounded-full px-2 py-1 text-center text-[11px] tracking-[0.08em] transition"
              :class="
                locale === 'en'
                  ? 'bg-[#5f8cff] !text-white shadow-[0_8px_18px_rgba(95,140,255,0.34)]'
                  : 'text-[#b4c0d3] hover:text-[#dde6f5]'
              "
              :to="enPath"
            >
              EN
            </RouterLink>
          </div>
        </div>
      </div>
    </header>
  </div>

  <aside
    id="site-sidebar"
    class="fixed left-0 top-0 z-40 h-full w-[76%] max-w-[300px] border-r border-[#223249] bg-[#040912] p-3.5 shadow-[0_24px_42px_rgba(0,0,0,0.52)] transition-transform duration-300 sm:w-[340px] sm:max-w-[340px]"
    :class="
      isSidebarOpen ? 'pointer-events-auto translate-x-0' : 'pointer-events-none -translate-x-full'
    "
  >
    <div class="mb-4 flex items-center justify-between">
      <p class="text-xs tracking-[0.14em] text-[#8494aa]">MENU</p>
      <button
        type="button"
        class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#243654] bg-[#08101c] text-[#c3cfdf] transition hover:border-[#5f8cff] hover:bg-[#101a2c] hover:text-white"
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
    </div>
  </aside>
</template>
