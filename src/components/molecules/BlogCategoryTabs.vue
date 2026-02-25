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
    class="flex flex-wrap items-center gap-2 rounded-2xl border border-[#273346] bg-[#121b2a] p-2.5"
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
          ? 'bg-[#6f8fce] text-white shadow-[0_8px_20px_rgba(79,141,255,0.24)]'
          : 'bg-[#1a2537] text-[#c3cfdf] hover:bg-[#223047] hover:text-white'
      "
      @click="emit('select', group.key)"
    >
      {{ group.title }}
    </button>
  </div>
</template>
