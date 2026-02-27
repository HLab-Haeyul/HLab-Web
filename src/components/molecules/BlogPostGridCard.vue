<script setup lang="ts">
import BlogTagBadge from '@/components/atoms/BlogTagBadge.vue'

type Props = {
  id: string
  title: string
  excerpt: string
  category: string
  publishedAt: string
  readTime: string
  tags: string[]
  thumbnailSrc?: string
  to: string
  viewLabel: string
  viewCount: number
  animationDelay?: string
}

const props = defineProps<Props>()

const formatTagLabel = (value: string) => value.replace(/^#+/, '')
</script>

<template>
  <article
    class="group post-focus-card rounded-xl border border-[#2d2d2d] bg-[#111111] p-4 transition hover:-translate-y-[2px] hover:border-[#5f5544] hover:bg-[#161513]"
    :style="{ animationDelay: props.animationDelay }"
  >
    <RouterLink :to="props.to" class="block">
      <div
        v-if="props.thumbnailSrc"
        class="mb-3 overflow-hidden rounded-lg border border-[#2f2f2f] bg-[#161616]"
      >
        <img
          :src="props.thumbnailSrc"
          :alt="`${props.title} 썸네일`"
          class="h-36 w-full object-cover"
          loading="lazy"
        />
      </div>

      <h3 class="line-clamp-2 text-base font-semibold text-zinc-100">{{ props.title }}</h3>
      <p class="mt-1 line-clamp-2 text-sm text-zinc-400">{{ props.excerpt }}</p>

      <div class="mt-3 flex items-center justify-between gap-2 text-xs">
        <span class="rounded-full border border-[#343434] px-2 py-0.5 text-zinc-300">
          {{ props.category }}
        </span>
        <span class="text-zinc-500">{{ props.publishedAt }}</span>
      </div>

      <p class="mt-2 text-xs text-zinc-500">
        {{ props.readTime }} · {{ props.viewLabel }} {{ props.viewCount.toLocaleString() }}
      </p>

      <div class="mt-2 flex flex-wrap gap-2">
        <BlogTagBadge
          v-for="tag in props.tags"
          :key="`${props.id}-${tag}`"
          :tag="formatTagLabel(tag)"
        />
      </div>
    </RouterLink>
  </article>
</template>

<style scoped>
.post-focus-card {
  animation: focusCardIn 420ms cubic-bezier(0.22, 0.8, 0.2, 1) both;
}

@keyframes focusCardIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .post-focus-card {
    animation: none;
  }
}
</style>
