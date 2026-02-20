<script setup lang="ts">
type TocItem = {
  id: string
  text: string
  level: number
}

type Props = {
  tocHeadingLabel: string
  items: TocItem[]
  buildHeadingLink: (id: string) => any
}

const props = defineProps<Props>()

const getTocIndentClass = (level: number) => {
  if (level === 1) {
    return 'pl-0'
  }

  if (level === 2) {
    return 'pl-3'
  }

  return 'pl-6'
}
</script>

<template>
  <div class="rounded-2xl border border-[#2a2a2a] bg-[#111111d1] p-3">
    <p class="mb-2 text-xs uppercase tracking-[0.1em] text-zinc-500">{{ props.tocHeadingLabel }}</p>
    <nav aria-label="Post table of contents">
      <ul class="space-y-1.5">
        <li v-for="item in props.items" :key="`toc-${item.id}`">
          <RouterLink
            :to="props.buildHeadingLink(item.id)"
            class="block rounded-md py-1 text-xs text-zinc-400 transition hover:bg-[#1b1b1b] hover:text-zinc-100"
            :class="getTocIndentClass(item.level)"
          >
            {{ item.text }}
          </RouterLink>
        </li>
      </ul>
    </nav>
  </div>
</template>
