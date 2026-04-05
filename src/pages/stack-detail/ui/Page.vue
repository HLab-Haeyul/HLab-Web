<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useLocale } from '@/shared/lib/routing'
import { usePortfolioProfileContent } from '@/entities/profile'
import {
  buildCategoryOptions,
  buildStackSortOptions,
  buildStackUiCopy,
  filterAndSortStackItems,
  type StackSortOption,
} from '@/entities/stack'
import { SceneDivider } from '@/shared/ui'
import { StackMatrix } from '@/widgets/stack'
import PublicPageLayout from '@/widgets/public-layout'

const { locale } = useLocale()
const { stackDetail } = usePortfolioProfileContent(locale)

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

const getSectionRevealStyle = (sectionIndex: number) => ({
  '--section-reveal-delay': `${Math.min(sectionIndex, 8) * 90}ms`,
})

</script>

<template>
  <PublicPageLayout bottom-spacing="roomy">
    <main class="space-y-0">
      <section class="stack-section-reveal" :style="getSectionRevealStyle(0)">
        <section
          id="stack-overview"
          class="ui-intro-shell stack-hero-shell rounded-[2rem] px-0 py-5 sm:py-6 lg:py-7"
        >
          <p class="ui-type-kicker text-[var(--text-muted)]">{{ stackDetail.kicker }}</p>
          <h1 class="ui-type-title-lg mt-3 text-[var(--text-strong)]">
            {{ stackDetail.heading }}
          </h1>
          <p
            v-if="stackDetail.description"
            class="ui-type-body mt-4 max-w-[72ch] text-[var(--text-soft)]"
          >
            {{ stackDetail.description }}
          </p>

        </section>
      </section>

      <section class="stack-section-reveal" :style="getSectionRevealStyle(1)">
        <SceneDivider variant="tree" class="mx-auto mb-[-1.5rem] md:mb-[-2.5rem]" />
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
      </section>
    </main>
  </PublicPageLayout>
</template>

<style scoped>
.stack-section-reveal {
  opacity: 0;
  transform: translateY(12px);
  animation: stack-section-fade-up 560ms cubic-bezier(0.22, 0.8, 0.2, 1) forwards;
  animation-delay: var(--section-reveal-delay, 0ms);
}

@keyframes stack-section-fade-up {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stack-hero-shell {
  border-top: 1px solid var(--line-strong);
}

@media (prefers-reduced-motion: reduce) {
  .stack-section-reveal {
    opacity: 1;
    transform: none;
    animation: none;
  }
}

</style>
