<script setup lang="ts">
import { computed } from 'vue'
import type { StackDetailCopy, StackDetailItem } from '../../data/stack/types'
import type { StackSortOption, StackUiCopy } from '../../utils/stackFilters'
import CapabilityBadge from '../atoms/CapabilityBadge.vue'
import SkillIcon from '../atoms/SkillIcon.vue'

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
  <section id="stack-matrix" class="mt-8">
    <article class="rounded-2xl border border-[#2a2a2a] bg-[#131313] p-4">
      <div class="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label class="block">
            <span class="text-[11px] uppercase tracking-[0.11em] text-zinc-500">{{ uiCopy.sortLabel }}</span>
            <select
              v-model="sortOptionModel"
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
              v-model="selectedCategoryModel"
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
          @click="emit('reset')"
        >
          {{ uiCopy.resetCta }}
        </button>
      </div>

      <div class="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          class="inline-flex rounded-full border px-2.5 py-1 text-xs transition"
          :class="
            onlyProjectUsedModel
              ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-300'
              : 'border-[#2f2f2f] bg-[#111111] text-zinc-400 hover:text-zinc-200'
          "
          @click="onlyProjectUsedModel = !onlyProjectUsedModel"
        >
          {{ stackDetail.columnProjectUsed }}
        </button>

        <button
          type="button"
          class="inline-flex rounded-full border px-2.5 py-1 text-xs transition"
          :class="
            onlyPracticalUsedModel
              ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-300'
              : 'border-[#2f2f2f] bg-[#111111] text-zinc-400 hover:text-zinc-200'
          "
          @click="onlyPracticalUsedModel = !onlyPracticalUsedModel"
        >
          {{ stackDetail.columnPracticalUsed }}
        </button>

        <button
          type="button"
          class="inline-flex rounded-full border px-2.5 py-1 text-xs transition"
          :class="
            onlyInternalsExploredModel
              ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-300'
              : 'border-[#2f2f2f] bg-[#111111] text-zinc-400 hover:text-zinc-200'
          "
          @click="onlyInternalsExploredModel = !onlyInternalsExploredModel"
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
            <SkillIcon
              :image-src="item.imageSrc"
              :image-alt="item.imageAlt"
              :icon="item.icon"
              :label="item.label"
            />
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
              <CapabilityBadge
                :value="item.capability.projectUsed"
                :yes-label="stackDetail.yesLabel"
                :no-label="stackDetail.noLabel"
              />
            </dd>
          </div>
          <div class="rounded-xl border border-[#242424] bg-[#111111] p-2.5">
            <dt class="text-[11px] text-zinc-500">{{ stackDetail.columnPracticalUsed }}</dt>
            <dd class="mt-1">
              <CapabilityBadge
                :value="item.capability.practicalUsed"
                :yes-label="stackDetail.yesLabel"
                :no-label="stackDetail.noLabel"
              />
            </dd>
          </div>
          <div class="rounded-xl border border-[#242424] bg-[#111111] p-2.5">
            <dt class="text-[11px] text-zinc-500">{{ stackDetail.columnInternals }}</dt>
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

    <div
      v-if="filteredItems.length > 0"
      class="mt-4 hidden overflow-x-auto rounded-2xl border border-[#2a2a2a] bg-[#131313] md:block"
    >
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
                <SkillIcon
                  :image-src="item.imageSrc"
                  :image-alt="item.imageAlt"
                  :icon="item.icon"
                  :label="item.label"
                />
                <span>{{ item.label }}</span>
              </div>
            </td>
            <td class="px-4 py-3 text-zinc-300">{{ item.category }}</td>
            <td class="px-4 py-3 text-zinc-100">{{ item.proficiency }}</td>
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
  </section>
</template>
