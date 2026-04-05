<script setup lang="ts">
import { computed } from 'vue'
import type { StackDetailCopy, StackDetailItem } from '@/entities/stack'
import type { StackSortOption, StackUiCopy } from '@/entities/stack'
import { CapabilityBadge, SkillIcon } from '@/shared/ui'

const props = defineProps<{
  stackDetail: StackDetailCopy
  uiCopy: StackUiCopy
  sortOptions: Array<{ value: StackSortOption; label: string }>
  categoryOptions: string[]
  filteredItems: StackDetailItem[]
  selectedCategory: string
  onlyProjectUsed: boolean
  onlyPracticalUsed: boolean
  onlyInternalsExplored: boolean
  sortOption: StackSortOption
}>()

const emit = defineEmits<{
  (event: 'update:selectedCategory', value: string): void
  (event: 'update:onlyProjectUsed', value: boolean): void
  (event: 'update:onlyPracticalUsed', value: boolean): void
  (event: 'update:onlyInternalsExplored', value: boolean): void
  (event: 'update:sortOption', value: StackSortOption): void
  (event: 'reset'): void
}>()

const sortOptionModel = computed({
  get: () => props.sortOption,
  set: (value: StackSortOption) => emit('update:sortOption', value),
})

const selectedCategoryModel = computed({
  get: () => props.selectedCategory,
  set: (value: string) => emit('update:selectedCategory', value),
})

const onlyProjectUsedModel = computed({
  get: () => props.onlyProjectUsed,
  set: (value: boolean) => emit('update:onlyProjectUsed', value),
})

const onlyPracticalUsedModel = computed({
  get: () => props.onlyPracticalUsed,
  set: (value: boolean) => emit('update:onlyPracticalUsed', value),
})

const onlyInternalsExploredModel = computed({
  get: () => props.onlyInternalsExplored,
  set: (value: boolean) => emit('update:onlyInternalsExplored', value),
})

</script>

<template>
  <section
    id="stack-matrix"
    class="mt-8 grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)] xl:items-start"
  >
    <aside id="stack-controls" class="stack-filter-panel">
      <div class="stack-filter-panel__header">
        <p class="stack-filter-panel__kicker">{{ uiCopy.filterHeading }}</p>
        <p v-if="uiCopy.filterDescription" class="stack-filter-panel__copy">
          {{ uiCopy.filterDescription }}
        </p>
      </div>

      <div class="stack-filter-fields">
        <label class="stack-filter-field">
          <span class="stack-filter-field__label">{{ uiCopy.sortLabel }}</span>
          <span v-if="uiCopy.sortHint" class="stack-filter-field__hint">{{ uiCopy.sortHint }}</span>
          <div class="stack-select-shell">
            <select v-model="sortOptionModel" class="stack-select-field">
              <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
            <span class="stack-select-icon" aria-hidden="true">⌄</span>
          </div>
        </label>

        <label class="stack-filter-field">
          <span class="stack-filter-field__label">{{ uiCopy.categoryLabel }}</span>
          <span v-if="uiCopy.categoryHint" class="stack-filter-field__hint">
            {{ uiCopy.categoryHint }}
          </span>
          <div class="stack-select-shell">
            <select v-model="selectedCategoryModel" class="stack-select-field">
              <option value="all">{{ uiCopy.allCategory }}</option>
              <option v-for="category in categoryOptions" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
            <span class="stack-select-icon" aria-hidden="true">⌄</span>
          </div>
        </label>
      </div>

      <div class="stack-filter-actions">
        <button type="button" class="stack-reset-button" @click="emit('reset')">
          {{ uiCopy.resetCta }}
        </button>
        <p class="stack-filter-actions__count">
          {{ filteredItems.length }} / {{ stackDetail.items.length }} {{ uiCopy.resultSuffix }}
        </p>
      </div>

      <div class="stack-capability-panel">
        <p class="stack-filter-field__label">{{ uiCopy.capabilityHeading }}</p>
        <p v-if="uiCopy.capabilityDescription" class="stack-filter-field__hint">
          {{ uiCopy.capabilityDescription }}
        </p>

        <div class="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            class="stack-toggle-pill"
            :class="onlyProjectUsedModel ? 'stack-toggle-pill--active' : ''"
            @click="onlyProjectUsedModel = !onlyProjectUsedModel"
          >
            {{ stackDetail.columnProjectUsed }}
          </button>

          <button
            type="button"
            class="stack-toggle-pill"
            :class="onlyPracticalUsedModel ? 'stack-toggle-pill--active' : ''"
            @click="onlyPracticalUsedModel = !onlyPracticalUsedModel"
          >
            {{ stackDetail.columnPracticalUsed }}
          </button>

          <button
            type="button"
            class="stack-toggle-pill"
            :class="onlyInternalsExploredModel ? 'stack-toggle-pill--active' : ''"
            @click="onlyInternalsExploredModel = !onlyInternalsExploredModel"
          >
            {{ stackDetail.columnInternals }}
          </button>
        </div>
      </div>
    </aside>

    <div id="stack-results" class="stack-results-panel">
      <div class="stack-results-panel__header">
        <div>
          <p class="stack-results-panel__kicker">{{ uiCopy.resultsHeading }}</p>
          <p class="stack-results-panel__count">
            {{ filteredItems.length }} / {{ stackDetail.items.length }} {{ uiCopy.resultSuffix }}
          </p>
        </div>
      </div>

      <div v-if="filteredItems.length === 0" class="stack-empty-state">
        {{ uiCopy.emptyMessage }}
      </div>

      <div v-if="filteredItems.length > 0" class="space-y-3 md:hidden">
        <article
          v-for="item in filteredItems"
          :key="`mobile-${item.label}`"
          class="stack-mobile-card"
        >
          <div class="flex items-center justify-between gap-3">
            <div class="flex min-w-0 items-center gap-3">
              <div class="stack-skill-icon-shell">
                <SkillIcon
                  :image-src="item.imageSrc"
                  :image-alt="item.imageAlt"
                  :icon="item.icon"
                  :label="item.label"
                />
              </div>
              <div class="min-w-0">
                <strong class="block truncate text-[var(--text-strong)]">{{ item.label }}</strong>
                <p class="mt-1 text-xs text-[var(--text-muted)]">{{ item.category }}</p>
              </div>
            </div>
            <span class="stack-proficiency-pill">
              {{ item.proficiency }}
            </span>
          </div>

          <dl class="mt-4 grid grid-cols-1 gap-2">
            <div class="stack-mobile-stat">
              <dt class="text-xs text-[var(--text-muted)]">{{ stackDetail.columnProjectUsed }}</dt>
              <dd class="mt-1">
                <CapabilityBadge
                  :value="item.capability.projectUsed"
                  :yes-label="stackDetail.yesLabel"
                  :no-label="stackDetail.noLabel"
                />
              </dd>
            </div>
            <div class="stack-mobile-stat">
              <dt class="text-xs text-[var(--text-muted)]">
                {{ stackDetail.columnPracticalUsed }}
              </dt>
              <dd class="mt-1">
                <CapabilityBadge
                  :value="item.capability.practicalUsed"
                  :yes-label="stackDetail.yesLabel"
                  :no-label="stackDetail.noLabel"
                />
              </dd>
            </div>
            <div class="stack-mobile-stat">
              <dt class="text-xs text-[var(--text-muted)]">{{ stackDetail.columnInternals }}</dt>
              <dd class="mt-1">
                <CapabilityBadge
                  :value="item.capability.internalsExplored"
                  :yes-label="stackDetail.yesLabel"
                  :no-label="stackDetail.noLabel"
                />
              </dd>
            </div>
          </dl>
        </article>
      </div>

      <div v-if="filteredItems.length > 0" class="stack-table-shell hidden md:block">
        <table class="min-w-[980px] w-full border-collapse">
          <thead>
            <tr class="stack-table-head-row">
              <th class="px-4 py-3">{{ stackDetail.columnSkill }}</th>
              <th class="px-4 py-3">{{ stackDetail.columnCategory }}</th>
              <th class="px-4 py-3">{{ stackDetail.columnProficiency }}</th>
              <th class="px-4 py-3">{{ stackDetail.columnProjectUsed }}</th>
              <th class="px-4 py-3">{{ stackDetail.columnPracticalUsed }}</th>
              <th class="px-4 py-3">{{ stackDetail.columnInternals }}</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in filteredItems" :key="item.label" class="stack-table-row">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="stack-skill-icon-shell">
                    <SkillIcon
                      :image-src="item.imageSrc"
                      :image-alt="item.imageAlt"
                      :icon="item.icon"
                      :label="item.label"
                    />
                  </div>
                  <span>{{ item.label }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-[var(--text-soft)]">{{ item.category }}</td>
              <td class="px-4 py-3 text-[var(--text-strong)]">{{ item.proficiency }}</td>
              <td class="px-4 py-3">
                <CapabilityBadge
                  :value="item.capability.projectUsed"
                  :yes-label="stackDetail.yesLabel"
                  :no-label="stackDetail.noLabel"
                />
              </td>
              <td class="px-4 py-3">
                <CapabilityBadge
                  :value="item.capability.practicalUsed"
                  :yes-label="stackDetail.yesLabel"
                  :no-label="stackDetail.noLabel"
                />
              </td>
              <td class="px-4 py-3">
                <CapabilityBadge
                  :value="item.capability.internalsExplored"
                  :yes-label="stackDetail.yesLabel"
                  :no-label="stackDetail.noLabel"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stack-filter-panel {
  border-top: 1px solid var(--line-strong);
  padding-top: 1rem;
}

.stack-filter-panel__header {
  padding-bottom: 1rem;
}

.stack-filter-panel__kicker {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.stack-filter-panel__copy {
  margin: 0.5rem 0 0;
  color: var(--text-soft);
  font-size: 0.92rem;
  line-height: 1.65;
}

.stack-filter-fields {
  display: grid;
  gap: 1rem;
}

.stack-filter-field {
  display: block;
}

.stack-filter-field__label {
  display: block;
  color: var(--text-strong);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.stack-filter-field__hint {
  display: block;
  margin-top: 0.35rem;
  color: var(--text-muted);
  font-size: 0.82rem;
  line-height: 1.55;
}

.stack-select-shell {
  position: relative;
  margin-top: 0.75rem;
}

.stack-select-field {
  width: 100%;
  min-height: 3.5rem;
  padding: 0.95rem 3.5rem 0.95rem 1rem;
  border: 1px solid var(--line-muted);
  border-radius: 1rem;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.04)),
    rgba(255, 255, 255, 0.03);
  color: var(--text-strong);
  font-size: 0.98rem;
  font-weight: 600;
  line-height: 1.45;
  appearance: none;
  cursor: pointer;
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease,
    background-color 180ms ease,
    transform 180ms ease;
}

.stack-select-field:hover {
  border-color: rgba(255, 255, 255, 0.32);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.05)),
    rgba(255, 255, 255, 0.04);
}

.stack-select-field:focus {
  outline: none;
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 3px var(--brand-primary-faint);
}

.stack-select-icon {
  position: absolute;
  top: 50%;
  right: 0.85rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  background: rgba(129, 215, 179, 0.12);
  color: var(--brand-primary);
  font-size: 1rem;
  line-height: 1;
  pointer-events: none;
  transform: translateY(-50%);
}

.stack-filter-actions {
  display: grid;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--line-soft);
}

.stack-reset-button {
  min-height: 2.9rem;
  border: 1px solid var(--line-muted);
  border-radius: 999px;
  background: transparent;
  color: var(--text-strong);
  font-size: 0.9rem;
  font-weight: 600;
  transition:
    border-color 180ms ease,
    background-color 180ms ease,
    color 180ms ease,
    transform 180ms ease;
}

.stack-reset-button:hover {
  border-color: var(--brand-primary);
  background: var(--brand-primary-faint);
}

.stack-reset-button:focus {
  outline: none;
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 3px var(--brand-primary-faint);
}

.stack-filter-actions__count {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.82rem;
}

.stack-capability-panel {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--line-soft);
}

.stack-toggle-pill {
  min-height: 2.75rem;
  padding: 0.7rem 1rem;
  border: 1px solid var(--line-soft);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-soft);
  font-size: 0.88rem;
  font-weight: 600;
  line-height: 1.35;
  transition:
    border-color 180ms ease,
    background-color 180ms ease,
    color 180ms ease,
    transform 180ms ease;
}

.stack-toggle-pill:hover {
  border-color: rgba(255, 255, 255, 0.28);
  color: var(--text-strong);
}

.stack-toggle-pill--active {
  border-color: var(--brand-primary);
  background: var(--brand-primary-faint);
  color: var(--text-strong);
}

.stack-results-panel {
  min-width: 0;
  border-top: 1px solid var(--line-strong);
  padding-top: 1rem;
}

.stack-results-panel__header {
  display: grid;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--line-soft);
}

.stack-results-panel__kicker {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.stack-results-panel__count {
  margin: 0.5rem 0 0;
  color: var(--text-strong);
  font-size: 1rem;
  font-weight: 600;
}

.stack-active-summary {
  min-width: 0;
}

.stack-active-summary__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.7rem;
}

.stack-active-chip {
  display: inline-flex;
  align-items: center;
  min-height: 2rem;
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  border: 1px solid var(--line-soft);
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-soft);
  font-size: 0.8rem;
  font-weight: 600;
}

.stack-empty-state {
  padding: 3.5rem 0;
  color: var(--text-muted);
  font-size: 0.92rem;
  text-align: center;
}

.stack-mobile-card {
  padding: 1rem 0;
  border-bottom: 1px solid var(--line-soft);
}

.stack-mobile-stat {
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.03);
  padding: 0.8rem 0.9rem;
}

.stack-proficiency-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 3.2rem;
  min-height: 2rem;
  padding: 0.25rem 0.8rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-strong);
  font-size: 0.78rem;
  font-weight: 700;
}

.stack-skill-icon-shell {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.8rem;
  background: rgba(255, 255, 255, 0.05);
  flex-shrink: 0;
}

.stack-table-shell {
  overflow-x: auto;
  margin-top: 1rem;
}

.stack-table-head-row {
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-muted);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-align: left;
  text-transform: uppercase;
}

.stack-table-row {
  border-top: 1px solid var(--line-soft);
  color: var(--text-strong);
  font-size: 0.92rem;
  transition: background-color 180ms ease;
}

.stack-table-row:hover {
  background: rgba(255, 255, 255, 0.03);
}

@media (min-width: 768px) {
  .stack-results-panel__header {
    grid-template-columns: minmax(0, 1fr) minmax(240px, 360px);
    align-items: start;
  }
}

@media (min-width: 1280px) {
  .stack-filter-panel {
    position: sticky;
    top: 6rem;
  }
}
</style>
