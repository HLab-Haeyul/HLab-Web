<script setup lang="ts">
import { computed } from 'vue'
import { worksByLocale } from '@/data/portfolio/works'
import { useLocale } from '@/composables/useLocale'
import { useBlogContent } from '@/composables/useBlogContent'
import AdminSidebarNav from '@/components/organisms/AdminSidebarNav.vue'

type AdminStat = {
  label: string
  value: string
  note: string
}

type AdminActionCard = {
  id: string
  title: string
  description: string
  status: string
  to?: string
}

const { locale, basePath, adminBlogPath, adminProjectPath, adminPortfolioPath } = useLocale()
const { copy: blogCopy, isLoading: isBlogLoading } = useBlogContent(locale)

const copy = {
  kicker: 'ADMIN CONSOLE',
  heading: '사이트 운영 대시보드',
  description: '발행, 모더레이션, 메인 데이터 관리를 한 곳에서 시작합니다.',
  statLabel: '현재 상태',
  actionLabel: '바로 실행 가능한 작업',
  plannedLabel: '다음 구현 모듈',
  statusReady: '사용 가능',
  statusPlanned: '구현 예정',
}

const stats = computed<AdminStat[]>(() => [
  { label: '오늘 방문자', value: '0', note: '트래킹 API 연동 예정' },
  {
    label: '블로그 작성 수',
    value: isBlogLoading.value ? '...' : String(blogCopy.value.posts.length),
    note: isBlogLoading.value ? '게시글 수 동기화 중' : '현재 게시글 수',
  },
  {
    label: '프로젝트 수',
    value: String(worksByLocale[locale.value].length),
    note: '현재 로케일 기준 프로젝트 수',
  },
])

const actionCards = computed<AdminActionCard[]>(() => [
  {
    id: 'admin-content',
    title: '글 관리',
    description: '게시글 작성, 수정, 삭제를 수행합니다.',
    status: copy.statusReady,
    to: adminBlogPath.value,
  },
  {
    id: 'admin-project',
    title: '프로젝트 관리',
    description: '프로젝트 생성과 트러블슈팅 관리를 수행합니다.',
    status: copy.statusReady,
    to: adminProjectPath.value,
  },
  {
    id: 'admin-portfolio',
    title: '포트폴리오 관리',
    description: '메인 포트폴리오 데이터 편집을 수행합니다.',
    status: copy.statusReady,
    to: adminPortfolioPath.value,
  },
])

const plannedCards: AdminActionCard[] = [
  {
    id: 'admin-security',
    title: 'JWT + SMS 접근 제어',
    description: 'OTP 검증, 세션 정책, 관리자 가드를 구성합니다.',
    status: copy.statusPlanned,
  },
  {
    id: 'admin-analytics',
    title: '일일 방문자 통계',
    description: '기간 필터와 봇 제외 기준을 포함한 UV/PV 대시보드.',
    status: copy.statusPlanned,
  },
  {
    id: 'admin-projects',
    title: '프로젝트/트러블슈팅 관리',
    description: '프로젝트를 생성하고 트러블슈팅 기록을 연결합니다.',
    status: copy.statusPlanned,
  },
  {
    id: 'admin-main-data',
    title: '메인 데이터 편집기',
    description: '수상, 기술 스택, 작업한 프로젝트 수, 자격증 개수, 보안 경력을 수정합니다.',
    status: copy.statusPlanned,
  },
  {
    id: 'admin-certificates',
    title: '자격증',
    description: '메인 페이지 자격증 카드와 발급 정보를 관리합니다.',
    status: copy.statusPlanned,
  },
]

const backToMainLabel = '메인으로'
</script>

<template>
  <div class="relative isolate mx-auto min-h-screen w-full max-w-[1480px] px-4 pb-14 pt-5 sm:px-8 lg:px-12">
    <div
      aria-hidden="true"
      class="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_14%_-6%,rgba(79,141,255,0.16),transparent_34%),radial-gradient(circle_at_85%_115%,rgba(58,106,204,0.12),transparent_36%)] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.92),rgba(0,0,0,0.4))]"
    ></div>

    <main class="grid gap-5 xl:grid-cols-[230px_minmax(0,1fr)] xl:items-start">
      <div class="xl:sticky xl:top-24">
        <AdminSidebarNav />
      </div>

      <div class="space-y-6">
        <section class="rounded-[1.6rem] border border-[#243654] bg-[#0a0f17d9] p-5 sm:p-7">
          <p class="text-[11px] uppercase tracking-[0.12em] text-blue-300">{{ copy.kicker }}</p>
          <h1 class="mt-2 text-2xl font-semibold text-zinc-100 sm:text-3xl">{{ copy.heading }}</h1>
          <p class="mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">{{ copy.description }}</p>

          <div class="mt-4">
            <RouterLink
              :to="basePath"
              class="inline-flex items-center rounded-lg border border-[#243654] px-3 py-1.5 text-xs text-zinc-200 transition hover:border-[#5f8cff] hover:bg-[#101a2c] hover:text-white"
            >
              {{ backToMainLabel }}
            </RouterLink>
          </div>
        </section>

        <section id="admin-overview" class="space-y-3">
          <p class="text-xs uppercase tracking-[0.11em] text-zinc-500">{{ copy.statLabel }}</p>
          <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <article
              v-for="stat in stats"
              :key="`stat-${stat.label}`"
              class="rounded-2xl border border-[#2a2a2a] bg-[#121212dd] p-4"
            >
              <p class="text-xs uppercase tracking-[0.08em] text-zinc-500">{{ stat.label }}</p>
              <p class="mt-2 text-2xl font-semibold text-zinc-100">{{ stat.value }}</p>
              <p class="mt-1 text-xs text-zinc-400">{{ stat.note }}</p>
            </article>
          </div>
        </section>

        <section id="admin-actions" class="space-y-3">
          <p class="text-xs uppercase tracking-[0.11em] text-zinc-500">{{ copy.actionLabel }}</p>
          <div class="grid gap-3 md:grid-cols-2">
            <RouterLink
              v-for="card in actionCards"
              :id="card.id"
              :key="card.id"
              :to="card.to || basePath"
              class="group rounded-2xl border border-[#263140] bg-[#0f141dd9] p-4 transition hover:border-[#4f76c7] hover:bg-[#121b2a]"
            >
              <div class="flex items-center justify-between gap-2">
                <h2 class="text-base font-semibold text-zinc-100">{{ card.title }}</h2>
                <span
                  class="rounded-full border border-[#34538f] bg-[#14223a] px-2 py-0.5 text-[11px] text-blue-200"
                >
                  {{ card.status }}
                </span>
              </div>
              <p class="mt-2 text-sm text-zinc-400 group-hover:text-zinc-300">{{ card.description }}</p>
            </RouterLink>
          </div>
        </section>

        <section id="admin-planned" class="space-y-3">
          <p class="text-xs uppercase tracking-[0.11em] text-zinc-500">{{ copy.plannedLabel }}</p>
          <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <article
              v-for="card in plannedCards"
              :id="card.id"
              :key="card.id"
              class="rounded-2xl border border-dashed border-[#3b3b3b] bg-[#111111cc] p-4"
            >
              <div class="flex items-center justify-between gap-2">
                <h2 class="text-sm font-semibold text-zinc-100 sm:text-base">{{ card.title }}</h2>
                <span class="rounded-full border border-[#2f3f57] bg-[#1c2634] px-2 py-0.5 text-[11px] text-sky-300">
                  {{ card.status }}
                </span>
              </div>
              <p class="mt-2 text-sm text-zinc-400">{{ card.description }}</p>
            </article>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>
