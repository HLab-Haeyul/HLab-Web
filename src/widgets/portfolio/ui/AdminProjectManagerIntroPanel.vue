<script setup lang="ts">
type Props = {
  projectCount: number
  adminPath: string
  basePath: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'create-project': []
}>()
</script>

<template>
  <section class="rounded-[1.6rem] border border-[#2b2a28] bg-[#101010d6] p-5 sm:p-7">
    <p class="text-[11px] uppercase tracking-[0.12em] text-amber-400">ADMIN / PROJECTS</p>
    <h1 class="mt-2 text-2xl font-semibold text-zinc-100 sm:text-3xl">프로젝트 관리</h1>
    <p class="mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">
      프로젝트 카드를 선택해서 트러블슈팅 글, 제목/요약/성과, 이미지, 협업 URL을 수정하거나 추가합니다.
    </p>

    <div class="mt-4 flex flex-wrap gap-2">
      <button
        type="button"
        class="inline-flex items-center rounded-lg border border-blue-500 bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:border-blue-400 hover:bg-blue-500"
        @click="emit('create-project')"
      >
        새 프로젝트 생성
      </button>
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
    </div>
  </section>

  <section class="rounded-[1.2rem] border border-[#2a2a2a] bg-[#121212dd] p-4 sm:p-5">
    <p class="text-xs uppercase tracking-[0.08em] text-zinc-500">현재 프로젝트 수</p>
    <p class="mt-2 text-2xl font-semibold text-zinc-100">{{ props.projectCount }}</p>
    <p class="mt-1 text-xs text-zinc-400">카드를 선택하면 해당 프로젝트 관리 URL로 이동합니다.</p>
  </section>
</template>
