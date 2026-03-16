<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { worksByLocale } from '@/data/portfolio/works'
import type { Locale, WorkItem } from '@/data/portfolio/types'
import { useLocale } from '@/composables/useLocale'
import { markdownToHtml } from '@/utils/markdown'
import AdminSidebarNav from '@/components/organisms/AdminSidebarNav.vue'
import MarkdownLiveEditor from '@/components/molecules/MarkdownLiveEditor.vue'

type CollaborationLink = {
  name: string
  url: string
}

type AdminProjectRecord = WorkItem & {
  id: string
  teamRole: string
  troubleshooting: string
  collaborationLinks: CollaborationLink[]
}

const { locale, route, basePath, adminPath, adminProjectPath } = useLocale()
const router = useRouter()

const slugify = (value: string) =>
  value
    .trim()
    .toLocaleLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'project'

const createProjectRecord = (
  work: WorkItem,
  index: number,
  currentLocale: Locale,
): AdminProjectRecord => ({
  id: `${slugify(work.title)}-${index + 1}-${currentLocale}`,
  title: work.title,
  summary: work.summary,
  impact: work.impact,
  teamRole: '',
  stack: [...work.stack],
  imageSrc: work.imageSrc,
  imageAlt: work.imageAlt,
  troubleshooting: '',
  collaborationLinks: (work.links ?? []).map((link) => ({ ...link })),
})

const projectStoreByLocale = ref<Record<Locale, AdminProjectRecord[]>>({
  ko: worksByLocale.ko.map((work, index) => createProjectRecord(work, index, 'ko')),
  en: worksByLocale.en.map((work, index) => createProjectRecord(work, index, 'en')),
})

const selectedProjectIdByLocale = ref<Record<Locale, string | null>>({
  ko: null,
  en: null,
})

const projects = computed(() => projectStoreByLocale.value[locale.value])
const selectedProjectId = computed(() => selectedProjectIdByLocale.value[locale.value])
const selectedProject = computed(
  () => projects.value.find((project) => project.id === selectedProjectId.value) ?? null,
)
const routeProjectId = computed(() => {
  const raw = route.params.id
  const value = Array.isArray(raw) ? raw[0] : raw

  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()

  if (!trimmed) {
    return null
  }

  try {
    return decodeURIComponent(trimmed)
  } catch {
    return trimmed
  }
})
const routeEditorPanel = computed<'troubleshooting' | 'settings' | null>(() => {
  const raw = route.query.panel
  const value = Array.isArray(raw) ? raw[0] : raw

  if (value === 'settings' || value === 'troubleshooting') {
    return value
  }

  return null
})

const editTitle = ref('')
const editSummary = ref('')
const editImpact = ref('')
const editTeamRole = ref('')
const editImageSrc = ref('')
const editImageAlt = ref('')
const editTroubleshooting = ref('')
const editCollaborationSiteName = ref('')
const editCollaborationSiteUrl = ref('')
const editCollaborationLinks = ref<CollaborationLink[]>([])
const activeEditorPanel = ref<'troubleshooting' | 'settings' | null>(null)
const troubleshootingMarkdownForView = computed(() => {
  const saved = selectedProject.value?.troubleshooting ?? ''
  const draft = editTroubleshooting.value

  if (saved.trim()) {
    return saved
  }

  if (draft.trim()) {
    return draft
  }

  return ''
})
const renderedTroubleshooting = computed(() =>
  troubleshootingMarkdownForView.value ? markdownToHtml(troubleshootingMarkdownForView.value) : '',
)

const resetEditor = () => {
  editTitle.value = ''
  editSummary.value = ''
  editImpact.value = ''
  editTeamRole.value = ''
  editImageSrc.value = ''
  editImageAlt.value = ''
  editTroubleshooting.value = ''
  editCollaborationSiteName.value = ''
  editCollaborationSiteUrl.value = ''
  editCollaborationLinks.value = []
}

const loadEditorFromProject = (project: AdminProjectRecord | null) => {
  if (!project) {
    resetEditor()
    return
  }

  editTitle.value = project.title
  editSummary.value = project.summary
  editImpact.value = project.impact
  editTeamRole.value = project.teamRole
  editImageSrc.value = project.imageSrc ?? ''
  editImageAlt.value = project.imageAlt ?? ''
  editTroubleshooting.value = project.troubleshooting
  editCollaborationSiteName.value = ''
  editCollaborationSiteUrl.value = ''
  editCollaborationLinks.value = project.collaborationLinks.map((link) => ({ ...link }))
}

const openProjectManagerFromCard = async (id: string) => {
  await router.push({ path: `${adminProjectPath.value}/${encodeURIComponent(id)}` })
}

const openProjectEditorFromCard = async (id: string) => {
  await router.push({
    path: `${adminProjectPath.value}/${encodeURIComponent(id)}`,
    query: { panel: 'settings' },
  })
  activeEditorPanel.value = 'settings'
}

const deleteProjectFromCard = async (id: string) => {
  const target = projects.value.find((project) => project.id === id)

  if (!target) {
    return
  }

  if (typeof window !== 'undefined') {
    const confirmed = window.confirm(`정말로 삭제하시겠습니까?\n프로젝트: ${target.title}`)

    if (!confirmed) {
      return
    }
  }

  projectStoreByLocale.value = {
    ...projectStoreByLocale.value,
    [locale.value]: projects.value.filter((project) => project.id !== id),
  }

  if (routeProjectId.value === id) {
    await router.push(adminProjectPath.value)
  }
}

const createNewProject = () => {
  const newId = `project-${Date.now()}-${locale.value}`
  const newProject: AdminProjectRecord = {
    id: newId,
    title: '새 프로젝트',
    summary: '프로젝트 요약을 입력하세요.',
    impact: '프로젝트 성과를 입력하세요.',
    teamRole: '',
    stack: [],
    imageSrc: '',
    imageAlt: '',
    troubleshooting: '',
    collaborationLinks: [],
  }

  projectStoreByLocale.value = {
    ...projectStoreByLocale.value,
    [locale.value]: [newProject, ...projects.value],
  }

  void openProjectManagerFromCard(newId)
}

const addCollaborationLink = () => {
  const name = editCollaborationSiteName.value.trim()
  const url = editCollaborationSiteUrl.value.trim()

  if (!name || !url) {
    if (typeof window !== 'undefined') {
      window.alert('사이트 이름과 주소를 모두 입력해주세요.')
    }
    return
  }

  try {
    const parsed = new URL(url)

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new Error('Invalid protocol')
    }
  } catch {
    if (typeof window !== 'undefined') {
      window.alert('유효한 URL을 입력해주세요. (http/https)')
    }
    return
  }

  editCollaborationLinks.value = [...editCollaborationLinks.value, { name, url }]
  editCollaborationSiteName.value = ''
  editCollaborationSiteUrl.value = ''
}

const removeCollaborationLink = (index: number) => {
  editCollaborationLinks.value = editCollaborationLinks.value.filter((_, currentIndex) => currentIndex !== index)
}

const saveSelectedProject = () => {
  const id = selectedProjectId.value

  if (!id) {
    return
  }

  const title = editTitle.value.trim()
  const summary = editSummary.value.trim()
  const impact = editImpact.value.trim()

  if (!title || !summary || !impact) {
    if (typeof window !== 'undefined') {
      window.alert('제목, 요약, 임팩트는 필수입니다.')
    }

    return
  }

  const updated: AdminProjectRecord = {
    id,
    title,
    summary,
    impact,
    teamRole: editTeamRole.value.trim(),
    stack: selectedProject.value?.stack ?? [],
    imageSrc: editImageSrc.value.trim() || undefined,
    imageAlt: editImageAlt.value.trim() || undefined,
    troubleshooting: editTroubleshooting.value.trim(),
    collaborationLinks: editCollaborationLinks.value.map((link) => ({ ...link })),
  }

  const currentProjects = projectStoreByLocale.value[locale.value]
  const targetIndex = currentProjects.findIndex((project) => project.id === id)

  if (targetIndex === -1) {
    return
  }

  const nextProjects = [...currentProjects]
  nextProjects[targetIndex] = updated

  projectStoreByLocale.value = {
    ...projectStoreByLocale.value,
    [locale.value]: nextProjects,
  }

  if (typeof window !== 'undefined') {
    window.alert('프로젝트 정보가 저장되었습니다.')
  }
}

const handleSelectProjectImage = (event: Event) => {
  const input = event.target as HTMLInputElement | null
  const file = input?.files?.[0]

  if (!file) {
    return
  }

  if (!file.type.startsWith('image/')) {
    if (typeof window !== 'undefined') {
      window.alert('이미지 파일만 선택할 수 있습니다.')
    }
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    const result = typeof reader.result === 'string' ? reader.result : ''

    if (!result) {
      return
    }

    editImageSrc.value = result

    if (!editImageAlt.value.trim()) {
      editImageAlt.value = file.name.replace(/\.[^.]+$/, '')
    }
  }
  reader.readAsDataURL(file)
}

watch(
  [() => locale.value, routeProjectId, () => projects.value.map((project) => project.id).join('|')],
  () => {
    const routeId = routeProjectId.value
    const matchedProject = routeId ? projects.value.find((project) => project.id === routeId) : null

    selectedProjectIdByLocale.value = {
      ...selectedProjectIdByLocale.value,
      [locale.value]: matchedProject?.id ?? null,
    }
  },
  { immediate: true },
)

watch(
  () => selectedProject.value,
  (project) => {
    loadEditorFromProject(project)
    activeEditorPanel.value = project ? routeEditorPanel.value : null
  },
  { immediate: true },
)

watch(
  () => routeEditorPanel.value,
  (panel) => {
    if (!selectedProject.value) {
      return
    }

    activeEditorPanel.value = panel
  },
)
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

      <div class="space-y-5">
        <section class="rounded-[1.6rem] border border-[#243654] bg-[#0a0f17d9] p-5 sm:p-7">
          <p class="text-[11px] uppercase tracking-[0.12em] text-blue-300">ADMIN / PROJECTS</p>
          <h1 class="mt-2 text-2xl font-semibold text-zinc-100 sm:text-3xl">프로젝트 관리</h1>
          <p class="mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">
            프로젝트 카드를 선택해서 트러블슈팅 글, 제목/요약/성과, 이미지, 협업 URL을 수정하거나 추가합니다.
          </p>

          <div class="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              class="inline-flex items-center rounded-lg border border-blue-500 bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:border-blue-400 hover:bg-blue-500"
              @click="createNewProject"
            >
              새 프로젝트 생성
            </button>
            <RouterLink
              :to="adminPath"
              class="inline-flex items-center rounded-lg border border-[#243654] px-3 py-1.5 text-xs text-zinc-200 transition hover:border-[#5f8cff] hover:bg-[#101a2c] hover:text-white"
            >
              관리자 메인
            </RouterLink>
            <RouterLink
              :to="basePath"
              class="inline-flex items-center rounded-lg border border-[#243654] px-3 py-1.5 text-xs text-zinc-200 transition hover:border-[#5f8cff] hover:bg-[#101a2c] hover:text-white"
            >
              메인으로
            </RouterLink>
          </div>
        </section>

        <section class="rounded-[1.2rem] border border-[#2a2a2a] bg-[#121212dd] p-4 sm:p-5">
          <p class="text-xs uppercase tracking-[0.08em] text-zinc-500">현재 프로젝트 수</p>
          <p class="mt-2 text-2xl font-semibold text-zinc-100">{{ projects.length }}</p>
          <p class="mt-1 text-xs text-zinc-400">카드를 선택하면 해당 프로젝트 관리 URL로 이동합니다.</p>
        </section>

        <section class="rounded-[1.2rem] border border-[#2a2a2a] bg-[#121212dd] p-4 sm:p-5">
          <h2 class="text-base font-semibold text-zinc-100 sm:text-lg">프로젝트 선택</h2>
          <p class="mt-1 text-xs text-zinc-500">사진과 요약을 보고 프로젝트를 선택하세요.</p>

          <div class="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <article
              v-for="project in projects"
              :key="project.id"
              role="button"
              tabindex="0"
              class="group cursor-pointer rounded-xl border bg-[#111111] p-4 transition focus:outline-none"
              :class="
                selectedProjectId === project.id
                  ? 'border-[#5f8cff] bg-[#14223a]'
                  : 'border-[#2d2d2d] hover:border-[#4f76c7] hover:bg-[#131c2a]'
              "
              @click="openProjectManagerFromCard(project.id)"
              @keydown.enter.prevent="openProjectManagerFromCard(project.id)"
              @keydown.space.prevent="openProjectManagerFromCard(project.id)"
            >
              <div v-if="project.imageSrc" class="mb-3 overflow-hidden rounded-lg border border-[#2f2f2f] bg-[#161616]">
                <img
                  :src="project.imageSrc"
                  :alt="project.imageAlt || `${project.title} 썸네일`"
                  class="h-24 w-full object-cover"
                  loading="lazy"
                />
              </div>
              <p v-else class="mb-3 rounded-lg border border-dashed border-[#2f2f2f] bg-[#141414] px-3 py-8 text-center text-xs text-zinc-500">
                이미지 없음
              </p>

              <p class="text-sm font-semibold text-zinc-100">{{ project.title }}</p>
              <p class="mt-1 line-clamp-2 text-xs text-zinc-400">{{ project.summary }}</p>
              <p class="mt-2 text-xs text-zinc-300">{{ project.impact }}</p>

              <div class="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  class="rounded-md border border-[#243654] px-2.5 py-1 text-[11px] text-zinc-200 transition hover:border-[#5f8cff] hover:bg-[#101a2c] hover:text-white"
                  @click.stop="openProjectEditorFromCard(project.id)"
                >
                  수정
                </button>
                <button
                  type="button"
                  class="rounded-md border border-[#7e3d3d] bg-[#2a1414] px-2.5 py-1 text-[11px] text-rose-300 transition hover:border-[#a34a4a] hover:bg-[#341818] hover:text-rose-200"
                  @click.stop="deleteProjectFromCard(project.id)"
                >
                  삭제
                </button>
              </div>
            </article>
          </div>
        </section>

        <section
          v-if="selectedProject"
          class="rounded-[1.2rem] border border-[#2a2a2a] bg-[#121212dd] p-4 sm:p-5"
        >
          <h2 class="text-base font-semibold text-zinc-100 sm:text-lg">선택 프로젝트 상세 편집</h2>
          <p class="mt-1 text-xs text-zinc-500">기본은 조회 화면이며, 버튼을 눌러 편집 모드로 전환합니다.</p>

          <div class="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              class="inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-medium transition"
              :class="
                activeEditorPanel === null
                  ? 'border-blue-500 bg-blue-600 text-white'
                  : 'border-[#243654] text-zinc-200 hover:border-[#5f8cff] hover:bg-[#101a2c] hover:text-white'
              "
              @click="activeEditorPanel = null"
            >
              전체 보기
            </button>
            <button
              type="button"
              class="inline-flex items-center rounded-md border border-blue-500 bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:border-blue-400 hover:bg-blue-500"
              @click="activeEditorPanel = 'troubleshooting'"
            >
              트러블슈팅 작성하기
            </button>
            <button
              type="button"
              class="inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-medium transition"
              :class="
                activeEditorPanel === 'settings'
                  ? 'border-blue-500 bg-blue-600 text-white'
                  : 'border-[#243654] text-zinc-200 hover:border-[#5f8cff] hover:bg-[#101a2c] hover:text-white'
              "
              @click="activeEditorPanel = 'settings'"
            >
              프로젝트 설정
            </button>
          </div>

          <div v-if="activeEditorPanel === null" class="mt-4 space-y-4">
            <article class="rounded-xl border border-[#2f2f2f] bg-[#111111] p-4">
              <h3 class="text-sm font-semibold text-zinc-100">프로젝트 정보</h3>
              <p class="mt-3 text-xs text-zinc-500">제목</p>
              <p class="mt-1 text-sm text-zinc-100">{{ selectedProject.title }}</p>
              <p class="mt-3 text-xs text-zinc-500">요약</p>
              <p class="mt-1 text-sm text-zinc-300">{{ selectedProject.summary }}</p>
              <p class="mt-3 text-xs text-zinc-500">성과</p>
              <p class="mt-1 text-sm text-zinc-300">{{ selectedProject.impact }}</p>
              <p class="mt-3 text-xs text-zinc-500">팀에서 역할</p>
              <p class="mt-1 text-sm text-zinc-300">{{ selectedProject.teamRole || '미입력' }}</p>

              <div v-if="selectedProject.collaborationLinks.length > 0" class="mt-4 flex flex-wrap gap-2">
                <a
                  v-for="(link, linkIndex) in selectedProject.collaborationLinks"
                  :key="`read-link-${link.name}-${link.url}-${linkIndex}`"
                  :href="link.url"
                  target="_blank"
                  rel="noreferrer"
                  class="inline-flex items-center rounded-md border border-[#243654] px-3 py-1.5 text-xs text-zinc-200 transition hover:border-[#5f8cff] hover:bg-[#101a2c] hover:text-white"
                >
                  {{ link.name }} 열기
                </a>
              </div>
            </article>

            <article class="rounded-xl border border-[#2f2f2f] bg-[#111111] p-4">
              <h3 class="text-sm font-semibold text-zinc-100">트러블슈팅 전체 보기</h3>
              <div
                v-if="renderedTroubleshooting"
                class="markdown-body mt-3 text-sm leading-7 text-zinc-200"
                v-html="renderedTroubleshooting"
              ></div>
              <p v-else class="mt-3 text-xs text-zinc-500">아직 작성된 트러블슈팅 글이 없습니다.</p>
            </article>
          </div>

          <div
            v-else-if="activeEditorPanel === 'settings'"
            class="mt-4 rounded-2xl border border-[#2f2f2f] bg-[#0f0f10] p-4 sm:p-5"
          >
            <header
              class="flex flex-col gap-2 border-b border-[#272727] pb-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p class="text-[11px] uppercase tracking-[0.08em] text-zinc-500">프로젝트 설정</p>
                <h3 class="mt-1 text-lg font-semibold text-zinc-100">프로젝트 설정</h3>
                <p class="mt-1 text-xs text-zinc-400">일반 설정 페이지처럼 항목별로 나눠서 수정할 수 있습니다.</p>
              </div>
              <button
                type="button"
                class="inline-flex w-fit items-center rounded-md border border-blue-500 bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:border-blue-400 hover:bg-blue-500"
                @click="saveSelectedProject"
              >
                변경사항 저장
              </button>
            </header>

            <div class="mt-4 grid gap-4 xl:grid-cols-[210px_minmax(0,1fr)]">
              <aside class="rounded-xl border border-[#262626] bg-[#141414] p-3">
                <p class="text-[11px] uppercase tracking-[0.08em] text-zinc-500">설정 메뉴</p>
                <nav class="mt-2 space-y-1">
                  <a
                    href="#project-settings-basic"
                    class="block rounded-md border border-transparent px-2.5 py-1.5 text-xs text-zinc-300 transition hover:border-[#3a3731] hover:bg-[#1b1b1b] hover:text-white"
                  >
                    기본 정보
                  </a>
                  <a
                    href="#project-settings-role-impact"
                    class="block rounded-md border border-transparent px-2.5 py-1.5 text-xs text-zinc-300 transition hover:border-[#3a3731] hover:bg-[#1b1b1b] hover:text-white"
                  >
                    역할 / 성과
                  </a>
                  <a
                    href="#project-settings-links"
                    class="block rounded-md border border-transparent px-2.5 py-1.5 text-xs text-zinc-300 transition hover:border-[#3a3731] hover:bg-[#1b1b1b] hover:text-white"
                  >
                    협업 URL
                  </a>
                  <a
                    href="#project-settings-media"
                    class="block rounded-md border border-transparent px-2.5 py-1.5 text-xs text-zinc-300 transition hover:border-[#3a3731] hover:bg-[#1b1b1b] hover:text-white"
                  >
                    이미지
                  </a>
                </nav>
              </aside>

              <div class="space-y-4">
                <section id="project-settings-basic" class="rounded-xl border border-[#272727] bg-[#141415] p-4">
                  <h4 class="text-sm font-semibold text-zinc-100">기본 정보</h4>
                  <p class="mt-1 text-xs text-zinc-500">프로젝트를 대표하는 핵심 정보를 입력합니다.</p>
                  <div class="mt-3 grid gap-3 md:grid-cols-2">
                    <label class="space-y-1 text-xs text-zinc-400">
                      <span>제목 *</span>
                      <input
                        v-model="editTitle"
                        type="text"
                        class="w-full rounded-lg border border-[#2f2f2f] bg-[#171717] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-[#5a5a5a] focus:outline-none"
                        placeholder="프로젝트 제목"
                      />
                    </label>
                    <label class="space-y-1 text-xs text-zinc-400">
                      <span>요약 *</span>
                      <input
                        v-model="editSummary"
                        type="text"
                        class="w-full rounded-lg border border-[#2f2f2f] bg-[#171717] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-[#5a5a5a] focus:outline-none"
                        placeholder="프로젝트 요약"
                      />
                    </label>
                  </div>
                </section>

                <section
                  id="project-settings-role-impact"
                  class="rounded-xl border border-[#272727] bg-[#141415] p-4"
                >
                  <h4 class="text-sm font-semibold text-zinc-100">역할 / 성과</h4>
                  <p class="mt-1 text-xs text-zinc-500">팀 내 역할과 임팩트를 입력합니다.</p>
                  <div class="mt-3 grid gap-3">
                    <label class="space-y-1 text-xs text-zinc-400">
                      <span>임팩트 *</span>
                      <input
                        v-model="editImpact"
                        type="text"
                        class="w-full rounded-lg border border-[#2f2f2f] bg-[#171717] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-[#5a5a5a] focus:outline-none"
                        placeholder="성과/지표"
                      />
                    </label>
                    <label class="space-y-1 text-xs text-zinc-400">
                      <span>팀에서 역할</span>
                      <input
                        v-model="editTeamRole"
                        type="text"
                        class="w-full rounded-lg border border-[#2f2f2f] bg-[#171717] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-[#5a5a5a] focus:outline-none"
                        placeholder="예: 백엔드 리드, 프론트엔드 개발, PM"
                      />
                    </label>
                  </div>
                </section>

                <section id="project-settings-links" class="rounded-xl border border-[#272727] bg-[#141415] p-4">
                  <h4 class="text-sm font-semibold text-zinc-100">협업 URL</h4>
                  <p class="mt-1 text-xs text-zinc-500">협업 도구 링크를 사이트 이름과 함께 관리합니다.</p>
                  <div class="mt-3 grid gap-2">
                    <input
                      v-model="editCollaborationSiteName"
                      type="text"
                      class="w-full rounded-lg border border-[#2f2f2f] bg-[#171717] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-[#5a5a5a] focus:outline-none"
                      placeholder="사이트 이름 (예: Github)"
                    />
                    <input
                      v-model="editCollaborationSiteUrl"
                      type="url"
                      class="w-full rounded-lg border border-[#2f2f2f] bg-[#171717] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-[#5a5a5a] focus:outline-none"
                      placeholder="사이트 주소 (https://...)"
                    />
                    <button
                      type="button"
                      class="inline-flex w-fit items-center rounded-md border border-blue-500 bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:border-blue-400 hover:bg-blue-500"
                      @click="addCollaborationLink"
                    >
                      협업 URL 추가
                    </button>
                  </div>

                  <div v-if="editCollaborationLinks.length > 0" class="mt-3 space-y-2">
                    <article
                      v-for="(link, linkIndex) in editCollaborationLinks"
                      :key="`${link.name}-${link.url}-${linkIndex}`"
                      class="rounded-lg border border-[#2f2f2f] bg-[#171717] px-3 py-2"
                    >
                      <p class="text-xs font-semibold text-zinc-200">{{ link.name }}</p>
                      <p class="mt-1 break-all text-[11px] text-zinc-400">{{ link.url }}</p>
                      <button
                        type="button"
                        class="mt-2 rounded-md border border-[#7e3d3d] bg-[#2a1414] px-2 py-1 text-[11px] text-rose-300 transition hover:border-[#a34a4a] hover:bg-[#341818] hover:text-rose-200"
                        @click="removeCollaborationLink(linkIndex)"
                      >
                        삭제
                      </button>
                    </article>
                  </div>
                  <p v-else class="mt-2 text-[11px] text-zinc-500">저장된 협업 URL이 없습니다.</p>
                </section>

                <section id="project-settings-media" class="rounded-xl border border-[#272727] bg-[#141415] p-4">
                  <h4 class="text-sm font-semibold text-zinc-100">이미지</h4>
                  <p class="mt-1 text-xs text-zinc-500">프로젝트 대표 이미지를 업로드합니다.</p>
                  <div class="mt-3 space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      class="block w-full rounded-lg border border-[#2f2f2f] bg-[#171717] px-3 py-2 text-sm text-zinc-200 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-700 file:px-2 file:py-1 file:text-xs file:text-zinc-100"
                      @change="handleSelectProjectImage"
                    />
                    <p class="text-[11px] text-zinc-500">로컬 이미지 파일을 선택하면 즉시 미리보기에 반영됩니다.</p>
                  </div>
                </section>
              </div>
            </div>
          </div>

          <div v-else class="mt-4 space-y-1">
            <span class="text-xs text-zinc-400">트러블슈팅 글 쓰기</span>
            <MarkdownLiveEditor
              v-model="editTroubleshooting"
              placeholder="프로젝트 트러블슈팅 내용을 작성하세요."
            />
          </div>

          <div
            v-if="editImageSrc"
            class="mt-4 w-full max-w-md overflow-hidden rounded-lg border border-[#2f2f2f] bg-[#161616]"
          >
            <img
              :src="editImageSrc"
              :alt="editImageAlt || `${editTitle || '프로젝트'} 이미지`"
              class="h-36 w-full object-cover"
            />
          </div>

          <div class="mt-4 flex flex-wrap gap-2">
            <button
              v-if="activeEditorPanel !== 'settings'"
              type="button"
              class="inline-flex items-center rounded-md border border-blue-500 bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:border-blue-400 hover:bg-blue-500"
              @click="saveSelectedProject"
            >
              프로젝트 저장
            </button>
            <a
              v-for="(link, linkIndex) in selectedProject.collaborationLinks"
              :key="`open-link-${link.name}-${link.url}-${linkIndex}`"
              :href="link.url"
              target="_blank"
              rel="noreferrer"
              class="inline-flex items-center rounded-md border border-[#243654] px-3 py-1.5 text-xs text-zinc-200 transition hover:border-[#5f8cff] hover:bg-[#101a2c] hover:text-white"
            >
              {{ link.name }} 열기
            </a>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4),
.markdown-body :deep(h5),
.markdown-body :deep(h6) {
  margin: 1.2rem 0 0.6rem;
  color: #f4f4f5;
  line-height: 1.35;
}

.markdown-body :deep(p) {
  margin: 0 0 0.95rem;
  color: #e4e4e7;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin: 0 0 1rem;
  padding-left: 1.25rem;
}

.markdown-body :deep(li) {
  margin: 0.35rem 0;
}
</style>
