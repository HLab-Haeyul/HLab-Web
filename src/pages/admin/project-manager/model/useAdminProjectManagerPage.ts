import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { worksByLocale } from '@/entities/project'
import type { Locale, WorkItem } from '@/entities/portfolio'
import { useLocale } from '@/shared/lib/routing'
import { markdownToHtml } from '@/shared/lib/markdown'

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

export const useAdminProjectManagerPage = () => {
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
    troubleshootingMarkdownForView.value
      ? markdownToHtml(troubleshootingMarkdownForView.value)
      : '',
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
    editCollaborationLinks.value = editCollaborationLinks.value.filter(
      (_, currentIndex) => currentIndex !== index,
    )
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

  return {
    basePath,
    adminPath,
    projects,
    selectedProjectId,
    selectedProject,
    editTitle,
    editSummary,
    editImpact,
    editTeamRole,
    editImageSrc,
    editImageAlt,
    editTroubleshooting,
    editCollaborationSiteName,
    editCollaborationSiteUrl,
    editCollaborationLinks,
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
