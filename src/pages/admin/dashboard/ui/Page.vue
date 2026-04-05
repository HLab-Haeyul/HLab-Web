<script setup lang="ts">
import { computed } from 'vue'
import { worksByLocale } from '@/entities/project'
import { useLocale } from '@/shared/lib/routing'
import {
  AdminDashboardCardSection,
  AdminDashboardHeroSection,
  AdminDashboardStatsSection,
  AdminSidebarNav,
  useAdminNavigation,
} from '@/widgets/admin'
import AdminWorkspaceLayout from '@/widgets/admin-workspace'

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

const { locale, basePath, adminProjectPath, adminPortfolioPath } = useLocale()
const { navItems, activePath, handleLogout } = useAdminNavigation()

const copy = {
  kicker: 'ADMIN CONSOLE',
  heading: '사이트 운영 대시보드',
  description: '프로젝트와 포트폴리오 데이터를 한 곳에서 관리합니다.',
  statLabel: '현재 상태',
  actionLabel: '바로 실행 가능한 작업',
  plannedLabel: '다음 구현 모듈',
  statusReady: '사용 가능',
  statusPlanned: '구현 예정',
}

const stats = computed<AdminStat[]>(() => [
  { label: '오늘 방문자', value: '0', note: '트래킹 API 연동 예정' },
  {
    label: '프로젝트 수',
    value: String(worksByLocale[locale.value].length),
    note: '현재 로케일 기준 프로젝트 수',
  },
  {
    label: '관리 모듈',
    value: '2',
    note: '프로젝트 / 포트폴리오',
  },
])

const actionCards = computed<AdminActionCard[]>(() => [
  {
    id: 'admin-project',
    title: '프로젝트 관리',
    description: '프로젝트 정보와 협업 링크 관리를 수행합니다.',
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
    title: '프로젝트 운영 기록',
    description: '프로젝트별 운영 메모와 검수 흐름을 정리합니다.',
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
  <AdminWorkspaceLayout>
    <template #sidebar>
      <div>
        <AdminSidebarNav :items="navItems" :active-path="activePath" @logout="handleLogout" />
      </div>
    </template>

    <template #hero>
      <AdminDashboardHeroSection
        :kicker="copy.kicker"
        :heading="copy.heading"
        :description="copy.description"
        :base-path="basePath"
        :back-label="backToMainLabel"
      />
    </template>

    <AdminDashboardStatsSection section-id="admin-overview" :label="copy.statLabel" :stats="stats" />

    <AdminDashboardCardSection
      section-id="admin-actions"
      :label="copy.actionLabel"
      :cards="actionCards"
    />

    <AdminDashboardCardSection
      section-id="admin-planned"
      :label="copy.plannedLabel"
      :cards="plannedCards"
      variant="planned"
    />
  </AdminWorkspaceLayout>
</template>
