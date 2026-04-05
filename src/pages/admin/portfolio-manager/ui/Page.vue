<script setup lang="ts">
import { AdminSidebarNav, useAdminNavigation } from '@/widgets/admin'
import { useAdminPortfolioManagerPage } from '../model/useAdminPortfolioManagerPage'
import AdminWorkspaceLayout from '@/widgets/admin-workspace'

const { navItems, activePath, handleLogout } = useAdminNavigation()
const {
  basePath,
  adminPath,
  editableSections,
  overviewStats,
  currentLocaleLabel,
  currentLocaleDescription,
  moduleCoverageLabel,
  stackCountLabel,
  awardCountLabel,
  careerCountLabel,
  titleLineLabel,
  heroTitleDraft,
  titleFeedbackMessage,
  titleCharacterCount,
  titleLineCount,
  saveCurrentHeroTitle,
  resetHeroTitleDraft,
  restoreDefaultHeroTitle,
  awards,
  selectedAwardIndex,
  selectedAward,
  awardDraft,
  awardDraftPreview,
  awardFeedbackMessage,
  isCreateAwardMode,
  hasSelectedAward,
  selectedAwardOrderLabel,
  canMoveAwardUp,
  canMoveAwardDown,
  awardEditorTitle,
  awardEditorDescription,
  selectAwardEntry,
  startCreatingAward,
  moveSelectedAward,
  saveCurrentAward,
  deleteSelectedAward,
  resetAwardDraft,
  restoreDefaultAwards,
  clearAwardDraftImage,
  handleSelectAwardImage,
  careerTimeline,
  selectedCareerIndex,
  selectedCareer,
  careerDraft,
  careerDraftPreview,
  careerFeedbackMessage,
  isCreateCareerMode,
  hasSelectedCareer,
  selectedCareerOrderLabel,
  canMoveCareerUp,
  canMoveCareerDown,
  careerEditorTitle,
  careerEditorDescription,
  selectCareerEntry,
  startCreatingCareerEntry,
  moveSelectedCareer,
  saveCurrentCareer,
  deleteSelectedCareer,
  resetCareerDraft,
  restoreDefaultCareerTimeline,
  stackItems,
  selectedStackIndex,
  selectedStackItem,
  stackDraft,
  stackDraftPreview,
  stackFeedbackMessage,
  isCreateStackMode,
  hasSelectedStackItem,
  selectedStackOrderLabel,
  canMoveStackUp,
  canMoveStackDown,
  stackEditorTitle,
  stackEditorDescription,
  selectStackEntry,
  startCreatingStackItem,
  moveSelectedStackItem,
  saveCurrentStackItem,
  deleteSelectedStackItem,
  resetStackDraft,
  restoreDefaultStackItems,
  certificates,
  selectedCertificateIndex,
  selectedCertificate,
  draft,
  draftPreview,
  draftChecklist,
  checklistCompletedCount,
  activeCertificateInsights,
  certificateFeedbackMessage,
  isCreateMode,
  hasSelectedCertificate,
  selectedOrderLabel,
  canMoveSelectionUp,
  canMoveSelectionDown,
  editorTitle,
  editorDescription,
  selectCertificate,
  startCreatingCertificate,
  moveSelectedCertificate,
  duplicateSelectedCertificate,
  saveCurrentCertificate,
  deleteSelectedCertificate,
  resetDraft,
  restoreDefaultCertificates,
  clearDraftImage,
  handleSelectCertificateImage,
} = useAdminPortfolioManagerPage()

const getSectionToneClass = (tone: 'editable' | 'readonly') =>
  tone === 'editable'
    ? 'border-[#355284] bg-[#12203a] text-[#d8e7ff]'
    : 'border-[#2d3746] bg-[#141b26] text-[#c5cfdd]'

const getCapabilityToneClass = (value: boolean) =>
  value
    ? 'border-[#36548d] bg-[#12203a] text-blue-100'
    : 'border-[#2d3746] bg-[#141b26] text-zinc-400'
</script>

<template>
  <AdminWorkspaceLayout>
    <template #sidebar>
      <div>
        <AdminSidebarNav :items="navItems" :active-path="activePath" @logout="handleLogout" />
      </div>
    </template>

    <template #hero>
      <section
        class="relative overflow-hidden rounded-[1.8rem] border border-[#2a3e5f] bg-[#0b1119] p-5 sm:p-7"
      >
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-x-[-10%] top-[-6rem] h-56 bg-[radial-gradient(circle_at_top,rgba(88,142,255,0.28),transparent_58%)]"
        ></div>

        <div class="relative grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
          <div>
            <p class="text-xs uppercase tracking-[0.14em] text-[var(--text-soft)]">
              ADMIN / PORTFOLIO
            </p>
            <h1 class="mt-3 max-w-[16ch] text-3xl font-semibold text-zinc-100 sm:text-4xl">
              포트폴리오 운영 대시보드
            </h1>
            <p class="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
              메인 타이틀, 기술스택, 경력 타임라인, 수상 경력, 자격증 레일까지 공개 포트폴리오 주요
              콘텐츠를 한 화면에서 점검하고 수정합니다.
            </p>

            <div class="mt-5 flex flex-wrap gap-2">
              <RouterLink
                :to="adminPath"
                class="inline-flex items-center rounded-lg border border-[#334866] px-3 py-2 text-xs text-zinc-200 transition hover:border-[#5f8cff] hover:bg-[#101a2c] hover:text-white"
              >
                관리자 메인
              </RouterLink>
              <RouterLink
                :to="basePath"
                class="inline-flex items-center rounded-lg border border-[#4d6dab] bg-[#1d3d74] px-3 py-2 text-xs font-medium text-white transition hover:border-[#6f91d1] hover:bg-[#29508f]"
              >
                공개 포트폴리오 보기
              </RouterLink>
            </div>
          </div>

          <aside class="rounded-[1.4rem] border border-[#243654] bg-[#101823] p-4">
            <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">Workspace Scope</p>
            <p class="mt-2 text-lg font-semibold text-zinc-100">{{ moduleCoverageLabel }}</p>
            <p class="mt-2 text-sm leading-6 text-zinc-400">{{ currentLocaleDescription }}</p>

            <div class="mt-4 flex flex-wrap gap-2">
              <span
                class="rounded-full border border-[#314666] bg-[#131d2b] px-3 py-1 text-xs text-zinc-200"
              >
                {{ currentLocaleLabel }}
              </span>
              <span
                class="rounded-full border border-[#314666] bg-[#131d2b] px-3 py-1 text-xs text-zinc-200"
              >
                {{ titleLineLabel }}
              </span>
              <span
                class="rounded-full border border-[#314666] bg-[#131d2b] px-3 py-1 text-xs text-zinc-200"
              >
                {{ stackCountLabel }}
              </span>
              <span
                class="rounded-full border border-[#314666] bg-[#131d2b] px-3 py-1 text-xs text-zinc-200"
              >
                {{ awardCountLabel }}
              </span>
              <span
                class="rounded-full border border-[#314666] bg-[#131d2b] px-3 py-1 text-xs text-zinc-200"
              >
                {{ careerCountLabel }}
              </span>
            </div>

            <p class="mt-4 text-xs leading-5 text-zinc-500">
              이 페이지에서 저장한 값은 브라우저 `localStorage`에 유지되며, 공개 포트폴리오와 스택
              상세 페이지에도 같은 값이 바로 반영됩니다.
            </p>
          </aside>
        </div>
      </section>
    </template>

    <section class="grid gap-4 2xl:grid-cols-[minmax(0,1.2fr)_370px]">
      <article class="rounded-[1.45rem] border border-[#283244] bg-[#11161d] p-4 sm:p-5">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">Overview</p>
            <h2 class="mt-2 text-lg font-semibold text-zinc-100 sm:text-xl">운영 현황</h2>
          </div>
          <p class="text-xs text-zinc-500">공개 포트폴리오 기준 현재 편집 가능 콘텐츠 상태</p>
        </div>

        <div class="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <article
            v-for="stat in overviewStats"
            :key="stat.id"
            class="rounded-[1.15rem] border border-[#233149] bg-[#0d1420] p-4"
          >
            <p class="text-xs uppercase tracking-[0.1em] text-zinc-500">{{ stat.label }}</p>
            <p class="mt-3 text-2xl font-semibold text-zinc-100">{{ stat.value }}</p>
            <p class="mt-2 text-xs leading-5 text-zinc-400">{{ stat.helper }}</p>
          </article>
        </div>
      </article>

      <aside class="rounded-[1.45rem] border border-[#283244] bg-[#11161d] p-4 sm:p-5">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">Content Map</p>
            <h2 class="mt-2 text-lg font-semibold text-zinc-100">포트폴리오 블록 현황</h2>
          </div>
          <span
            class="rounded-full border border-[#2f445f] bg-[#131d2b] px-3 py-1 text-xs text-zinc-300"
          >
            {{ editableSections.length }}개 블록
          </span>
        </div>

        <div class="mt-4 space-y-3">
          <article
            v-for="section in editableSections"
            :key="section.id"
            class="rounded-[1.1rem] border border-[#222d3e] bg-[#0d1218] p-4"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="text-sm font-semibold text-zinc-100">{{ section.title }}</p>
                <p class="mt-1 text-xs leading-5 text-zinc-400">{{ section.description }}</p>
              </div>
              <span
                class="shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium"
                :class="getSectionToneClass(section.tone)"
              >
                {{ section.status }}
              </span>
            </div>

            <div class="mt-3 flex flex-wrap items-center gap-2">
              <span
                class="rounded-full border border-[#2f445f] bg-[#131d2b] px-2.5 py-1 text-[11px] text-zinc-200"
              >
                {{ section.metric }}
              </span>
              <span
                class="rounded-full border border-[#263140] bg-[#11161d] px-2.5 py-1 text-[11px] text-zinc-500"
              >
                {{ section.helper }}
              </span>
            </div>
          </article>
        </div>
      </aside>
    </section>

    <section class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <form
        class="rounded-[1.5rem] border border-[#283244] bg-[#11161d] p-4 sm:p-5"
        @submit.prevent="saveCurrentHeroTitle"
      >
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">Hero Title</p>
            <h2 class="mt-2 text-lg font-semibold text-zinc-100 sm:text-xl">메인 타이틀 관리</h2>
            <p class="mt-1 text-sm leading-6 text-zinc-400">
              포트폴리오 첫 화면의 핵심 메시지를 줄바꿈 포함 형태로 편집합니다.
            </p>
          </div>
          <span class="rounded-full border border-[#314666] bg-[#131d2b] px-3 py-1 text-xs text-zinc-200">
            {{ titleLineCount }}줄 / {{ titleCharacterCount }}자
          </span>
        </div>

        <p
          v-if="titleFeedbackMessage"
          class="mt-4 rounded-xl border border-[#2f466a] bg-[#11203a] px-3 py-2 text-xs text-blue-100"
        >
          {{ titleFeedbackMessage }}
        </p>

        <label class="mt-4 block">
          <span class="text-xs font-medium text-zinc-300">메인 타이틀</span>
          <textarea
            v-model="heroTitleDraft"
            rows="3"
            class="mt-2 w-full rounded-xl border border-[#31415a] bg-[#0d1420] px-3 py-3 text-sm text-zinc-100 outline-none transition focus:border-[#5f8cff]"
            placeholder="McKinsey-style problem solving&#10;발본색원(拔本塞源)한 개발자"
          ></textarea>
        </label>

        <div class="mt-5 flex flex-wrap gap-2">
          <button
            type="submit"
            class="inline-flex items-center rounded-xl border border-[#4d6dab] bg-[#1d3d74] px-3 py-2 text-sm font-medium text-white transition hover:border-[#6f91d1] hover:bg-[#29508f]"
          >
            타이틀 저장
          </button>
          <button
            type="button"
            class="inline-flex items-center rounded-xl border border-[#314666] px-3 py-2 text-sm text-zinc-200 transition hover:border-[#5f8cff] hover:bg-[#101a2c] hover:text-white"
            @click="resetHeroTitleDraft"
          >
            편집 초기화
          </button>
          <button
            type="button"
            class="inline-flex items-center rounded-xl border border-[#314666] px-3 py-2 text-sm text-zinc-200 transition hover:border-[#5f8cff] hover:bg-[#101a2c] hover:text-white"
            @click="restoreDefaultHeroTitle"
          >
            기본값 복구
          </button>
        </div>
      </form>

      <aside class="rounded-[1.5rem] border border-[#243654] bg-[#0d1420] p-4">
        <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">Preview</p>
        <h3 class="mt-2 text-lg font-semibold text-zinc-100">공개 화면 미리보기</h3>

        <div class="mt-4 rounded-[1.25rem] border border-[#2c3e5b] bg-[#101826] p-4">
          <p class="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">Personal</p>
          <p class="mt-3 whitespace-pre-line text-2xl font-semibold leading-tight text-zinc-100">
            {{ heroTitleDraft || '메인 타이틀을 입력해 주세요' }}
          </p>
        </div>
      </aside>
    </section>

    <section class="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
      <aside class="rounded-[1.5rem] border border-[#243654] bg-[#0d1420] p-4 sm:p-5">
        <div class="flex flex-col gap-3">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">Career</p>
              <h2 class="mt-2 text-lg font-semibold text-zinc-100">경력 타임라인 목록</h2>
              <p class="mt-1 text-xs leading-5 text-zinc-400">
                멘토링, 외주, 실무 경험을 시간순 카드로 관리합니다.
              </p>
            </div>
            <span
              class="rounded-full border border-[#314666] bg-[#131d2b] px-3 py-1 text-xs text-zinc-200"
            >
              {{ careerTimeline.length }}개
            </span>
          </div>

          <div class="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-xl border border-[#4d6dab] bg-[#1d3d74] px-3 py-2 text-sm font-medium text-white transition hover:border-[#6f91d1] hover:bg-[#29508f]"
              @click="startCreatingCareerEntry"
            >
              새 경력 추가
            </button>
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-xl border border-[#314666] px-3 py-2 text-sm text-zinc-200 transition hover:border-[#5f8cff] hover:bg-[#101a2c] hover:text-white"
              @click="restoreDefaultCareerTimeline"
            >
              기본값 복구
            </button>
          </div>

          <div
            v-if="hasSelectedCareer"
            class="grid grid-cols-2 gap-2 rounded-[1.1rem] border border-[#27384f] bg-[#111923] p-2"
          >
            <button
              type="button"
              class="rounded-lg border px-2 py-2 text-xs transition"
              :class="
                canMoveCareerUp
                  ? 'border-[#314666] text-zinc-200 hover:border-[#5f8cff] hover:bg-[#101a2c] hover:text-white'
                  : 'border-[#223043] text-zinc-600'
              "
              :disabled="!canMoveCareerUp"
              @click="moveSelectedCareer('up')"
            >
              위로
            </button>
            <button
              type="button"
              class="rounded-lg border px-2 py-2 text-xs transition"
              :class="
                canMoveCareerDown
                  ? 'border-[#314666] text-zinc-200 hover:border-[#5f8cff] hover:bg-[#101a2c] hover:text-white'
                  : 'border-[#223043] text-zinc-600'
              "
              :disabled="!canMoveCareerDown"
              @click="moveSelectedCareer('down')"
            >
              아래로
            </button>
          </div>
        </div>

        <div v-if="careerTimeline.length > 0" class="mt-4 space-y-2.5">
          <button
            v-for="(entry, index) in careerTimeline"
            :key="entry.id"
            type="button"
            class="block w-full rounded-[1.15rem] border p-3 text-left transition"
            :class="
              selectedCareerIndex === index
                ? 'border-[#5f8cff] bg-[#13213a]'
                : 'border-[#27384f] bg-[#111923] hover:border-[#426189] hover:bg-[#142033]'
            "
            @click="selectCareerEntry(index)"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="text-sm font-semibold text-zinc-100">{{ entry.role }}</p>
                <p class="mt-1 text-xs text-zinc-400">
                  {{ entry.organization || '조직 미입력' }}
                </p>
              </div>
              <span
                class="rounded-full border border-[#314666] bg-[#101826] px-2 py-0.5 text-[10px] text-zinc-300"
              >
                {{ String(index + 1).padStart(2, '0') }}
              </span>
            </div>

            <div class="mt-2 flex flex-wrap gap-1.5">
              <span
                class="rounded-full border border-[#253447] bg-[#0d141d] px-2 py-0.5 text-[10px] text-zinc-400"
              >
                {{ entry.periodLabel || '기간 미입력' }}
              </span>
              <span
                class="rounded-full border border-[#253447] bg-[#0d141d] px-2 py-0.5 text-[10px] text-zinc-400"
              >
                {{ entry.durationLabel || '기간 요약 미입력' }}
              </span>
            </div>
          </button>
        </div>

        <div
          v-else
          class="mt-4 rounded-[1.15rem] border border-dashed border-[#31415a] bg-[#111923] px-4 py-10 text-center text-sm text-zinc-400"
        >
          등록된 경력 항목이 없습니다. 첫 항목을 추가해 주세요.
        </div>
      </aside>

      <section class="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_320px]">
        <form
          class="rounded-[1.5rem] border border-[#283244] bg-[#11161d] p-4 sm:p-5"
          @submit.prevent="saveCurrentCareer"
        >
          <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">Career Editor</p>
              <h2 class="mt-2 text-lg font-semibold text-zinc-100 sm:text-xl">
                {{ careerEditorTitle }}
              </h2>
              <p class="mt-1 text-sm leading-6 text-zinc-400">{{ careerEditorDescription }}</p>
            </div>
            <span
              class="rounded-full border px-3 py-1 text-xs"
              :class="
                isCreateCareerMode
                  ? 'border-[#4d6dab] bg-[#1d3d74] text-white'
                  : 'border-[#314666] bg-[#131d2b] text-zinc-200'
              "
            >
              {{ isCreateCareerMode ? '새 항목' : `순서 ${selectedCareerOrderLabel}` }}
            </span>
          </div>

          <p
            v-if="careerFeedbackMessage"
            class="mt-4 rounded-xl border border-[#2f466a] bg-[#11203a] px-3 py-2 text-xs text-blue-100"
          >
            {{ careerFeedbackMessage }}
          </p>

          <div class="mt-4 grid gap-4 lg:grid-cols-2">
            <label class="block">
              <span class="text-xs font-medium text-zinc-300">분류</span>
              <input
                v-model="careerDraft.category"
                type="text"
                class="mt-2 w-full rounded-xl border border-[#31415a] bg-[#0d1420] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#5f8cff]"
                placeholder="Mentoring"
              />
            </label>

            <label class="block">
              <span class="text-xs font-medium text-zinc-300">역할</span>
              <input
                v-model="careerDraft.role"
                type="text"
                class="mt-2 w-full rounded-xl border border-[#31415a] bg-[#0d1420] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#5f8cff]"
                placeholder="Frontend Developer"
              />
            </label>

            <label class="block">
              <span class="text-xs font-medium text-zinc-300">조직/팀</span>
              <input
                v-model="careerDraft.organization"
                type="text"
                class="mt-2 w-full rounded-xl border border-[#31415a] bg-[#0d1420] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#5f8cff]"
                placeholder="HLab"
              />
            </label>

            <label class="block">
              <span class="text-xs font-medium text-zinc-300">시작 시점</span>
              <input
                v-model="careerDraft.startedAt"
                type="text"
                class="mt-2 w-full rounded-xl border border-[#31415a] bg-[#0d1420] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#5f8cff]"
                placeholder="2025-03"
              />
            </label>

            <label class="block">
              <span class="text-xs font-medium text-zinc-300">종료 시점</span>
              <input
                v-model="careerDraft.endedAt"
                type="text"
                class="mt-2 w-full rounded-xl border border-[#31415a] bg-[#0d1420] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#5f8cff]"
                placeholder="Present 또는 2025-12"
              />
            </label>

            <label class="block">
              <span class="text-xs font-medium text-zinc-300">총 기간 라벨</span>
              <input
                v-model="careerDraft.durationLabel"
                type="text"
                class="mt-2 w-full rounded-xl border border-[#31415a] bg-[#0d1420] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#5f8cff]"
                placeholder="10개월"
              />
            </label>

            <label class="block lg:col-span-2">
              <span class="text-xs font-medium text-zinc-300">표시 기간 라벨</span>
              <input
                v-model="careerDraft.periodLabel"
                type="text"
                class="mt-2 w-full rounded-xl border border-[#31415a] bg-[#0d1420] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#5f8cff]"
                placeholder="2025.03 - Present"
              />
            </label>

            <label class="block lg:col-span-2">
              <span class="text-xs font-medium text-zinc-300">요약</span>
              <textarea
                v-model="careerDraft.summary"
                rows="4"
                class="mt-2 w-full rounded-xl border border-[#31415a] bg-[#0d1420] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#5f8cff]"
                placeholder="해당 역할에서 맡은 책임과 기여를 간단히 요약합니다."
              ></textarea>
            </label>

            <label class="block lg:col-span-2">
              <span class="text-xs font-medium text-zinc-300">하이라이트</span>
              <textarea
                v-model="careerDraft.highlightsInput"
                rows="5"
                class="mt-2 w-full rounded-xl border border-[#31415a] bg-[#0d1420] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#5f8cff]"
                placeholder="한 줄에 하나씩 입력해 주세요&#10;예: 관리자/클라이언트 공용 컴포넌트 구조 정리&#10;예: 블로그 API 전환 준비"
              ></textarea>
            </label>
          </div>

          <div class="mt-5 flex flex-wrap gap-2">
            <button
              type="submit"
              class="inline-flex items-center rounded-xl border border-[#4d6dab] bg-[#1d3d74] px-3 py-2 text-sm font-medium text-white transition hover:border-[#6f91d1] hover:bg-[#29508f]"
            >
              {{ isCreateCareerMode ? '경력 추가' : '변경사항 저장' }}
            </button>
            <button
              type="button"
              class="inline-flex items-center rounded-xl border border-[#314666] px-3 py-2 text-sm text-zinc-200 transition hover:border-[#5f8cff] hover:bg-[#101a2c] hover:text-white"
              @click="resetCareerDraft"
            >
              편집 초기화
            </button>
            <button
              v-if="selectedCareer"
              type="button"
              class="inline-flex items-center rounded-xl border border-[#7e3d3d] bg-[#2a1414] px-3 py-2 text-sm text-rose-300 transition hover:border-[#a34a4a] hover:bg-[#341818] hover:text-rose-200"
              @click="deleteSelectedCareer"
            >
              선택 항목 삭제
            </button>
          </div>
        </form>

        <aside class="rounded-[1.5rem] border border-[#243654] bg-[#0d1420] p-4">
          <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">Career Preview</p>
          <h3 class="mt-2 text-lg font-semibold text-zinc-100">경력 카드 미리보기</h3>

          <div class="mt-4 rounded-[1.25rem] border border-[#2c3e5b] bg-[#101826] p-4">
            <div class="flex flex-wrap gap-2">
              <span class="rounded-full border border-[#314666] bg-[#131d2b] px-2.5 py-1 text-[11px] text-zinc-200">
                {{ careerDraftPreview.category || '분류 미입력' }}
              </span>
              <span class="rounded-full border border-[#314666] bg-[#131d2b] px-2.5 py-1 text-[11px] text-zinc-200">
                {{ careerDraftPreview.periodLabel || '기간 미입력' }}
              </span>
              <span class="rounded-full border border-[#36548d] bg-[#12203a] px-2.5 py-1 text-[11px] text-blue-100">
                {{ careerDraftPreview.durationLabel || '기간 요약 미입력' }}
              </span>
            </div>

            <div class="mt-4">
              <p class="text-lg font-semibold text-zinc-100">
                {{ careerDraftPreview.role || '역할을 입력해 주세요' }}
              </p>
              <p class="mt-1 text-sm text-zinc-400">
                {{ careerDraftPreview.organization || '조직/팀 미입력' }}
              </p>
            </div>

            <p class="mt-4 text-sm leading-6 text-zinc-300">
              {{
                careerDraftPreview.summary ||
                '요약을 입력하면 공개 포트폴리오의 경력 카드에 설명이 표시됩니다.'
              }}
            </p>

            <ul
              v-if="careerDraftPreview.highlights.length > 0"
              class="mt-4 grid gap-2 text-sm leading-6 text-zinc-300"
            >
              <li
                v-for="highlight in careerDraftPreview.highlights"
                :key="`${careerDraftPreview.id}-${highlight}`"
                class="rounded-xl border border-[#27384f] bg-[#0d1420] px-3 py-2"
              >
                {{ highlight }}
              </li>
            </ul>
            <div
              v-else
              class="mt-4 rounded-xl border border-dashed border-[#31415a] px-3 py-4 text-sm text-zinc-500"
            >
              하이라이트를 추가하면 경력 카드 아래에 핵심 기여 목록이 표시됩니다.
            </div>
          </div>
        </aside>
      </section>
    </section>

    <section class="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
      <aside class="rounded-[1.5rem] border border-[#243654] bg-[#0d1420] p-4 sm:p-5">
        <div class="flex flex-col gap-3">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">Awards</p>
              <h2 class="mt-2 text-lg font-semibold text-zinc-100">수상 경력 목록</h2>
              <p class="mt-1 text-xs leading-5 text-zinc-400">
                타임라인 순서, 연도, 수상명, 주최 기관과 대표 이미지를 관리합니다.
              </p>
            </div>
            <span
              class="rounded-full border border-[#314666] bg-[#131d2b] px-3 py-1 text-xs text-zinc-200"
            >
              {{ awards.length }}개
            </span>
          </div>

          <div class="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-xl border border-[#4d6dab] bg-[#1d3d74] px-3 py-2 text-sm font-medium text-white transition hover:border-[#6f91d1] hover:bg-[#29508f]"
              @click="startCreatingAward"
            >
              새 수상 경력 추가
            </button>
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-xl border border-[#314666] px-3 py-2 text-sm text-zinc-200 transition hover:border-[#5f8cff] hover:bg-[#101a2c] hover:text-white"
              @click="restoreDefaultAwards"
            >
              기본값 복구
            </button>
          </div>

          <div
            v-if="hasSelectedAward"
            class="grid grid-cols-2 gap-2 rounded-[1.1rem] border border-[#27384f] bg-[#111923] p-2"
          >
            <button
              type="button"
              class="rounded-lg border px-2 py-2 text-xs transition"
              :class="
                canMoveAwardUp
                  ? 'border-[#314666] text-zinc-200 hover:border-[#5f8cff] hover:bg-[#101a2c] hover:text-white'
                  : 'border-[#223043] text-zinc-600'
              "
              :disabled="!canMoveAwardUp"
              @click="moveSelectedAward('up')"
            >
              위로
            </button>
            <button
              type="button"
              class="rounded-lg border px-2 py-2 text-xs transition"
              :class="
                canMoveAwardDown
                  ? 'border-[#314666] text-zinc-200 hover:border-[#5f8cff] hover:bg-[#101a2c] hover:text-white'
                  : 'border-[#223043] text-zinc-600'
              "
              :disabled="!canMoveAwardDown"
              @click="moveSelectedAward('down')"
            >
              아래로
            </button>
          </div>
        </div>

        <div v-if="awards.length > 0" class="mt-4 space-y-2.5">
          <button
            v-for="(award, index) in awards"
            :key="`${award.year}-${award.title}-${index}`"
            type="button"
            class="block w-full rounded-[1.15rem] border p-3 text-left transition"
            :class="
              selectedAwardIndex === index
                ? 'border-[#5f8cff] bg-[#13213a]'
                : 'border-[#27384f] bg-[#111923] hover:border-[#426189] hover:bg-[#142033]'
            "
            @click="selectAwardEntry(index)"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="text-sm font-semibold text-zinc-100">{{ award.title }}</p>
                <p class="mt-1 text-xs text-zinc-400">{{ award.organizer || '주최 기관 미입력' }}</p>
              </div>
              <span
                class="rounded-full border border-[#314666] bg-[#101826] px-2 py-0.5 text-[10px] text-zinc-300"
              >
                {{ award.year || '연도 미입력' }}
              </span>
            </div>
          </button>
        </div>

        <div
          v-else
          class="mt-4 rounded-[1.15rem] border border-dashed border-[#31415a] bg-[#111923] px-4 py-10 text-center text-sm text-zinc-400"
        >
          등록된 수상 경력이 없습니다. 첫 항목을 추가해 주세요.
        </div>
      </aside>

      <section class="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_320px]">
        <form
          class="rounded-[1.5rem] border border-[#283244] bg-[#11161d] p-4 sm:p-5"
          @submit.prevent="saveCurrentAward"
        >
          <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">Award Editor</p>
              <h2 class="mt-2 text-lg font-semibold text-zinc-100 sm:text-xl">
                {{ awardEditorTitle }}
              </h2>
              <p class="mt-1 text-sm leading-6 text-zinc-400">{{ awardEditorDescription }}</p>
            </div>
            <span
              class="rounded-full border px-3 py-1 text-xs"
              :class="
                isCreateAwardMode
                  ? 'border-[#4d6dab] bg-[#1d3d74] text-white'
                  : 'border-[#314666] bg-[#131d2b] text-zinc-200'
              "
            >
              {{ isCreateAwardMode ? '새 항목' : `순서 ${selectedAwardOrderLabel}` }}
            </span>
          </div>

          <p
            v-if="awardFeedbackMessage"
            class="mt-4 rounded-xl border border-[#2f466a] bg-[#11203a] px-3 py-2 text-xs text-blue-100"
          >
            {{ awardFeedbackMessage }}
          </p>

          <div class="mt-4 grid gap-4 lg:grid-cols-2">
            <label class="block">
              <span class="text-xs font-medium text-zinc-300">연도</span>
              <input
                v-model="awardDraft.year"
                type="text"
                class="mt-2 w-full rounded-xl border border-[#31415a] bg-[#0d1420] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#5f8cff]"
                placeholder="2025"
              />
            </label>

            <label class="block">
              <span class="text-xs font-medium text-zinc-300">주최 기관</span>
              <input
                v-model="awardDraft.organizer"
                type="text"
                class="mt-2 w-full rounded-xl border border-[#31415a] bg-[#0d1420] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#5f8cff]"
                placeholder="SCSC 연구 동호회"
              />
            </label>

            <label class="block lg:col-span-2">
              <span class="text-xs font-medium text-zinc-300">수상명</span>
              <input
                v-model="awardDraft.title"
                type="text"
                class="mt-2 w-full rounded-xl border border-[#31415a] bg-[#0d1420] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#5f8cff]"
                placeholder="서울대학교 SCSC 온라인 해커톤 (최우수상, 1등)"
              />
            </label>

            <label class="block lg:col-span-2">
              <span class="text-xs font-medium text-zinc-300">이미지 URL</span>
              <input
                v-model="awardDraft.imageSrc"
                type="text"
                class="mt-2 w-full rounded-xl border border-[#31415a] bg-[#0d1420] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#5f8cff]"
                placeholder="https://... 또는 data:image/..."
              />
            </label>

            <label class="block lg:col-span-2">
              <span class="text-xs font-medium text-zinc-300">이미지 대체 텍스트</span>
              <input
                v-model="awardDraft.imageAlt"
                type="text"
                class="mt-2 w-full rounded-xl border border-[#31415a] bg-[#0d1420] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#5f8cff]"
                placeholder="수상 사진 설명"
              />
            </label>
          </div>

          <div class="mt-4 rounded-[1.2rem] border border-[#27384f] bg-[#0d1420] p-4">
            <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p class="text-sm font-semibold text-zinc-100">이미지 입력</p>
                <p class="mt-1 text-xs text-zinc-500">
                  URL을 직접 넣거나 파일을 선택해 수상 대표 이미지를 연결할 수 있습니다.
                </p>
              </div>

              <div class="flex flex-wrap gap-2">
                <label
                  class="inline-flex cursor-pointer items-center rounded-lg border border-[#314666] px-3 py-2 text-xs text-zinc-200 transition hover:border-[#5f8cff] hover:bg-[#101a2c] hover:text-white"
                >
                  이미지 파일 선택
                  <input type="file" class="hidden" accept="image/*" @change="handleSelectAwardImage" />
                </label>
                <button
                  type="button"
                  class="rounded-lg border border-[#314666] px-3 py-2 text-xs text-zinc-200 transition hover:border-[#5f8cff] hover:bg-[#101a2c] hover:text-white"
                  @click="clearAwardDraftImage"
                >
                  이미지 제거
                </button>
              </div>
            </div>
          </div>

          <div class="mt-5 flex flex-wrap gap-2">
            <button
              type="submit"
              class="inline-flex items-center rounded-xl border border-[#4d6dab] bg-[#1d3d74] px-3 py-2 text-sm font-medium text-white transition hover:border-[#6f91d1] hover:bg-[#29508f]"
            >
              {{ isCreateAwardMode ? '수상 경력 추가' : '변경사항 저장' }}
            </button>
            <button
              type="button"
              class="inline-flex items-center rounded-xl border border-[#314666] px-3 py-2 text-sm text-zinc-200 transition hover:border-[#5f8cff] hover:bg-[#101a2c] hover:text-white"
              @click="resetAwardDraft"
            >
              편집 초기화
            </button>
            <button
              v-if="selectedAward"
              type="button"
              class="inline-flex items-center rounded-xl border border-[#7e3d3d] bg-[#2a1414] px-3 py-2 text-sm text-rose-300 transition hover:border-[#a34a4a] hover:bg-[#341818] hover:text-rose-200"
              @click="deleteSelectedAward"
            >
              선택 항목 삭제
            </button>
          </div>
        </form>

        <aside class="rounded-[1.5rem] border border-[#243654] bg-[#0d1420] p-4">
          <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">Award Preview</p>
          <h3 class="mt-2 text-lg font-semibold text-zinc-100">수상 미리보기</h3>

          <div class="mt-4 overflow-hidden rounded-[1.35rem] border border-[#2c3e5b] bg-[#101826]">
            <div class="aspect-[4/3] border-b border-[#233149] bg-[#0b1320]">
              <img
                v-if="awardDraftPreview.imageSrc"
                :src="awardDraftPreview.imageSrc"
                :alt="awardDraftPreview.imageAlt || awardDraftPreview.title || 'award preview'"
                class="h-full w-full object-cover"
              />
              <div
                v-else
                class="flex h-full w-full items-center justify-center px-6 text-center text-sm leading-6 text-zinc-500"
              >
                이미지를 연결하면 공개 포트폴리오의 수상 대표 영역에서 같이 보여집니다.
              </div>
            </div>

            <div class="p-4">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="text-lg font-semibold text-zinc-100">
                    {{ awardDraftPreview.title || '수상명을 입력해 주세요' }}
                  </p>
                  <p class="mt-1 text-sm text-zinc-400">
                    {{ awardDraftPreview.organizer || '주최 기관 미입력' }}
                  </p>
                </div>
                <span
                  class="rounded-full border border-[#314666] bg-[#131d2b] px-2.5 py-1 text-[11px] text-zinc-200"
                >
                  {{ awardDraftPreview.year || '연도' }}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </section>

    <section class="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
      <aside class="rounded-[1.5rem] border border-[#243654] bg-[#0d1420] p-4 sm:p-5">
        <div class="flex flex-col gap-3">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">Stack</p>
              <h2 class="mt-2 text-lg font-semibold text-zinc-100">기술 스택 목록</h2>
              <p class="mt-1 text-xs leading-5 text-zinc-400">
                티커와 스택 상세 페이지에 함께 노출되는 기술 항목을 관리합니다.
              </p>
            </div>
            <span
              class="rounded-full border border-[#314666] bg-[#131d2b] px-3 py-1 text-xs text-zinc-200"
            >
              {{ stackItems.length }}개
            </span>
          </div>

          <div class="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-xl border border-[#4d6dab] bg-[#1d3d74] px-3 py-2 text-sm font-medium text-white transition hover:border-[#6f91d1] hover:bg-[#29508f]"
              @click="startCreatingStackItem"
            >
              새 기술 추가
            </button>
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-xl border border-[#314666] px-3 py-2 text-sm text-zinc-200 transition hover:border-[#5f8cff] hover:bg-[#101a2c] hover:text-white"
              @click="restoreDefaultStackItems"
            >
              기본값 복구
            </button>
          </div>

          <div
            v-if="hasSelectedStackItem"
            class="grid grid-cols-2 gap-2 rounded-[1.1rem] border border-[#27384f] bg-[#111923] p-2"
          >
            <button
              type="button"
              class="rounded-lg border px-2 py-2 text-xs transition"
              :class="
                canMoveStackUp
                  ? 'border-[#314666] text-zinc-200 hover:border-[#5f8cff] hover:bg-[#101a2c] hover:text-white'
                  : 'border-[#223043] text-zinc-600'
              "
              :disabled="!canMoveStackUp"
              @click="moveSelectedStackItem('up')"
            >
              위로
            </button>
            <button
              type="button"
              class="rounded-lg border px-2 py-2 text-xs transition"
              :class="
                canMoveStackDown
                  ? 'border-[#314666] text-zinc-200 hover:border-[#5f8cff] hover:bg-[#101a2c] hover:text-white'
                  : 'border-[#223043] text-zinc-600'
              "
              :disabled="!canMoveStackDown"
              @click="moveSelectedStackItem('down')"
            >
              아래로
            </button>
          </div>
        </div>

        <div v-if="stackItems.length > 0" class="mt-4 space-y-2.5">
          <button
            v-for="(item, index) in stackItems"
            :key="`${item.label}-${index}`"
            type="button"
            class="block w-full rounded-[1.15rem] border p-3 text-left transition"
            :class="
              selectedStackIndex === index
                ? 'border-[#5f8cff] bg-[#13213a]'
                : 'border-[#27384f] bg-[#111923] hover:border-[#426189] hover:bg-[#142033]'
            "
            @click="selectStackEntry(index)"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="text-sm font-semibold text-zinc-100">{{ item.label }}</p>
                <p class="mt-1 text-xs text-zinc-400">
                  {{ item.category || '분야 미입력' }} · {{ item.proficiency || '숙련도 미입력' }}
                </p>
              </div>
              <span
                class="rounded-full border border-[#314666] bg-[#101826] px-2 py-0.5 text-[10px] text-zinc-300"
              >
                {{ String(index + 1).padStart(2, '0') }}
              </span>
            </div>
          </button>
        </div>

        <div
          v-else
          class="mt-4 rounded-[1.15rem] border border-dashed border-[#31415a] bg-[#111923] px-4 py-10 text-center text-sm text-zinc-400"
        >
          등록된 기술 스택이 없습니다. 첫 항목을 추가해 주세요.
        </div>
      </aside>

      <section class="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_320px]">
        <form
          class="rounded-[1.5rem] border border-[#283244] bg-[#11161d] p-4 sm:p-5"
          @submit.prevent="saveCurrentStackItem"
        >
          <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">Stack Editor</p>
              <h2 class="mt-2 text-lg font-semibold text-zinc-100 sm:text-xl">
                {{ stackEditorTitle }}
              </h2>
              <p class="mt-1 text-sm leading-6 text-zinc-400">{{ stackEditorDescription }}</p>
            </div>
            <span
              class="rounded-full border px-3 py-1 text-xs"
              :class="
                isCreateStackMode
                  ? 'border-[#4d6dab] bg-[#1d3d74] text-white'
                  : 'border-[#314666] bg-[#131d2b] text-zinc-200'
              "
            >
              {{ isCreateStackMode ? '새 항목' : `순서 ${selectedStackOrderLabel}` }}
            </span>
          </div>

          <p
            v-if="stackFeedbackMessage"
            class="mt-4 rounded-xl border border-[#2f466a] bg-[#11203a] px-3 py-2 text-xs text-blue-100"
          >
            {{ stackFeedbackMessage }}
          </p>

          <div class="mt-4 grid gap-4 lg:grid-cols-2">
            <label class="block">
              <span class="text-xs font-medium text-zinc-300">기술 이름</span>
              <input
                v-model="stackDraft.label"
                type="text"
                class="mt-2 w-full rounded-xl border border-[#31415a] bg-[#0d1420] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#5f8cff]"
                placeholder="Docker"
              />
            </label>

            <label class="block">
              <span class="text-xs font-medium text-zinc-300">분야</span>
              <input
                v-model="stackDraft.category"
                type="text"
                class="mt-2 w-full rounded-xl border border-[#31415a] bg-[#0d1420] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#5f8cff]"
                placeholder="인프라"
              />
            </label>

            <label class="block">
              <span class="text-xs font-medium text-zinc-300">숙련도</span>
              <input
                v-model="stackDraft.proficiency"
                type="text"
                class="mt-2 w-full rounded-xl border border-[#31415a] bg-[#0d1420] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#5f8cff]"
                placeholder="중상"
              />
            </label>

            <label class="block">
              <span class="text-xs font-medium text-zinc-300">아이콘(emoji/문자)</span>
              <input
                v-model="stackDraft.icon"
                type="text"
                class="mt-2 w-full rounded-xl border border-[#31415a] bg-[#0d1420] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#5f8cff]"
                placeholder="☁️"
              />
            </label>

            <label class="block lg:col-span-2">
              <span class="text-xs font-medium text-zinc-300">아이콘 이미지 URL</span>
              <input
                v-model="stackDraft.imageSrc"
                type="text"
                class="mt-2 w-full rounded-xl border border-[#31415a] bg-[#0d1420] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#5f8cff]"
                placeholder="https://..."
              />
            </label>

            <label class="block lg:col-span-2">
              <span class="text-xs font-medium text-zinc-300">이미지 대체 텍스트</span>
              <input
                v-model="stackDraft.imageAlt"
                type="text"
                class="mt-2 w-full rounded-xl border border-[#31415a] bg-[#0d1420] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#5f8cff]"
                placeholder="Docker icon"
              />
            </label>
          </div>

          <div class="mt-4 rounded-[1.2rem] border border-[#27384f] bg-[#0d1420] p-4">
            <p class="text-sm font-semibold text-zinc-100">경험 기준</p>
            <div class="mt-3 grid gap-2 sm:grid-cols-3">
              <label class="flex items-center gap-2 rounded-xl border border-[#31415a] bg-[#111923] px-3 py-2 text-sm text-zinc-200">
                <input v-model="stackDraft.projectUsed" type="checkbox" class="accent-[#5f8cff]" />
                프로젝트에서 사용
              </label>
              <label class="flex items-center gap-2 rounded-xl border border-[#31415a] bg-[#111923] px-3 py-2 text-sm text-zinc-200">
                <input v-model="stackDraft.practicalUsed" type="checkbox" class="accent-[#5f8cff]" />
                실무에서 사용
              </label>
              <label class="flex items-center gap-2 rounded-xl border border-[#31415a] bg-[#111923] px-3 py-2 text-sm text-zinc-200">
                <input
                  v-model="stackDraft.internalsExplored"
                  type="checkbox"
                  class="accent-[#5f8cff]"
                />
                내부 구조 분석
              </label>
            </div>
          </div>

          <div class="mt-5 flex flex-wrap gap-2">
            <button
              type="submit"
              class="inline-flex items-center rounded-xl border border-[#4d6dab] bg-[#1d3d74] px-3 py-2 text-sm font-medium text-white transition hover:border-[#6f91d1] hover:bg-[#29508f]"
            >
              {{ isCreateStackMode ? '기술 추가' : '변경사항 저장' }}
            </button>
            <button
              type="button"
              class="inline-flex items-center rounded-xl border border-[#314666] px-3 py-2 text-sm text-zinc-200 transition hover:border-[#5f8cff] hover:bg-[#101a2c] hover:text-white"
              @click="resetStackDraft"
            >
              편집 초기화
            </button>
            <button
              v-if="selectedStackItem"
              type="button"
              class="inline-flex items-center rounded-xl border border-[#7e3d3d] bg-[#2a1414] px-3 py-2 text-sm text-rose-300 transition hover:border-[#a34a4a] hover:bg-[#341818] hover:text-rose-200"
              @click="deleteSelectedStackItem"
            >
              선택 항목 삭제
            </button>
          </div>
        </form>

        <aside class="rounded-[1.5rem] border border-[#243654] bg-[#0d1420] p-4">
          <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">Stack Preview</p>
          <h3 class="mt-2 text-lg font-semibold text-zinc-100">기술 카드 미리보기</h3>

          <div class="mt-4 rounded-[1.25rem] border border-[#2c3e5b] bg-[#101826] p-4">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="text-lg font-semibold text-zinc-100">
                  {{ stackDraftPreview.label || '기술 이름을 입력해 주세요' }}
                </p>
                <p class="mt-1 text-sm text-zinc-400">
                  {{ stackDraftPreview.category || '분야 미입력' }} ·
                  {{ stackDraftPreview.proficiency || '숙련도 미입력' }}
                </p>
              </div>
              <span
                v-if="stackDraftPreview.icon"
                class="rounded-full border border-[#314666] bg-[#131d2b] px-3 py-1 text-sm text-zinc-200"
              >
                {{ stackDraftPreview.icon }}
              </span>
            </div>

            <div class="mt-4 flex flex-wrap gap-2">
              <span class="rounded-full border px-2.5 py-1 text-[11px]" :class="getCapabilityToneClass(stackDraftPreview.capability.projectUsed)">
                프로젝트 사용 {{ stackDraftPreview.capability.projectUsed ? '예' : '아니오' }}
              </span>
              <span class="rounded-full border px-2.5 py-1 text-[11px]" :class="getCapabilityToneClass(stackDraftPreview.capability.practicalUsed)">
                실무 사용 {{ stackDraftPreview.capability.practicalUsed ? '예' : '아니오' }}
              </span>
              <span class="rounded-full border px-2.5 py-1 text-[11px]" :class="getCapabilityToneClass(stackDraftPreview.capability.internalsExplored)">
                구조 분석 {{ stackDraftPreview.capability.internalsExplored ? '예' : '아니오' }}
              </span>
            </div>
          </div>
        </aside>
      </section>
    </section>

    <section class="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
      <aside class="rounded-[1.5rem] border border-[#243654] bg-[#0d1420] p-4 sm:p-5">
        <div class="flex flex-col gap-3">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">Certificate Rail</p>
              <h2 class="mt-2 text-lg font-semibold text-zinc-100">자격증 카드 목록</h2>
              <p class="mt-1 text-xs leading-5 text-zinc-400">
                왼쪽 목록에서 카드를 고르고, 오른쪽 편집기에서 내용을 수정합니다.
              </p>
            </div>
            <span
              class="rounded-full border border-[#314666] bg-[#131d2b] px-3 py-1 text-xs text-zinc-200"
            >
              {{ certificates.length }}개
            </span>
          </div>

          <div class="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-xl border border-[#4d6dab] bg-[#1d3d74] px-3 py-2 text-sm font-medium text-white transition hover:border-[#6f91d1] hover:bg-[#29508f]"
              @click="startCreatingCertificate"
            >
              새 자격증 추가
            </button>
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-xl border border-[#314666] px-3 py-2 text-sm text-zinc-200 transition hover:border-[#5f8cff] hover:bg-[#101a2c] hover:text-white"
              @click="restoreDefaultCertificates"
            >
              기본값 복구
            </button>
          </div>

          <div
            v-if="hasSelectedCertificate"
            class="grid grid-cols-3 gap-2 rounded-[1.1rem] border border-[#27384f] bg-[#111923] p-2"
          >
            <button
              type="button"
              class="rounded-lg border px-2 py-2 text-xs transition"
              :class="
                canMoveSelectionUp
                  ? 'border-[#314666] text-zinc-200 hover:border-[#5f8cff] hover:bg-[#101a2c] hover:text-white'
                  : 'border-[#223043] text-zinc-600'
              "
              :disabled="!canMoveSelectionUp"
              @click="moveSelectedCertificate('up')"
            >
              위로
            </button>
            <button
              type="button"
              class="rounded-lg border border-[#314666] px-2 py-2 text-xs text-zinc-200 transition hover:border-[#5f8cff] hover:bg-[#101a2c] hover:text-white"
              @click="duplicateSelectedCertificate"
            >
              복제
            </button>
            <button
              type="button"
              class="rounded-lg border px-2 py-2 text-xs transition"
              :class="
                canMoveSelectionDown
                  ? 'border-[#314666] text-zinc-200 hover:border-[#5f8cff] hover:bg-[#101a2c] hover:text-white'
                  : 'border-[#223043] text-zinc-600'
              "
              :disabled="!canMoveSelectionDown"
              @click="moveSelectedCertificate('down')"
            >
              아래로
            </button>
          </div>
        </div>

        <div v-if="certificates.length > 0" class="mt-4 space-y-2.5">
          <button
            v-for="(certificate, index) in certificates"
            :key="`${certificate.title}-${index}`"
            type="button"
            class="block w-full rounded-[1.15rem] border p-3 text-left transition"
            :class="
              selectedCertificateIndex === index
                ? 'border-[#5f8cff] bg-[#13213a]'
                : 'border-[#27384f] bg-[#111923] hover:border-[#426189] hover:bg-[#142033]'
            "
            @click="selectCertificate(index)"
          >
            <div class="flex items-start gap-3">
              <div
                class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#2c3f5b] bg-[#0b1320]"
              >
                <img
                  v-if="certificate.imageSrc"
                  :src="certificate.imageSrc"
                  :alt="certificate.imageAlt ?? certificate.title"
                  class="h-full w-full object-cover"
                  loading="lazy"
                />
                <span v-else class="px-2 text-center text-[10px] leading-4 text-zinc-500">
                  이미지 없음
                </span>
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-3">
                  <p class="truncate text-sm font-semibold text-zinc-100">
                    {{ certificate.title }}
                  </p>
                  <span
                    class="rounded-full border border-[#314666] bg-[#101826] px-2 py-0.5 text-[10px] text-zinc-300"
                  >
                    {{ String(index + 1).padStart(2, '0') }}
                  </span>
                </div>
                <p class="mt-1 text-xs text-zinc-400">
                  {{ certificate.issuer || '발급 기관 미입력' }}
                </p>
                <div class="mt-2 flex flex-wrap gap-1.5">
                  <span
                    class="rounded-full border border-[#253447] bg-[#0d141d] px-2 py-0.5 text-[10px] text-zinc-400"
                  >
                    {{ certificate.issuedAt || '날짜 미입력' }}
                  </span>
                  <span
                    class="rounded-full border border-[#253447] bg-[#0d141d] px-2 py-0.5 text-[10px] text-zinc-400"
                  >
                    {{ certificate.tags.length }} tags
                  </span>
                  <span
                    class="rounded-full border px-2 py-0.5 text-[10px]"
                    :class="
                      certificate.imageSrc
                        ? 'border-[#36548d] bg-[#12203a] text-blue-100'
                        : 'border-[#2d3746] bg-[#141b26] text-zinc-400'
                    "
                  >
                    {{ certificate.imageSrc ? '이미지 연결' : '텍스트 카드' }}
                  </span>
                </div>
              </div>
            </div>
          </button>
        </div>

        <div
          v-else
          class="mt-4 rounded-[1.15rem] border border-dashed border-[#31415a] bg-[#111923] px-4 py-10 text-center text-sm text-zinc-400"
        >
          등록된 자격증이 없습니다. 첫 항목을 추가해 주세요.
        </div>
      </aside>

      <section class="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_340px]">
        <form
          class="rounded-[1.5rem] border border-[#283244] bg-[#11161d] p-4 sm:p-5"
          @submit.prevent="saveCurrentCertificate"
        >
          <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">Editor</p>
              <h2 class="mt-2 text-lg font-semibold text-zinc-100 sm:text-xl">{{ editorTitle }}</h2>
              <p class="mt-1 text-sm leading-6 text-zinc-400">{{ editorDescription }}</p>
            </div>
            <span
              class="rounded-full border px-3 py-1 text-xs"
              :class="
                isCreateMode
                  ? 'border-[#4d6dab] bg-[#1d3d74] text-white'
                  : 'border-[#314666] bg-[#131d2b] text-zinc-200'
              "
            >
              {{ isCreateMode ? '새 항목' : `순서 ${selectedOrderLabel}` }}
            </span>
          </div>

          <p
            v-if="certificateFeedbackMessage"
            class="mt-4 rounded-xl border border-[#2f466a] bg-[#11203a] px-3 py-2 text-xs text-blue-100"
          >
            {{ certificateFeedbackMessage }}
          </p>

          <div class="mt-4 grid gap-4 lg:grid-cols-2">
            <label class="block">
              <span class="text-xs font-medium text-zinc-300">자격증 제목</span>
              <input
                v-model="draft.title"
                type="text"
                class="mt-2 w-full rounded-xl border border-[#31415a] bg-[#0d1420] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#5f8cff]"
                placeholder="정보처리 산업기사"
              />
            </label>

            <label class="block">
              <span class="text-xs font-medium text-zinc-300">상태 텍스트</span>
              <input
                v-model="draft.status"
                type="text"
                class="mt-2 w-full rounded-xl border border-[#31415a] bg-[#0d1420] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#5f8cff]"
                placeholder="게시 중"
              />
            </label>

            <label class="block">
              <span class="text-xs font-medium text-zinc-300">발급 기관</span>
              <input
                v-model="draft.issuer"
                type="text"
                class="mt-2 w-full rounded-xl border border-[#31415a] bg-[#0d1420] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#5f8cff]"
                placeholder="한국산업인력공단"
              />
            </label>

            <label class="block">
              <span class="text-xs font-medium text-zinc-300">취득 날짜</span>
              <input
                v-model="draft.issuedAt"
                type="text"
                class="mt-2 w-full rounded-xl border border-[#31415a] bg-[#0d1420] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#5f8cff]"
                placeholder="2025-10-12"
              />
            </label>

            <label class="block">
              <span class="text-xs font-medium text-zinc-300">인증 번호</span>
              <input
                v-model="draft.credentialId"
                type="text"
                class="mt-2 w-full rounded-xl border border-[#31415a] bg-[#0d1420] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#5f8cff]"
                placeholder="2025-0000-0000"
              />
            </label>

            <label class="block">
              <span class="text-xs font-medium text-zinc-300">이미지 대체 텍스트</span>
              <input
                v-model="draft.imageAlt"
                type="text"
                class="mt-2 w-full rounded-xl border border-[#31415a] bg-[#0d1420] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#5f8cff]"
                placeholder="정보처리 산업기사 자격증 스캔본"
              />
            </label>

            <label class="block lg:col-span-2">
              <span class="text-xs font-medium text-zinc-300">이미지 URL</span>
              <input
                v-model="draft.imageSrc"
                type="text"
                class="mt-2 w-full rounded-xl border border-[#31415a] bg-[#0d1420] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#5f8cff]"
                placeholder="https://... 또는 data:image/..."
              />
            </label>

            <label class="block lg:col-span-2">
              <span class="text-xs font-medium text-zinc-300">태그</span>
              <input
                v-model="draft.tagsInput"
                type="text"
                class="mt-2 w-full rounded-xl border border-[#31415a] bg-[#0d1420] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#5f8cff]"
                placeholder="Backend, Server, Certificate"
              />
            </label>

            <label class="block lg:col-span-2">
              <span class="text-xs font-medium text-zinc-300">설명</span>
              <textarea
                v-model="draft.description"
                rows="5"
                class="mt-2 w-full rounded-xl border border-[#31415a] bg-[#0d1420] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#5f8cff]"
                placeholder="자격증 설명 또는 메모"
              ></textarea>
            </label>
          </div>

          <div class="mt-4 rounded-[1.2rem] border border-[#27384f] bg-[#0d1420] p-4">
            <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p class="text-sm font-semibold text-zinc-100">이미지 입력</p>
                <p class="mt-1 text-xs text-zinc-500">
                  URL을 직접 넣거나 파일을 선택해서 초안 이미지로 바로 확인할 수 있습니다.
                </p>
              </div>

              <div class="flex flex-wrap gap-2">
                <label
                  class="inline-flex cursor-pointer items-center rounded-lg border border-[#314666] px-3 py-2 text-xs text-zinc-200 transition hover:border-[#5f8cff] hover:bg-[#101a2c] hover:text-white"
                >
                  이미지 파일 선택
                  <input
                    type="file"
                    class="hidden"
                    accept="image/*"
                    @change="handleSelectCertificateImage"
                  />
                </label>
                <button
                  type="button"
                  class="rounded-lg border border-[#314666] px-3 py-2 text-xs text-zinc-200 transition hover:border-[#5f8cff] hover:bg-[#101a2c] hover:text-white"
                  @click="clearDraftImage"
                >
                  이미지 제거
                </button>
              </div>
            </div>
          </div>

          <div class="mt-5 flex flex-wrap gap-2">
            <button
              type="submit"
              class="inline-flex items-center rounded-xl border border-[#4d6dab] bg-[#1d3d74] px-3 py-2 text-sm font-medium text-white transition hover:border-[#6f91d1] hover:bg-[#29508f]"
            >
              {{ isCreateMode ? '자격증 추가' : '변경사항 저장' }}
            </button>
            <button
              type="button"
              class="inline-flex items-center rounded-xl border border-[#314666] px-3 py-2 text-sm text-zinc-200 transition hover:border-[#5f8cff] hover:bg-[#101a2c] hover:text-white"
              @click="resetDraft"
            >
              편집 초기화
            </button>
            <button
              v-if="selectedCertificate"
              type="button"
              class="inline-flex items-center rounded-xl border border-[#7e3d3d] bg-[#2a1414] px-3 py-2 text-sm text-rose-300 transition hover:border-[#a34a4a] hover:bg-[#341818] hover:text-rose-200"
              @click="deleteSelectedCertificate"
            >
              선택 항목 삭제
            </button>
          </div>
        </form>

        <aside class="space-y-4">
          <article class="rounded-[1.5rem] border border-[#243654] bg-[#0d1420] p-4">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">Live Preview</p>
                <h3 class="mt-2 text-lg font-semibold text-zinc-100">카드 미리보기</h3>
              </div>
              <span
                class="rounded-full border px-2.5 py-1 text-[11px]"
                :class="
                  draftPreview.imageSrc
                    ? 'border-[#36548d] bg-[#12203a] text-blue-100'
                    : 'border-[#2d3746] bg-[#141b26] text-zinc-400'
                "
              >
                {{ draftPreview.imageSrc ? '이미지 포함' : '텍스트 중심' }}
              </span>
            </div>

            <div
              class="mt-4 overflow-hidden rounded-[1.35rem] border border-[#2c3e5b] bg-[#101826]"
            >
              <div class="aspect-[4/3] border-b border-[#233149] bg-[#0b1320]">
                <img
                  v-if="draftPreview.imageSrc"
                  :src="draftPreview.imageSrc"
                  :alt="draftPreview.imageAlt || draftPreview.title || 'certificate preview'"
                  class="h-full w-full object-cover"
                />
                <div
                  v-else
                  class="flex h-full w-full items-center justify-center px-6 text-center text-sm leading-6 text-zinc-500"
                >
                  자격증 이미지를 연결하면 공개 포트폴리오 카드에서 바로 미리 볼 수 있습니다.
                </div>
              </div>

              <div class="p-4">
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <p class="text-lg font-semibold text-zinc-100">
                      {{ draftPreview.title || '제목을 입력해 주세요' }}
                    </p>
                    <p class="mt-1 text-sm text-zinc-400">
                      {{ draftPreview.issuer || '발급 기관 미입력' }}
                    </p>
                  </div>
                  <span
                    class="rounded-full border border-[#314666] bg-[#131d2b] px-2.5 py-1 text-[11px] text-zinc-200"
                  >
                    {{ draftPreview.status || 'Draft' }}
                  </span>
                </div>

                <p class="mt-4 text-sm leading-6 text-zinc-300">
                  {{
                    draftPreview.description ||
                    '설명을 입력하면 자격증이 어떤 역량을 증명하는지 카드에서 바로 드러납니다.'
                  }}
                </p>

                <dl class="mt-4 space-y-2 text-xs text-zinc-400">
                  <div class="flex items-center justify-between gap-3">
                    <dt>취득 날짜</dt>
                    <dd class="text-zinc-200">{{ draftPreview.issuedAt || '미입력' }}</dd>
                  </div>
                  <div class="flex items-center justify-between gap-3">
                    <dt>인증 번호</dt>
                    <dd class="text-zinc-200">{{ draftPreview.credentialId || '미입력' }}</dd>
                  </div>
                </dl>

                <div class="mt-4 flex flex-wrap gap-1.5">
                  <span
                    v-for="tag in draftPreview.tags"
                    :key="tag"
                    class="rounded-full border border-[#314666] bg-[#111a28] px-2.5 py-1 text-[11px] text-zinc-200"
                  >
                    {{ tag }}
                  </span>
                  <span
                    v-if="draftPreview.tags.length === 0"
                    class="rounded-full border border-dashed border-[#31415a] px-2.5 py-1 text-[11px] text-zinc-500"
                  >
                    태그 없음
                  </span>
                </div>
              </div>
            </div>
          </article>

          <article class="rounded-[1.5rem] border border-[#283244] bg-[#11161d] p-4">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">Checklist</p>
                <h3 class="mt-2 text-lg font-semibold text-zinc-100">게시 체크리스트</h3>
              </div>
              <span
                class="rounded-full border border-[#314666] bg-[#131d2b] px-3 py-1 text-xs text-zinc-200"
              >
                {{ checklistCompletedCount }}/{{ draftChecklist.length }}
              </span>
            </div>

            <div class="mt-4 space-y-2.5">
              <article
                v-for="item in draftChecklist"
                :key="item.id"
                class="rounded-[1.05rem] border p-3"
                :class="
                  item.isComplete
                    ? 'border-[#2b4f80] bg-[#12203a]'
                    : 'border-[#27384f] bg-[#0d1420]'
                "
              >
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="text-sm font-medium text-zinc-100">{{ item.label }}</p>
                    <p class="mt-1 text-xs leading-5 text-zinc-400">{{ item.description }}</p>
                  </div>
                  <span
                    class="shrink-0 rounded-full border px-2 py-0.5 text-[10px]"
                    :class="
                      item.isComplete
                        ? 'border-[#4d6dab] bg-[#1d3d74] text-white'
                        : item.isOptional
                          ? 'border-[#314666] bg-[#131d2b] text-zinc-300'
                          : 'border-[#3f2f1f] bg-[#1f1710] text-amber-200'
                    "
                  >
                    {{ item.isComplete ? '완료' : item.isOptional ? '선택' : '필수' }}
                  </span>
                </div>
              </article>
            </div>
          </article>

          <article class="rounded-[1.5rem] border border-[#283244] bg-[#11161d] p-4">
            <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">Selection</p>
            <h3 class="mt-2 text-lg font-semibold text-zinc-100">선택 항목 요약</h3>

            <dl class="mt-4 space-y-3">
              <div
                v-for="insight in activeCertificateInsights"
                :key="insight.id"
                class="flex items-center justify-between gap-3 rounded-[1rem] border border-[#27384f] bg-[#0d1420] px-3 py-3"
              >
                <dt class="text-xs text-zinc-500">{{ insight.label }}</dt>
                <dd class="text-sm font-medium text-zinc-100">{{ insight.value }}</dd>
              </div>
            </dl>
          </article>
        </aside>
      </section>
    </section>
  </AdminWorkspaceLayout>
</template>
