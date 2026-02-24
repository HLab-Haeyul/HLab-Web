<script setup lang="ts">
type BlogCategoryTab = {
  key: string
  title: string
}

type Props = {
  groups: BlogCategoryTab[]
  selectedCategory: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [category: string]
}>()
</script>

<template>
  <div
    class="flex flex-wrap items-center gap-2 rounded-2xl border border-[#e8eef2] bg-white p-2.5 shadow-[0_10px_24px_rgba(15,23,42,0.06)]"
    role="tablist"
    aria-label="Blog categories"
  >
    <button
      v-for="group in props.groups"
      :key="`category-tab-${group.key}`"
      type="button"
      role="tab"
      :aria-selected="props.selectedCategory === group.key"
      class="rounded-xl px-3 py-2 text-sm font-semibold transition"
      :class="
        props.selectedCategory === group.key
          ? 'bg-[#12b886] text-white shadow-[0_8px_20px_rgba(18,184,134,0.25)]'
          : 'bg-[#f5f7f8] text-[#495057] hover:bg-[#edf2f4] hover:text-[#212529]'
      "
      @click="emit('select', group.key)"
    >
      {{ group.title }}
    </button>
  </div>
</template>
