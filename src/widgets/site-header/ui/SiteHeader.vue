<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { usePortfolioProfileContent } from '@/entities/profile'
import { EXTERNAL_BLOG_URL } from '@/shared/config/externalLinks'
import { useLocale } from '@/shared/lib/routing'
import { SidebarNavSection } from '@/shared/ui'
import logoSrc from '@/shared/assets/images/logo.svg'

const {
  route,
  locale,
  basePath,
  stackPath,
  projectPath,
  koPath,
  enPath,
} = useLocale()
const { stackTicker } = usePortfolioProfileContent(locale)
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
  index: string
  to?: string
  href?: string
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
    href: EXTERNAL_BLOG_URL,
    index: '04',
  },
])

const closeSidebar = () => {
  isSidebarOpen.value = false
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const isPageLinkActive = (targetPath?: string) => {
  if (!targetPath) {
    return false
  }

  if (targetPath === basePath.value) {
    return route.path === targetPath
  }

  return route.path === targetPath || route.path.startsWith(`${targetPath}/`)
}

watch(
  () => route.fullPath,
  () => {
    closeSidebar()
  },
)
</script>

<template>
  <div class="sticky top-0 z-30 w-full border-b border-[var(--line-soft)] bg-[rgba(21,21,21,0.88)] backdrop-blur-md">
    <div class="mx-auto w-full max-w-[1400px] px-4 sm:px-7 lg:px-10">
      <header class="px-1 py-2.5 sm:py-2.5">
        <div class="flex items-center gap-3 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-6">
          <div class="flex items-center gap-2.5">
            <button
              type="button"
              class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-[var(--text-soft)] transition hover:border-[var(--line-strong)] hover:text-[var(--text-strong)] lg:hidden"
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
              class="inline-flex items-center gap-2 text-sm font-bold tracking-[0.08em] text-[var(--text-strong)]"
              :to="basePath"
            >
              <img
                :src="logoSrc"
                alt="HLab logo"
                class="h-5 w-5 shrink-0 object-contain sm:h-6 sm:w-6"
                loading="eager"
              />
              <span>KIMMINJAE</span>
            </RouterLink>
          </div>

          <nav
            class="hidden min-w-0 items-center justify-center gap-1 rounded-full border border-[var(--line-soft)] bg-[rgba(255,255,255,0.02)] px-2 py-1 lg:flex"
            :aria-label="pageGroupTitle"
          >
            <template v-for="link in pageLinks" :key="`desktop-nav-${link.index}`">
              <a
                v-if="link.href"
                :href="link.href"
                class="inline-flex min-w-[5.25rem] items-center justify-center rounded-full px-3 py-2 text-xs font-semibold tracking-[0.08em] text-[var(--text-soft)] transition hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--text-strong)]"
              >
                {{ link.label }}
              </a>
              <RouterLink
                v-else
                :to="link.to!"
                class="inline-flex min-w-[5.25rem] items-center justify-center rounded-full px-3 py-2 text-xs font-semibold tracking-[0.08em] transition"
                :class="
                  isPageLinkActive(link.to)
                    ? 'bg-[rgba(255,255,255,0.12)] text-[var(--text-strong)] shadow-[0_10px_20px_rgba(0,0,0,0.14)]'
                    : 'text-[var(--text-soft)] hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--text-strong)]'
                "
              >
                {{ link.label }}
              </RouterLink>
            </template>
          </nav>

          <div class="ml-auto flex items-center gap-2 lg:ml-0">
            <a
              class="inline-flex h-9 items-center gap-2 rounded-full border border-transparent px-3 text-xs font-semibold tracking-[0.08em] text-[var(--text-soft)] transition hover:border-[var(--line-strong)] hover:text-[var(--text-strong)]"
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

            <div class="inline-flex items-center gap-1 rounded-full border border-transparent p-1">
              <RouterLink
                class="min-w-9 rounded-full px-2 py-1 text-center text-xs tracking-[0.08em] transition"
                :class="
                  locale === 'ko'
                    ? 'border-b border-[var(--brand-primary)] text-[var(--brand-primary)]'
                    : 'text-[var(--text-soft)] hover:text-[var(--text-strong)]'
                "
                :to="koPath"
              >
                KO
              </RouterLink>
              <RouterLink
                class="min-w-9 rounded-full px-2 py-1 text-center text-xs tracking-[0.08em] transition"
                :class="
                  locale === 'en'
                    ? 'border-b border-[var(--brand-primary)] text-[var(--brand-primary)]'
                    : 'text-[var(--text-soft)] hover:text-[var(--text-strong)]'
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
  </div>

  <aside
    id="site-sidebar"
    class="fixed left-0 top-0 z-40 h-full w-[76%] max-w-[300px] border-r border-[var(--line-soft)] bg-[rgba(18,18,18,0.98)] p-3.5 transition-transform duration-300 sm:w-[340px] sm:max-w-[340px]"
    :class="isSidebarOpen ? 'pointer-events-auto translate-x-0' : 'pointer-events-none -translate-x-full'"
  >
    <div class="mb-4 flex items-center justify-between">
      <p class="text-xs tracking-[0.14em] text-[var(--text-muted)]">MENU</p>
      <button
        type="button"
        class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-transparent text-[var(--text-soft)] transition hover:border-[var(--line-strong)] hover:text-[var(--text-strong)]"
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
