import { computed, nextTick, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { worksByLocale } from '@/entities/project'
import type { WorkItem } from '@/entities/portfolio'
import { useLocale } from '@/shared/lib/routing'
import type { ProjectArchiveCopy, ProjectToneStyle } from '@/entities/project'

type ProjectTone = {
  accent: string
  accentSoft: string
  accentFaint: string
  surface: string
  glow: string
}

const normalizeProjectKey = (value: string) => value.trim().toLocaleLowerCase().replace(/\s+/g, '')

const normalizeExternalLinkToken = (value: string) => value.toLocaleLowerCase().trim()

const defaultProjectTone: ProjectTone = {
  accent: '#6f8fce',
  accentSoft: 'rgba(111, 143, 206, 0.22)',
  accentFaint: 'rgba(111, 143, 206, 0.12)',
  surface: '#151e2f',
  glow: 'rgba(111, 143, 206, 0.16)',
}

const projectToneMap: Record<string, ProjectTone> = {
  hlab: {
    accent: '#6f8fce',
    accentSoft: 'rgba(111, 143, 206, 0.22)',
    accentFaint: 'rgba(111, 143, 206, 0.12)',
    surface: '#151e2f',
    glow: 'rgba(111, 143, 206, 0.16)',
  },
  clue: {
    accent: '#8098d2',
    accentSoft: 'rgba(128, 152, 210, 0.2)',
    accentFaint: 'rgba(128, 152, 210, 0.11)',
    surface: '#172033',
    glow: 'rgba(128, 152, 210, 0.14)',
  },
  sizz: {
    accent: '#658dbe',
    accentSoft: 'rgba(101, 141, 190, 0.2)',
    accentFaint: 'rgba(101, 141, 190, 0.11)',
    surface: '#132131',
    glow: 'rgba(101, 141, 190, 0.14)',
  },
}

const resolveProjectTone = (projectTitle: string) =>
  projectToneMap[normalizeProjectKey(projectTitle)] ?? defaultProjectTone

export const useProjectArchivePage = () => {
  const { locale, route } = useLocale()
  const router = useRouter()

  const projects = computed(() => worksByLocale[locale.value])
  const selectedProjectIndex = ref(0)
  const detailTransitionNonce = ref(0)

  const routeProjectIndex = computed(() => {
    const raw = route.query.project
    const value = Array.isArray(raw) ? raw[0] : raw

    if (typeof value !== 'string') {
      return null
    }

    const parsed = Number.parseInt(value, 10)

    if (!Number.isFinite(parsed) || parsed < 0) {
      return null
    }

    return parsed
  })

  const selectedProject = computed<WorkItem | null>(() => {
    const index = selectedProjectIndex.value

    if (index < 0 || index >= projects.value.length) {
      return null
    }

    return projects.value[index] ?? null
  })

  const getProjectToneStyle = (projectTitle: string): ProjectToneStyle => {
    const tone = resolveProjectTone(projectTitle)

    return {
      '--project-accent': tone.accent,
      '--project-accent-soft': tone.accentSoft,
      '--project-accent-faint': tone.accentFaint,
      '--project-surface': tone.surface,
      '--project-glow': tone.glow,
    }
  }

  const selectedProjectToneStyle = computed(() =>
    selectedProject.value ? getProjectToneStyle(selectedProject.value.title) : undefined,
  )

  const resolveExternalLinkBadge = (name: string, url: string) => {
    const normalizedName = normalizeExternalLinkToken(name)
    const normalizedUrl = normalizeExternalLinkToken(url)

    if (normalizedName.includes('notion') || normalizedUrl.includes('notion.so')) {
      return 'NOTION'
    }

    if (
      normalizedName.includes('git') ||
      normalizedName.includes('github') ||
      normalizedUrl.includes('github.com')
    ) {
      return 'GIT'
    }

    return 'LINK'
  }

  const copy = computed<ProjectArchiveCopy>(() =>
    locale.value === 'en'
      ? {
          kicker: 'PROJECT ARCHIVE',
          heading: 'Projects Curated as an Archive',
          lead: 'Browse the project list, then inspect the selected work with collaboration notes and stack details.',
          countLabel: 'Projects',
          currentLabel: 'Now Viewing',
          listHeading: 'Project Index',
          listLead: 'Choose a project from the left rail. The detail panel updates immediately.',
          detailHeading: 'Selected Project',
          detailLead:
            'A compact overview focused on outcome, stack, and the collaboration references connected to the work.',
          selectedLabel: 'Selected',
          summaryLabel: 'Overview',
          impactLabel: 'Outcome',
          stackLabel: 'Stack',
          linksHeading: 'Collaboration Links',
          linksLead: 'References that were used during planning, development, or delivery.',
          linksEmpty: 'No collaboration links are registered for this project yet.',
        }
      : {
          kicker: 'PROJECT ARCHIVE',
          heading: '프로젝트 아카이브',
          lead: '',
          countLabel: '프로젝트 수',
          currentLabel: '현재 선택',
          listHeading: '프로젝트 목록',
          listLead: '',
          detailHeading: '선택한 프로젝트',
          detailLead:
            '프로젝트의 핵심 설명, 성과, 기술 스택, 그리고 협업에 사용한 참고 링크를 한 흐름으로 정리했습니다.',
          selectedLabel: '선택됨',
          summaryLabel: '프로젝트 개요',
          impactLabel: '핵심 성과',
          stackLabel: '사용 기술',
          linksHeading: '협업 링크',
          linksLead: '기획, 개발, 운영 과정에서 사용한 참고 링크입니다.',
          linksEmpty: '이 프로젝트에는 아직 등록된 협업 링크가 없습니다.',
        },
  )

  const buildProjectDetailLocation = (index: number) => ({
    path: route.path,
    query: {
      ...route.query,
      project: String(index),
    },
    hash: '#project-detail',
  })

  const selectProject = async (index: number) => {
    if (index < 0 || index >= projects.value.length) {
      return
    }

    const changed = selectedProjectIndex.value !== index
    selectedProjectIndex.value = index

    const queryProject = Array.isArray(route.query.project)
      ? route.query.project[0]
      : route.query.project
    const normalizedQueryProject = typeof queryProject === 'string' ? queryProject : null

    if (normalizedQueryProject !== String(index) || route.hash !== '#project-detail') {
      await router.replace(buildProjectDetailLocation(index))
    }

    if (changed) {
      detailTransitionNonce.value += 1
    }

    if (typeof window !== 'undefined' && window.innerWidth < 1280) {
      await nextTick()
      document.getElementById('project-detail')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  watch(
    [routeProjectIndex, projects],
    ([routeIndex, currentProjects]) => {
      if (currentProjects.length === 0) {
        selectedProjectIndex.value = 0
        return
      }

      if (routeIndex === null) {
        if (selectedProjectIndex.value >= currentProjects.length) {
          selectedProjectIndex.value = 0
        }
        return
      }

      selectedProjectIndex.value = Math.min(routeIndex, currentProjects.length - 1)
    },
    { immediate: true },
  )

  return {
    copy,
    projects,
    selectedProjectIndex,
    detailTransitionNonce,
    selectedProject,
    selectedProjectToneStyle,
    getProjectToneStyle,
    resolveExternalLinkBadge,
    selectProject,
  }
}
