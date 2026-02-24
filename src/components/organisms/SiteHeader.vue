<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
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
  koPath,
  enPath,
} = useLocale()
const stackTicker = computed(() => stackTickerByLocale[locale.value])
const isSidebarOpen = ref(false)
const headingSectionLinks = ref<SidebarLinkItem[]>([])

const pageGroupTitle = computed(() => (locale.value === 'en' ? 'Page Navigation' : '페이지 이동'))
const sectionGroupTitle = computed(() =>
  locale.value === 'en' ? 'Section Navigation' : '페이지 내 위치 이동',
)
const homeNavLabel = computed(() => (locale.value === 'en' ? 'Main' : '메인'))
const blogNavLabel = computed(() => (locale.value === 'en' ? 'Blog' : '블로그'))

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
    label: blogNavLabel.value,
    to: blogPath.value,
    index: '03',
  },
])

const sectionLinks = computed<SidebarLinkItem[]>(() => headingSectionLinks.value)

const closeSidebar = () => {
  isSidebarOpen.value = false
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const normalizeHeadingText = (value: string) => value.replace(/\s+/g, ' ').trim()

const toHeadingId = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .replace(/[^a-z0-9\u3131-\u318e\uac00-\ud7a3\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')

let collectRafId: number | null = null
let headingObserver: MutationObserver | null = null

const collectHeadingLinks = () => {
  const main = document.querySelector('main')

  if (!main) {
    headingSectionLinks.value = []
    return
  }

  const usedIds = new Set<string>()
  const links: SidebarLinkItem[] = []
  const headings = Array.from(main.querySelectorAll('h1, h2, h3'))

  headings.forEach((heading, headingIndex) => {
    const text = normalizeHeadingText(heading.textContent ?? '')

    if (!text) {
      return
    }

    if (!(heading instanceof HTMLElement) || heading.offsetParent === null) {
      return
    }

    let id = heading.id

    if (!id) {
      const baseId = toHeadingId(text) || `section-${headingIndex + 1}`
      let nextId = baseId
      let duplicateIndex = 2

      while (usedIds.has(nextId) || document.getElementById(nextId)) {
        nextId = `${baseId}-${duplicateIndex}`
        duplicateIndex += 1
      }

      heading.id = nextId
      id = nextId
    }

    usedIds.add(id)
    links.push({
      label: text,
      to: {
        path: route.path,
        query: route.query,
        hash: `#${id}`,
      },
      index: String(links.length + 1).padStart(2, '0'),
    })
  })

  headingSectionLinks.value = links
}

const scheduleCollectHeadingLinks = () => {
  if (typeof window === 'undefined') {
    return
  }

  if (collectRafId !== null) {
    cancelAnimationFrame(collectRafId)
  }

  collectRafId = window.requestAnimationFrame(() => {
    collectRafId = null
    collectHeadingLinks()
  })
}

const disconnectHeadingObserver = () => {
  if (!headingObserver) {
    return
  }

  headingObserver.disconnect()
  headingObserver = null
}

const connectHeadingObserver = () => {
  if (typeof window === 'undefined') {
    return
  }

  disconnectHeadingObserver()

  const main = document.querySelector('main')

  if (!main) {
    return
  }

  headingObserver = new MutationObserver(() => {
    scheduleCollectHeadingLinks()
  })

  headingObserver.observe(main, {
    childList: true,
    subtree: true,
    characterData: true,
  })
}

onMounted(() => {
  scheduleCollectHeadingLinks()
  connectHeadingObserver()
})

onBeforeUnmount(() => {
  disconnectHeadingObserver()

  if (collectRafId !== null) {
    cancelAnimationFrame(collectRafId)
    collectRafId = null
  }
})

watch(
  () => route.fullPath,
  async () => {
    closeSidebar()

    await nextTick()
    scheduleCollectHeadingLinks()
    connectHeadingObserver()
  },
)
</script>

<template>
  <div class="sticky top-3 z-30 mx-auto w-full max-w-[1480px] px-4 pt-5 sm:px-8 lg:px-12">
    <header
      class="rounded-2xl border border-[#2a2a2a] bg-[#121212d6] px-4 py-3 backdrop-blur sm:px-5 sm:py-3.5"
    >
      <div class="flex items-center justify-between gap-3">
        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#2a2a2a] text-zinc-200"
          @click="toggleSidebar"
          aria-label="Open sidebar"
          :aria-expanded="isSidebarOpen"
          aria-controls="site-sidebar"
        >
          <svg
            class="h-5 w-5"
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
          class="inline-flex items-center gap-2.5 text-sm font-bold tracking-[0.12em] text-zinc-100"
          :to="basePath"
        >
          <img
            :src="logoSrc"
            alt="HLab logo"
            class="h-6 w-6 shrink-0 rounded-md border border-[#2a2a2a] bg-[#111111] object-contain sm:h-7 sm:w-7"
            loading="eager"
          />
          <span>KIMMINJAE</span>
        </RouterLink>

        <div class="inline-flex rounded-full border border-[#2a2a2a] p-1">
          <RouterLink
            class="min-w-10 rounded-full px-2.5 py-1.5 text-center text-xs tracking-[0.08em] transition"
            :class="
              locale === 'ko' ? 'bg-white !text-[#0f0f0f]' : 'text-zinc-400 hover:text-zinc-100'
            "
            :to="koPath"
          >
            KO
          </RouterLink>
          <RouterLink
            class="min-w-10 rounded-full px-2.5 py-1.5 text-center text-xs tracking-[0.08em] transition"
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
