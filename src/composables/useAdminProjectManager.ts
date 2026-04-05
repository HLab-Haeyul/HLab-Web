import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { worksByLocale } from '@/data/portfolio/works'
import type { Locale, WorkItem } from '@/data/portfolio/types'
import { useLocale } from '@/composables/useLocale'
import { markdownToHtml } from '@/utils/markdown'
import type {
  AdminProjectEditorDraft,
  AdminProjectEditorPanel,
  AdminProjectRecord,
} from '@/types/adminProject'

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

const createEmptyDraft = (): AdminProjectEditorDraft => ({
  title: '',
  summary: '',
  impact: '',
  teamRole: '',
  imageSrc: '',
  imageAlt: '',
  troubleshooting: '',
  collaborationSiteName: '',
  collaborationSiteUrl: '',
  collaborationLinks: [],
})

const decodeRouteParam = (value: unknown) => {
  const candidate = Array.isArray(value) ? value[0] : value

  if (typeof candidate !== 'string') {
    return null
  }

  const trimmed = candidate.trim()

  if (!trimmed) {
    return null
  }

  try {
    return decodeURIComponent(trimmed)
  } catch {
    return trimmed
  }
}

export const useAdminProjectManager = () => {
  const { locale, route, basePath, adminPath, adminProjectPath } = useLocale()
  const router = useRouter()

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

  const routeProjectId = computed(() => decodeRouteParam(route.params.id))
  const routeEditorPanel = computed<AdminProjectEditorPanel>(() => {
    const raw = route.query.panel
    const value = Array.isArray(raw) ? raw[0] : raw

    if (value === 'settings' || value === 'troubleshooting') {
      return value
    }

    return null
  })

  const activeEditorPanel = ref<AdminProjectEditorPanel>(null)
  const editorDraft = reactive<AdminProjectEditorDraft>(createEmptyDraft())

  const troubleshootingMarkdownForView = computed(() => {
    const saved = selectedProject.value?.troubleshooting ?? ''
    const draft = editorDraft.troubleshooting

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
    const next = createEmptyDraft()
    Object.assign(editorDraft, next)
  }

  const loadEditorFromProject = (project: AdminProjectRecord | null) => {
    if (!project) {
      resetEditor()
      return
    }

    Object.assign(editorDraft, {
      title: project.title,
      summary: project.summary,
      impact: project.impact,
      teamRole: project.teamRole,
      imageSrc: project.imageSrc ?? '',
      imageAlt: project.imageAlt ?? '',
      troubleshooting: project.troubleshooting,
      collaborationSiteName: '',
      collaborationSiteUrl: '',
      collaborationLinks: project.collaborationLinks.map((link) => ({ ...link })),
    })
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

  const createNewProject = async () => {
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

    await openProjectManagerFromCard(newId)
  }

  const addCollaborationLink = () => {
    const name = editorDraft.collaborationSiteName.trim()
    const url = editorDraft.collaborationSiteUrl.trim()

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

    editorDraft.collaborationLinks = [...editorDraft.collaborationLinks, { name, url }]
    editorDraft.collaborationSiteName = ''
    editorDraft.collaborationSiteUrl = ''
  }

  const removeCollaborationLink = (index: number) => {
    editorDraft.collaborationLinks = editorDraft.collaborationLinks.filter(
      (_, currentIndex) => currentIndex !== index,
    )
  }

  const saveSelectedProject = () => {
    const id = selectedProjectId.value

    if (!id) {
      return
    }

    const title = editorDraft.title.trim()
    const summary = editorDraft.summary.trim()
    const impact = editorDraft.impact.trim()

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
      teamRole: editorDraft.teamRole.trim(),
      stack: selectedProject.value?.stack ?? [],
      imageSrc: editorDraft.imageSrc.trim() || undefined,
      imageAlt: editorDraft.imageAlt.trim() || undefined,
      troubleshooting: editorDraft.troubleshooting.trim(),
      collaborationLinks: editorDraft.collaborationLinks.map((link) => ({ ...link })),
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

      editorDraft.imageSrc = result

      if (!editorDraft.imageAlt.trim()) {
        editorDraft.imageAlt = file.name.replace(/\.[^.]+$/, '')
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

  return {
    basePath,
    adminPath,
    projects,
    selectedProjectId,
    selectedProject,
    editorDraft,
    activeEditorPanel,
    renderedTroubleshooting,
    createNewProject,
    openProjectManagerFromCard,
    openProjectEditorFromCard,
    deleteProjectFromCard,
    addCollaborationLink,
    removeCollaborationLink,
    saveSelectedProject,
    handleSelectProjectImage,
  }
}
