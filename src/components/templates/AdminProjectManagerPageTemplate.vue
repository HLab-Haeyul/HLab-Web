<script setup lang="ts">
import { computed } from 'vue'
import { worksByLocale } from '@/data/portfolio/works'
import { useLocale } from '@/composables/useLocale'
import AdminSidebarNav from '@/components/organisms/AdminSidebarNav.vue'

const { locale, basePath, adminPath } = useLocale()

const projects = computed(() => worksByLocale[locale.value])
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
          <p class="text-[11px] uppercase tracking-[0.12em] text-amber-400">ADMIN / PROJECTS</p>
          <h1 class="mt-2 text-2xl font-semibold text-zinc-100 sm:text-3xl">프로젝트 관리</h1>
          <p class="mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">
            프로젝트 데이터와 트러블슈팅 기록을 관리하는 영역입니다.
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
          <p class="text-xs uppercase tracking-[0.08em] text-zinc-500">현재 프로젝트 수</p>
          <p class="mt-2 text-2xl font-semibold text-zinc-100">{{ projects.length }}</p>
          <p class="mt-1 text-xs text-zinc-400">현재 로케일 기준 프로젝트 목록</p>
        </section>

        <section class="rounded-[1.2rem] border border-[#2a2a2a] bg-[#121212dd] p-4 sm:p-5">
          <h2 class="text-base font-semibold text-zinc-100 sm:text-lg">프로젝트 목록</h2>
          <p class="mt-1 text-xs text-zinc-500">추후 프로젝트 생성/수정/삭제 기능이 이 영역에 연결됩니다.</p>

          <div class="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <article
              v-for="project in projects"
              :key="`admin-project-${project.title}`"
              class="rounded-xl border border-[#2d2d2d] bg-[#111111] p-4"
            >
              <p class="text-sm font-semibold text-zinc-100">{{ project.title }}</p>
              <p class="mt-1 text-xs text-zinc-400">{{ project.summary }}</p>
              <p class="mt-2 text-xs text-zinc-300">{{ project.impact }}</p>
            </article>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>
