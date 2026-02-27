<script setup lang="ts">
type CategoryGroup = {
  key: string
  title: string
}

type Props = {
  groups: CategoryGroup[]
  selectedCategory: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [category: string]
}>()
</script>

<template>
  <div class="flex flex-wrap gap-2 border-b border-[#2a2a2a] pb-3">
    <button
      v-for="group in props.groups"
      :key="`category-${group.key}`"
      type="button"
      class="rounded-md px-3 py-1.5 text-sm font-medium transition"
      :class="
        props.selectedCategory === group.key
          ? 'category-pill-active border border-[#5f5544] bg-[#211b12] text-amber-200'
          : 'border border-transparent text-zinc-400 hover:border-[#3a3731] hover:bg-[#171717] hover:text-zinc-100'
      "
      @click="emit('select', group.key)"
    >
      {{ group.title }}
    </button>
  </div>
</template>

<style scoped>
.category-pill-active {
  animation: focusPill 300ms ease-out;
}

@keyframes focusPill {
  0% {
    box-shadow: 0 0 0 0 rgba(245, 200, 126, 0.26);
  }
  100% {
    box-shadow: 0 0 0 10px rgba(245, 200, 126, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .category-pill-active {
    animation: none;
  }
}
</style>
