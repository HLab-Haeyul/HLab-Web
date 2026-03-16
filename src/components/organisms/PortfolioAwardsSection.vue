<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { AwardItem, ProfileShowcaseCopy } from '@/data/portfolio/types'
import { useLocale } from '@/composables/useLocale'

const props = defineProps<{
  profileShowcase: ProfileShowcaseCopy
  isAppLayout: boolean
}>()
const { locale } = useLocale()

const selectedAwardIndex = ref(0)
const selectedAward = computed<AwardItem | null>(() => {
  const index = selectedAwardIndex.value
  const awards = props.profileShowcase.awards

  if (index < 0 || index >= awards.length) {
    return awards[0] ?? null
  }

  return awards[index] ?? null
})

const selectedAwardImageAlt = computed(() => {
  if (!selectedAward.value) {
    return ''
  }

  return selectedAward.value.imageAlt ?? selectedAward.value.title
})

const awardPreviewLabel = computed(() => (locale.value === 'en' ? 'Award Preview' : '수상 미리보기'))
const selectedAwardLabel = computed(() => (locale.value === 'en' ? 'Selected Award' : '선택한 수상'))
const awardPreviewHint = computed(() =>
  locale.value === 'en'
    ? selectedAward.value?.imageSrc
      ? 'Showing the image linked to this award.'
      : 'When an award image is added later, it will appear here.'
    : selectedAward.value?.imageSrc
      ? '선택한 수상에 연결된 이미지를 보고 있습니다.'
      : '실제 수상 사진이 추가되면 이 영역에 바로 표시됩니다.',
)

watch(
  () => props.profileShowcase.awards.length,
  (count) => {
    if (count === 0) {
      selectedAwardIndex.value = 0
      return
    }

    if (selectedAwardIndex.value > count - 1) {
      selectedAwardIndex.value = 0
    }
  },
  { immediate: true },
)
</script>

<template>
  <section :class="isAppLayout ? 'mt-10' : 'mt-12 md:mt-16'">
    <div>
      <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">{{ profileShowcase.kicker }}</p>
      <h2
        class="mt-3 leading-[1.08] text-zinc-100 [font-family:var(--font-display)]"
        :class="isAppLayout ? 'text-[clamp(1.3rem,5vw,1.6rem)]' : 'text-[clamp(1.5rem,3.1vw,2.2rem)]'"
      >
        {{ profileShowcase.heading }}
      </h2>
    </div>

    <article class="mt-4 rounded-2xl border border-[#2a2a2a] bg-[#131313] p-4">
      <p class="text-sm text-zinc-400">{{ profileShowcase.awardsTitle }}</p>

      <div class="mt-4 grid gap-4 xl:grid-cols-[minmax(0,720px)_minmax(300px,360px)] xl:items-start xl:justify-between">
        <div class="relative xl:max-w-[720px]">
          <span
            aria-hidden="true"
            class="pointer-events-none absolute inset-y-6 left-3.5 z-0 w-px bg-gradient-to-b from-transparent via-[#343434] to-transparent"
          ></span>

          <ul>
            <li
              v-for="(award, awardIndex) in profileShowcase.awards"
              :key="`${award.year}-${award.title}`"
              class="relative pl-9 pb-4 last:pb-0"
            >
              <span
                aria-hidden="true"
                class="absolute left-3.5 top-7 z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#8a8a8a] bg-[#131313] shadow-[0_0_0_6px_#131313]"
              ></span>
              <span
                aria-hidden="true"
                class="absolute left-3.5 top-7 z-10 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                :class="selectedAwardIndex === awardIndex ? 'bg-[#8fb4ff]' : 'bg-zinc-200'"
              ></span>

              <button
                type="button"
                class="block w-full rounded-xl border px-3 py-3 text-left transition"
                :class="
                  [
                    selectedAwardIndex === awardIndex
                      ? 'border-[#6f8fce] bg-[#14243d] shadow-[0_0_0_1px_rgba(111,143,206,0.26)]'
                      : 'border-[#242424] bg-[#101010] hover:border-[#37475f] hover:bg-[#121b2b]',
                  ]
                "
                @click="selectedAwardIndex = awardIndex"
              >
                <div class="flex items-start justify-between gap-3">
                  <p
                    class="text-sm font-medium"
                    :class="selectedAwardIndex === awardIndex ? 'text-[#e8efff]' : 'text-zinc-200'"
                  >
                    {{ award.title }}
                  </p>
                  <span
                    class="shrink-0 rounded-full border px-2 py-0.5 text-[11px]"
                    :class="
                      selectedAwardIndex === awardIndex
                        ? 'border-[#51657f] text-[#b9c7dc]'
                        : 'border-[#2f2f2f] text-zinc-500'
                    "
                  >
                    {{ award.year }}
                  </span>
                </div>
                <p
                  class="mt-1 text-xs"
                  :class="selectedAwardIndex === awardIndex ? 'text-[#8fa6c9]' : 'text-zinc-500'"
                >
                  {{ award.organizer }}
                </p>
              </button>
            </li>
          </ul>
        </div>

        <aside
          v-if="selectedAward"
          class="overflow-hidden rounded-[1.4rem] border border-[#273346] bg-[linear-gradient(180deg,#111a27_0%,#0d1524_100%)] shadow-[0_20px_44px_rgba(0,0,0,0.28)] xl:sticky xl:top-24"
        >
          <div v-if="selectedAward.imageSrc" class="aspect-[4/5] overflow-hidden border-b border-[#273346] bg-[#0f1726]">
            <img
              :src="selectedAward.imageSrc"
              :alt="selectedAwardImageAlt"
              class="h-full w-full object-cover"
              loading="lazy"
            />
          </div>

          <div
            v-else
            class="relative flex aspect-[4/5] items-end overflow-hidden border-b border-[#273346] bg-[radial-gradient(circle_at_20%_20%,rgba(111,143,206,0.32),transparent_34%),radial-gradient(circle_at_82%_16%,rgba(255,255,255,0.08),transparent_26%),linear-gradient(160deg,#0d1524_0%,#111a27_48%,#14243d_100%)] p-5"
          >
            <div
              aria-hidden="true"
              class="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#4c6486] bg-[#101827cc] text-[#dce7ff]"
            >
              <svg
                class="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 4H16V7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7V4Z"
                  stroke="currentColor"
                  stroke-width="1.7"
                />
                <path
                  d="M8 6H5V7C5 9.20914 6.79086 11 9 11"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                />
                <path
                  d="M16 6H19V7C19 9.20914 17.2091 11 15 11"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                />
                <path
                  d="M12 11V15"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                />
                <path
                  d="M9 20H15"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                />
                <path
                  d="M10 15H14V17C14 18.1046 13.1046 19 12 19C10.8954 19 10 18.1046 10 17V15Z"
                  stroke="currentColor"
                  stroke-width="1.7"
                />
              </svg>
            </div>

            <div class="relative max-w-[20rem]">
              <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8fa6c9]">
                {{ awardPreviewLabel }}
              </p>
              <h3 class="mt-3 text-xl font-semibold leading-snug text-[#e8efff]">
                {{ selectedAward.title }}
              </h3>
              <p class="mt-3 text-sm leading-6 text-[#b4c0d3]">
                {{ selectedAward.organizer }}
              </p>
            </div>
          </div>

          <div class="space-y-3 p-5">
            <div class="flex items-center justify-between gap-3">
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7e8fa8]">
                {{ selectedAwardLabel }}
              </p>
              <span class="rounded-full border border-[#33455c] bg-[#101827] px-2.5 py-1 text-[11px] text-[#b4c0d3]">
                {{ selectedAward.year }}
              </span>
            </div>

            <h3 class="text-base font-semibold leading-7 text-[#dde6f5]">
              {{ selectedAward.title }}
            </h3>
            <p class="text-sm leading-6 text-[#b4c0d3]">
              {{ selectedAward.organizer }}
            </p>
            <p class="text-xs leading-5 text-[#7e8fa8]">{{ awardPreviewHint }}</p>
          </div>
        </aside>
      </div>
    </article>
  </section>
</template>
