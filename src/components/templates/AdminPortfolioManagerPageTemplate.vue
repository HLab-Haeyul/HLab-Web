<script setup lang="ts">
import { useLocale } from '@/composables/useLocale'
import AdminSidebarNav from '@/components/organisms/AdminSidebarNav.vue'

const { basePath, adminPath } = useLocale()

const editableSections = [
  {
    id: 'portfolio-awards',
    title: '수상 경력',
    description: '메인 페이지에 노출되는 수상 이력 데이터를 관리합니다.',
  },
  {
    id: 'portfolio-stack',
    title: '기술 스택',
    description: '스택 카드 구성과 강조 순서를 관리합니다.',
  },
  {
    id: 'portfolio-release',
    title: '출시 프로젝트',
    description: '출시 프로젝트 목록과 상태를 관리합니다.',
  },
  {
    id: 'portfolio-quality',
    title: '평균 Lighthouse / 보안 경력',
    description: '품질/보안 지표 노출 값을 관리합니다.',
  },
  {
    id: 'portfolio-featured',
    title: '대표 프로젝트 3개',
    description: '메인 페이지에 노출할 대표 프로젝트 3개를 선택합니다.',
  },
]
</script>

<template>
  <div class="relative isolate mx-auto min-h-screen w-full max-w-[1220px] px-4 pb-14 pt-5 sm:px-8 lg:px-12">
    <div
      aria-hidden="true"
      class="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_14%_-6%,rgba(245,158,11,0.16),transparent_34%),radial-gradient(circle_at_85%_115%,rgba(59,130,246,0.12),transparent_36%)] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.92),rgba(0,0,0,0.4))]"
    ></div>

    <main class="grid gap-5 xl:grid-cols-[230px_minmax(0,1fr)] xl:items-start">
      <div class="xl:sticky xl:top-24">
        <AdminSidebarNav />
      </div>

      <div class="space-y-5">
        <section class="rounded-[1.6rem] border border-[#2b2a28] bg-[#101010d6] p-5 sm:p-7">
          <p class="text-[11px] uppercase tracking-[0.12em] text-amber-400">ADMIN / PORTFOLIO</p>
          <h1 class="mt-2 text-2xl font-semibold text-zinc-100 sm:text-3xl">포트폴리오 관리</h1>
          <p class="mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">
            메인 페이지 포트폴리오 데이터를 편집하는 영역입니다.
          </p>

          <div class="mt-4 flex flex-wrap gap-2">
            <RouterLink
              :to="adminPath"
              class="inline-flex items-center rounded-lg border border-[#3a3731] px-3 py-1.5 text-xs text-zinc-200 transition hover:border-[#5f5544] hover:text-white"
            >
              관리자 메인
            </RouterLink>
            <RouterLink
              :to="basePath"
              class="inline-flex items-center rounded-lg border border-[#3a3731] px-3 py-1.5 text-xs text-zinc-200 transition hover:border-[#5f5544] hover:text-white"
            >
              메인으로
            </RouterLink>
          </div>
        </section>

        <section class="rounded-[1.2rem] border border-[#2a2a2a] bg-[#121212dd] p-4 sm:p-5">
          <h2 class="text-base font-semibold text-zinc-100 sm:text-lg">편집 대상 모듈</h2>
          <p class="mt-1 text-xs text-zinc-500">각 모듈의 실제 수정 폼은 순차적으로 연결됩니다.</p>

          <div class="mt-3 grid gap-3 md:grid-cols-2">
            <article
              v-for="section in editableSections"
              :key="section.id"
              class="rounded-xl border border-[#2d2d2d] bg-[#111111] p-4"
            >
              <p class="text-sm font-semibold text-zinc-100">{{ section.title }}</p>
              <p class="mt-1 text-xs text-zinc-400">{{ section.description }}</p>
            </article>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>
