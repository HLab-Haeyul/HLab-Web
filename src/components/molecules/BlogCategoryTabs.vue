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
    class="flex flex-wrap items-center gap-2 rounded-2xl border border-[#2a2a2a] bg-[#111111d1] p-2.5"
    role="tablist"
    aria-label="Blog categories"
  >
    <button
      v-for="group in props.groups"
      :key="`category-tab-${group.key}`"
      type="button"
      role="tab"
      :aria-selected="props.selectedCategory === group.key"
      class="rounded-xl px-3 py-2 text-sm font-medium transition"
      :class="
        props.selectedCategory === group.key
          ? 'bg-white text-[#0f0f0f]'
          : 'bg-[#181818] text-zinc-300 hover:bg-[#242424] hover:text-zinc-100'
      "
      @click="emit('select', group.key)"
    >
      {{ group.title }}
    </button>
  </div>
</template>
