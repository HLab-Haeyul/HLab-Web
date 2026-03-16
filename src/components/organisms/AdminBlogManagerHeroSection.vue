<script setup lang="ts">
type Props = {
  writeMode?: boolean
  pageHeading: string
  panelDescription: string
  adminBlogPath: string
  adminBlogWritePath: string
  adminPath: string
  basePath: string
  isBusy: boolean
}

const props = withDefaults(defineProps<Props>(), {
  writeMode: false,
})

const emit = defineEmits<{
  reload: []
}>()
</script>

<template>
  <section class="rounded-[1.6rem] border border-[#243654] bg-[#0a0f17d9] p-5 sm:p-7">
    <p class="text-[11px] uppercase tracking-[0.12em] text-blue-300">
      {{ props.writeMode ? 'ADMIN / BLOG WRITE' : 'ADMIN / BLOG' }}
    </p>
    <h1 class="mt-2 text-2xl font-semibold text-zinc-100 sm:text-3xl">{{ props.pageHeading }}</h1>
    <p class="mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">{{ props.panelDescription }}</p>

    <div class="mt-4 flex flex-wrap gap-2">
      <RouterLink
        v-if="!props.writeMode"
        :to="props.adminBlogWritePath"
        class="inline-flex items-center rounded-lg border border-[#33518f] bg-[#14223a] px-3 py-1.5 text-xs text-blue-200 transition hover:border-[#5f8cff] hover:bg-[#193055] hover:text-blue-100"
      >
        글 작성하기
      </RouterLink>
      <RouterLink
        v-else
        :to="props.adminBlogPath"
        class="inline-flex items-center rounded-lg border border-[#243654] px-3 py-1.5 text-xs text-zinc-200 transition hover:border-[#5f8cff] hover:bg-[#101a2c] hover:text-white"
      >
        글 관리로
      </RouterLink>
      <RouterLink
        :to="props.adminPath"
        class="inline-flex items-center rounded-lg border border-[#243654] px-3 py-1.5 text-xs text-zinc-200 transition hover:border-[#5f8cff] hover:bg-[#101a2c] hover:text-white"
      >
        관리자 메인
      </RouterLink>
      <RouterLink
        :to="props.basePath"
        class="inline-flex items-center rounded-lg border border-[#243654] px-3 py-1.5 text-xs text-zinc-200 transition hover:border-[#5f8cff] hover:bg-[#101a2c] hover:text-white"
      >
        메인으로
      </RouterLink>
      <button
        type="button"
        class="inline-flex items-center rounded-lg border border-[#243654] px-3 py-1.5 text-xs text-zinc-200 transition hover:border-[#5f8cff] hover:bg-[#101a2c] hover:text-white disabled:opacity-50"
        :disabled="props.isBusy"
        @click="emit('reload')"
      >
        새로고침
      </button>
    </div>
  </section>
</template>
