<script setup lang="ts">
import { computed } from 'vue'
import SkillIcon from '@/components/atoms/SkillIcon.vue'
import { useLocale } from '@/composables/useLocale'
import type { WorkItem } from '@/data/portfolio/types'
import { resolveStackVisual } from '@/utils/stackVisuals'

const props = defineProps<{
  work: WorkItem
}>()

const { locale } = useLocale()

const resolveWorkStackVisual = (stackLabel: string) => resolveStackVisual(locale.value, stackLabel)
const roleLabel = computed(() => (locale.value === 'en' ? 'Role' : '나의 역할'))
const contributionLabel = computed(() => (locale.value === 'en' ? 'What I Did' : '내가 한 일'))
</script>

<template>
  <article
    class="group flex flex-col gap-2 rounded-xl border border-[#2a2a2a] bg-gradient-to-br from-[#151515] to-[#121212] p-3 transition hover:-translate-y-0.5 hover:border-[#393939]"
  >
    <figure class="relative overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#101010]">
      <img
        v-if="props.work.imageSrc"
        :src="props.work.imageSrc"
        :alt="props.work.imageAlt ?? props.work.title"
        class="h-28 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        loading="lazy"
      />
      <div
        v-else
        class="flex h-28 w-full items-center justify-center bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.14),transparent_45%),linear-gradient(160deg,#181818,#101010)] px-3 text-center text-sm text-zinc-300"
      >
        {{ props.work.title }}
      </div>
    </figure>

    <h3 class="text-base text-white">{{ props.work.title }}</h3>
    <p class="text-sm text-zinc-300">{{ props.work.summary }}</p>
    <strong class="text-xs text-zinc-200">{{ props.work.impact }}</strong>

    <div
      v-if="props.work.role || (props.work.contributions && props.work.contributions.length > 0)"
      class="mt-1 rounded-lg border border-[#2a2a2a] bg-[#101010] p-2"
    >
      <div v-if="props.work.role">
        <p class="text-[10px] uppercase tracking-[0.08em] text-zinc-500">{{ roleLabel }}</p>
        <p class="mt-0.5 text-xs text-zinc-200">{{ props.work.role }}</p>
      </div>

      <div v-if="props.work.contributions && props.work.contributions.length > 0" class="mt-1.5">
        <p class="text-[10px] uppercase tracking-[0.08em] text-zinc-500">{{ contributionLabel }}</p>
        <ul class="mt-1 space-y-1">
          <li
            v-for="(item, contributionIndex) in props.work.contributions.slice(0, 2)"
            :key="`${props.work.title}-contribution-${contributionIndex}`"
            class="text-[11px] leading-4 text-zinc-300"
          >
            • {{ item }}
          </li>
        </ul>
      </div>
    </div>

    <ul class="mt-1 flex flex-wrap gap-1.5">
      <li
        v-for="item in props.work.stack"
        :key="`${props.work.title}-${item}`"
        class="inline-flex items-center gap-1.5 rounded-full border border-[#2a2a2a] bg-[#111111] px-2 py-1"
      >
        <SkillIcon
          :image-src="resolveWorkStackVisual(item).imageSrc"
          :image-alt="resolveWorkStackVisual(item).imageAlt"
          :icon="resolveWorkStackVisual(item).icon"
          :label="item"
          image-class="h-3.5 w-3.5 object-contain"
          icon-class="text-[10px] leading-none"
        />
        <span class="text-[11px] text-zinc-300">{{ item }}</span>
      </li>
    </ul>
  </article>
</template>
