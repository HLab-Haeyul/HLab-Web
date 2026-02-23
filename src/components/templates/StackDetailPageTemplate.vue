<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { stackDetailByLocale } from '@/data/stack/stackDetail'
import { useLocale } from '@/composables/useLocale'
import {
  buildCategoryOptions,
  buildStackSortOptions,
  buildStackUiCopy,
  filterAndSortStackItems,
  type StackSortOption,
} from '@/utils/stackFilters'
import StackMatrix from '@/components/organisms/StackMatrix.vue'

const { locale } = useLocale()
const stackDetail = computed(() => stackDetailByLocale[locale.value])

const selectedCategory = ref('all')
const onlyProjectUsed = ref(false)
const onlyPracticalUsed = ref(false)
const onlyInternalsExplored = ref(false)
const sortOption = ref<StackSortOption>('default')

const sortOptions = computed(() => buildStackSortOptions(locale.value))
const uiCopy = computed(() => buildStackUiCopy(locale.value))
const categoryOptions = computed(() => buildCategoryOptions(stackDetail.value.items))

const filteredItems = computed(() =>
  filterAndSortStackItems({
    items: stackDetail.value.items,
    locale: locale.value,
    selectedCategory: selectedCategory.value,
    onlyProjectUsed: onlyProjectUsed.value,
    onlyPracticalUsed: onlyPracticalUsed.value,
    onlyInternalsExplored: onlyInternalsExplored.value,
    sortOption: sortOption.value,
  }),
)

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

      <StackMatrix
        :stack-detail="stackDetail"
        :ui-copy="uiCopy"
        :sort-options="sortOptions"
        :category-options="categoryOptions"
        :filtered-items="filteredItems"
        :selected-category="selectedCategory"
        :only-project-used="onlyProjectUsed"
        :only-practical-used="onlyPracticalUsed"
        :only-internals-explored="onlyInternalsExplored"
        :sort-option="sortOption"
        @update:selected-category="selectedCategory = $event"
        @update:only-project-used="onlyProjectUsed = $event"
        @update:only-practical-used="onlyPracticalUsed = $event"
        @update:only-internals-explored="onlyInternalsExplored = $event"
        @update:sort-option="sortOption = $event"
        @reset="resetFilters"
      />
    </main>
  </div>
</template>
