<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { stackDetailByLocale } from '../features/portfolio/stackDetail'
import type { Locale, StackDetailItem } from '../features/portfolio/types'

const route = useRoute()
const locale = computed<Locale>(() => (route.path.startsWith('/en') ? 'en' : 'ko'))
const stackDetail = computed(() => stackDetailByLocale[locale.value])

type StackSortOption = 'default' | 'nameAsc' | 'categoryAsc' | 'proficiencyDesc' | 'capabilityDesc'

const selectedCategory = ref('all')
const onlyProjectUsed = ref(false)
const onlyPracticalUsed = ref(false)
const onlyInternalsExplored = ref(false)
const sortOption = ref<StackSortOption>('default')

const sortOptions = computed<Array<{ value: StackSortOption; label: string }>>(() =>
  locale.value === 'ko'
    ? [
        { value: 'default', label: '기본 순서' },
        { value: 'nameAsc', label: '이름순' },
        { value: 'categoryAsc', label: '분야순' },
        { value: 'proficiencyDesc', label: '숙련도 높은순' },
        { value: 'capabilityDesc', label: '사용 경험 많은순' },
      ]
    : [
        { value: 'default', label: 'Default order' },
        { value: 'nameAsc', label: 'Name (A-Z)' },
        { value: 'categoryAsc', label: 'Category (A-Z)' },
        { value: 'proficiencyDesc', label: 'Highest proficiency' },
        { value: 'capabilityDesc', label: 'Most usage experience' },
      ],
)

const uiCopy = computed(() =>
  locale.value === 'ko'
    ? {
        sortLabel: '정렬',
        categoryLabel: '분야 필터',
        allCategory: '전체',
        resetCta: '필터 초기화',
        resultSuffix: '개 표시 중',
        emptyMessage: '조건에 맞는 기술 스택이 없습니다.',
      }
    : {
        sortLabel: 'Sort',
        categoryLabel: 'Category filter',
        allCategory: 'All',
        resetCta: 'Reset filters',
        resultSuffix: 'items shown',
        emptyMessage: 'No stack items match the selected filters.',
      },
)

const categoryOptions = computed(() => {
  const orderedUnique = new Set(stackDetail.value.items.map((item) => item.category))
  return Array.from(orderedUnique)
})

const capabilityScore = (item: StackDetailItem) =>
  Number(item.capability.projectUsed) +
  Number(item.capability.practicalUsed) +
  Number(item.capability.internalsExplored)

const proficiencyRank = (value: string) => {
  if (locale.value === 'ko') {
    const rankMap: Record<string, number> = {
      상: 5,
      중상: 4,
      중: 3,
      중하: 2,
      하: 1,
    }

    return rankMap[value] ?? 0
  }

  const normalized = value.toLowerCase()

  if (normalized.includes('advanced')) {
    return 5
  }
  if (normalized.includes('upper-intermediate')) {
    return 4
  }
  if (normalized.includes('intermediate')) {
    return 3
  }
  if (normalized.includes('beginner')) {
    return 1
  }

  return 0
}

const filteredItems = computed(() => {
  const filtered = stackDetail.value.items.filter((item) => {
    if (selectedCategory.value !== 'all' && item.category !== selectedCategory.value) {
      return false
    }
    if (onlyProjectUsed.value && !item.capability.projectUsed) {
      return false
    }
    if (onlyPracticalUsed.value && !item.capability.practicalUsed) {
      return false
    }
    if (onlyInternalsExplored.value && !item.capability.internalsExplored) {
      return false
    }

    return true
  })

  const sorted = [...filtered]

  if (sortOption.value === 'nameAsc') {
    return sorted.sort((a, b) => a.label.localeCompare(b.label))
  }

  if (sortOption.value === 'categoryAsc') {
    return sorted.sort((a, b) => {
      const categoryCompare = a.category.localeCompare(b.category)
      if (categoryCompare !== 0) {
        return categoryCompare
      }
      return a.label.localeCompare(b.label)
    })
  }

  if (sortOption.value === 'proficiencyDesc') {
    return sorted.sort((a, b) => {
      const proficiencyCompare = proficiencyRank(b.proficiency) - proficiencyRank(a.proficiency)
      if (proficiencyCompare !== 0) {
        return proficiencyCompare
      }
      const capabilityCompare = capabilityScore(b) - capabilityScore(a)
      if (capabilityCompare !== 0) {
        return capabilityCompare
      }
      return a.label.localeCompare(b.label)
    })
  }

  if (sortOption.value === 'capabilityDesc') {
    return sorted.sort((a, b) => {
      const capabilityCompare = capabilityScore(b) - capabilityScore(a)
      if (capabilityCompare !== 0) {
        return capabilityCompare
      }
      const proficiencyCompare = proficiencyRank(b.proficiency) - proficiencyRank(a.proficiency)
      if (proficiencyCompare !== 0) {
        return proficiencyCompare
      }
      return a.label.localeCompare(b.label)
    })
  }

  return sorted
})

const resetFilters = () => {
  selectedCategory.value = 'all'
  onlyProjectUsed.value = false
  onlyPracticalUsed.value = false
  onlyInternalsExplored.value = false
  sortOption.value = 'default'
}

watch(locale, () => {
  resetFilters()
})

const yesNoClass = (value: boolean) =>
  value
    ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-300'
    : 'border-zinc-700 bg-zinc-900 text-zinc-400'
</script>

<template>
  <div class="relative isolate mx-auto min-h-screen w-full max-w-[1220px] px-4 pb-14 pt-5 sm:px-8 lg:px-12">
    <div
      aria-hidden="true"
      class="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_-4%,rgba(255,255,255,0.08),transparent_30%),radial-gradient(circle_at_82%_108%,rgba(255,255,255,0.07),transparent_34%)] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.88),rgba(0,0,0,0.42))]"
    ></div>

    <main>
      <section id="stack-overview">
        <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">{{ stackDetail.kicker }}</p>
        <h1 class="mt-3 text-[clamp(1.8rem,5vw,3rem)] leading-[1.03] text-zinc-100 [font-family:var(--font-display)]">
          {{ stackDetail.heading }}
        </h1>
        <p class="mt-4 max-w-[72ch] text-zinc-300">{{ stackDetail.description }}</p>
      </section>

      <section id="stack-matrix" class="mt-8">
        <article class="rounded-2xl border border-[#2a2a2a] bg-[#131313] p-4">
          <div class="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label class="block">
                <span class="text-[11px] uppercase tracking-[0.11em] text-zinc-500">{{ uiCopy.sortLabel }}</span>
                <select
                  v-model="sortOption"
                  class="mt-1.5 w-full rounded-xl border border-[#2a2a2a] bg-[#101010] px-3 py-2 text-sm text-zinc-200 outline-none transition focus:border-zinc-500"
                >
                  <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </label>

              <label class="block">
                <span class="text-[11px] uppercase tracking-[0.11em] text-zinc-500">{{ uiCopy.categoryLabel }}</span>
                <select
                  v-model="selectedCategory"
                  class="mt-1.5 w-full rounded-xl border border-[#2a2a2a] bg-[#101010] px-3 py-2 text-sm text-zinc-200 outline-none transition focus:border-zinc-500"
                >
                  <option value="all">{{ uiCopy.allCategory }}</option>
                  <option v-for="category in categoryOptions" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
              </label>
            </div>

            <button
              type="button"
              class="inline-flex items-center justify-center rounded-xl border border-[#2a2a2a] bg-[#111111] px-3 py-2 text-sm text-zinc-300 transition hover:border-[#3a3a3a] hover:text-white"
              @click="resetFilters"
            >
              {{ uiCopy.resetCta }}
            </button>
          </div>

          <div class="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              class="inline-flex rounded-full border px-2.5 py-1 text-xs transition"
              :class="
                onlyProjectUsed
                  ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-300'
                  : 'border-[#2f2f2f] bg-[#111111] text-zinc-400 hover:text-zinc-200'
              "
              @click="onlyProjectUsed = !onlyProjectUsed"
            >
              {{ stackDetail.columnProjectUsed }}
            </button>
            <button
              type="button"
              class="inline-flex rounded-full border px-2.5 py-1 text-xs transition"
              :class="
                onlyPracticalUsed
                  ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-300'
                  : 'border-[#2f2f2f] bg-[#111111] text-zinc-400 hover:text-zinc-200'
              "
              @click="onlyPracticalUsed = !onlyPracticalUsed"
            >
              {{ stackDetail.columnPracticalUsed }}
            </button>
            <button
              type="button"
              class="inline-flex rounded-full border px-2.5 py-1 text-xs transition"
              :class="
                onlyInternalsExplored
                  ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-300'
                  : 'border-[#2f2f2f] bg-[#111111] text-zinc-400 hover:text-zinc-200'
              "
              @click="onlyInternalsExplored = !onlyInternalsExplored"
            >
              {{ stackDetail.columnInternals }}
            </button>
          </div>

          <p class="mt-3 text-xs text-zinc-500">
            {{ filteredItems.length }} / {{ stackDetail.items.length }} {{ uiCopy.resultSuffix }}
          </p>
        </article>

        <div
          v-if="filteredItems.length === 0"
          class="mt-4 rounded-2xl border border-dashed border-[#2f2f2f] bg-[#121212] px-4 py-10 text-center text-sm text-zinc-500"
        >
          {{ uiCopy.emptyMessage }}
        </div>

        <div v-if="filteredItems.length > 0" class="mt-4 space-y-3 md:hidden">
          <article
            v-for="item in filteredItems"
            :key="`mobile-${item.label}`"
            class="rounded-2xl border border-[#2a2a2a] bg-[#131313] p-4"
          >
            <div class="flex items-center justify-between gap-3">
              <div class="flex min-w-0 items-center gap-2">
                <img
                  v-if="item.imageSrc"
                  :src="item.imageSrc"
                  :alt="item.imageAlt ?? item.label"
                  class="h-5 w-5 object-contain"
                  loading="lazy"
                />
                <span v-else class="text-base leading-none">{{ item.icon ?? '•' }}</span>
                <strong class="truncate text-zinc-100">{{ item.label }}</strong>
              </div>
              <span class="shrink-0 rounded-full border border-[#323232] px-2.5 py-1 text-xs text-zinc-300">
                {{ item.proficiency }}
              </span>
            </div>

            <p class="mt-2 text-xs text-zinc-500">{{ item.category }}</p>
            <dl class="mt-4 grid grid-cols-1 gap-2">
              <div class="rounded-xl border border-[#242424] bg-[#111111] p-2.5">
                <dt class="text-[11px] text-zinc-500">{{ stackDetail.columnProjectUsed }}</dt>
                <dd class="mt-1">
                  <span class="inline-flex rounded-full border px-2.5 py-1 text-xs" :class="yesNoClass(item.capability.projectUsed)">
                    {{ item.capability.projectUsed ? stackDetail.yesLabel : stackDetail.noLabel }}
                  </span>
                </dd>
              </div>
              <div class="rounded-xl border border-[#242424] bg-[#111111] p-2.5">
                <dt class="text-[11px] text-zinc-500">{{ stackDetail.columnPracticalUsed }}</dt>
                <dd class="mt-1">
                  <span class="inline-flex rounded-full border px-2.5 py-1 text-xs" :class="yesNoClass(item.capability.practicalUsed)">
                    {{ item.capability.practicalUsed ? stackDetail.yesLabel : stackDetail.noLabel }}
                  </span>
                </dd>
              </div>
              <div class="rounded-xl border border-[#242424] bg-[#111111] p-2.5">
                <dt class="text-[11px] text-zinc-500">{{ stackDetail.columnInternals }}</dt>
                <dd class="mt-1">
                  <span class="inline-flex rounded-full border px-2.5 py-1 text-xs" :class="yesNoClass(item.capability.internalsExplored)">
                    {{ item.capability.internalsExplored ? stackDetail.yesLabel : stackDetail.noLabel }}
                  </span>
                </dd>
              </div>
            </dl>
          </article>
        </div>

        <div v-if="filteredItems.length > 0" class="mt-4 hidden overflow-x-auto rounded-2xl border border-[#2a2a2a] bg-[#131313] md:block">
          <table class="min-w-[980px] w-full border-collapse">
            <thead class="bg-[#151515]">
              <tr class="text-left text-xs uppercase tracking-[0.09em] text-zinc-500">
                <th class="px-4 py-3">{{ stackDetail.columnSkill }}</th>
                <th class="px-4 py-3">{{ stackDetail.columnCategory }}</th>
                <th class="px-4 py-3">{{ stackDetail.columnProficiency }}</th>
                <th class="px-4 py-3">{{ stackDetail.columnProjectUsed }}</th>
                <th class="px-4 py-3">{{ stackDetail.columnPracticalUsed }}</th>
                <th class="px-4 py-3">{{ stackDetail.columnInternals }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in filteredItems"
                :key="item.label"
                class="border-t border-[#232323] align-top text-sm text-zinc-200"
              >
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <img
                      v-if="item.imageSrc"
                      :src="item.imageSrc"
                      :alt="item.imageAlt ?? item.label"
                      class="h-5 w-5 object-contain"
                      loading="lazy"
                    />
                    <span v-else class="text-base leading-none">{{ item.icon ?? '•' }}</span>
                    <span>{{ item.label }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-zinc-300">{{ item.category }}</td>
                <td class="px-4 py-3 text-zinc-100">{{ item.proficiency }}</td>
                <td class="px-4 py-3">
                  <span class="inline-flex rounded-full border px-2.5 py-1 text-xs" :class="yesNoClass(item.capability.projectUsed)">
                    {{ item.capability.projectUsed ? stackDetail.yesLabel : stackDetail.noLabel }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span class="inline-flex rounded-full border px-2.5 py-1 text-xs" :class="yesNoClass(item.capability.practicalUsed)">
                    {{ item.capability.practicalUsed ? stackDetail.yesLabel : stackDetail.noLabel }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span class="inline-flex rounded-full border px-2.5 py-1 text-xs" :class="yesNoClass(item.capability.internalsExplored)">
                    {{ item.capability.internalsExplored ? stackDetail.yesLabel : stackDetail.noLabel }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>
