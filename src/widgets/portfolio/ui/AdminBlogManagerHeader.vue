<script setup lang="ts">
type Props = {
  writeMode: boolean
  pageHeading: string
  panelDescription: string
  adminBlogWritePath: string
  adminBlogPath: string
  adminPath: string
  basePath: string
  isLoading: boolean
  isManagingPost: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  reload: []
}>()
</script>

<template>
  <section class="rounded-[1.6rem] border border-[#2b2a28] bg-[#101010d6] p-5 sm:p-7">
    <p class="text-[11px] uppercase tracking-[0.12em] text-amber-400">
      {{ props.writeMode ? 'ADMIN / BLOG WRITE' : 'ADMIN / BLOG' }}
    </p>
    <h1 class="mt-2 text-2xl font-semibold text-zinc-100 sm:text-3xl">{{ props.pageHeading }}</h1>
    <p class="mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">{{ props.panelDescription }}</p>

    <div class="mt-4 flex flex-wrap gap-2">
      <RouterLink
        v-if="!props.writeMode"
        :to="props.adminBlogWritePath"
        class="inline-flex items-center rounded-lg border border-[#5f5544] bg-[#211b12] px-3 py-1.5 text-xs text-amber-200 transition hover:border-[#8f784d] hover:text-amber-100"
      >
        글 작성하기
      </RouterLink>
      <RouterLink
        v-else
        :to="props.adminBlogPath"
        class="inline-flex items-center rounded-lg border border-[#3a3731] px-3 py-1.5 text-xs text-zinc-200 transition hover:border-[#5f5544] hover:text-white"
      >
        글 관리로
      </RouterLink>
      <RouterLink
        :to="props.adminPath"
        class="inline-flex items-center rounded-lg border border-[#3a3731] px-3 py-1.5 text-xs text-zinc-200 transition hover:border-[#5f5544] hover:text-white"
      >
        관리자 메인
      </RouterLink>
      <RouterLink
        :to="props.basePath"
        class="inline-flex items-center rounded-lg border border-[#3a3731] px-3 py-1.5 text-xs text-zinc-200 transition hover:border-[#5f5544] hover:text-white"
      >
        메인으로
      </RouterLink>
      <button
        type="button"
        class="inline-flex items-center rounded-lg border border-[#3a3731] px-3 py-1.5 text-xs text-zinc-200 transition hover:border-[#5f5544] hover:text-white disabled:opacity-50"
        :disabled="props.isLoading || props.isManagingPost"
        @click="emit('reload')"
      >
        새로고침
      </button>
    </div>
  </section>
</template>
