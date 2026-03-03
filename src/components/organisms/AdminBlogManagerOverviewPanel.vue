<script setup lang="ts">
type Props = {
  postCount: number
  errorMessage: string | null
}

const props = defineProps<Props>()
</script>

<template>
  <section
    id="admin-blog-overview"
    class="rounded-[1.2rem] border border-[#2a2a2a] bg-[#121212dd] p-4 sm:p-5"
  >
    <p class="mt-1 text-xs text-zinc-500">동기화 상태와 현재 게시글 수를 확인합니다.</p>

    <div class="mt-3 grid gap-3 sm:grid-cols-2">
      <article class="rounded-2xl border border-[#2a2a2a] bg-[#111111] p-4">
        <p class="text-xs uppercase tracking-[0.08em] text-zinc-500">게시글 수</p>
        <p class="mt-2 text-xl font-semibold text-zinc-100">{{ props.postCount }}</p>
        <p class="mt-1 text-xs text-zinc-400">현재 로케일 기준 목록</p>
      </article>
    </div>

    <p
      v-if="props.errorMessage"
      class="mt-3 rounded-xl border border-[#47361b] bg-[#2a1f11] px-3 py-2 text-xs text-amber-300"
    >
      {{ props.errorMessage }}
    </p>
  </section>
</template>
