import { computed, onMounted, ref, watch, type Ref } from 'vue'
import { worksByLocale } from '@/entities/project'
import type { CareerTimelineItem, Locale } from '@/entities/portfolio'
import {
  fetchPortfolioMetrics,
  registerPortfolioVisit,
  type PortfolioMetricsSnapshot,
} from '@/features/portfolio/metrics'
import {
  calculateCareerExperienceMonths,
  formatCareerExperience,
} from '@/shared/lib/career-duration'

type UsePortfolioMetricsOptions = {
  locale: Ref<Locale>
  careerTimeline: Ref<CareerTimelineItem[]>
}

const PORTFOLIO_VISITOR_ID_STORAGE_KEY = 'hlab.portfolio.visitor.id.v1'

const formatMetricNumber = (locale: Locale, value: number) =>
  new Intl.NumberFormat(locale === 'ko' ? 'ko-KR' : 'en-US').format(value)

const resolveVisitorId = () => {
  if (typeof window === 'undefined') {
    return 'server-render'
  }

  const stored = window.localStorage.getItem(PORTFOLIO_VISITOR_ID_STORAGE_KEY)?.trim()

  if (stored) {
    return stored
  }

  const nextId =
    typeof window.crypto?.randomUUID === 'function'
      ? window.crypto.randomUUID()
      : `visitor-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

  window.localStorage.setItem(PORTFOLIO_VISITOR_ID_STORAGE_KEY, nextId)
  return nextId
}

export const usePortfolioMetrics = ({ locale, careerTimeline }: UsePortfolioMetricsOptions) => {
  const snapshot = ref<PortfolioMetricsSnapshot | null>(null)
  const isLoading = ref(false)
  const errorMessage = ref('')

  const fallbackProjectCount = computed(() => worksByLocale[locale.value].length)
  const fallbackExperienceMonths = computed(() =>
    calculateCareerExperienceMonths(careerTimeline.value),
  )

  const syncSnapshot = async (registerVisit: boolean) => {
    isLoading.value = true
    errorMessage.value = ''

    try {
      const nextSnapshot = registerVisit
        ? await registerPortfolioVisit(locale.value, resolveVisitorId())
        : await fetchPortfolioMetrics(locale.value)

      snapshot.value = nextSnapshot
    } catch (error) {
      const fallbackMessage =
        locale.value === 'en'
          ? 'Failed to load portfolio metrics from the API.'
          : '포트폴리오 지표를 API에서 불러오지 못했습니다.'

      errorMessage.value = error instanceof Error ? error.message : fallbackMessage

      if (!registerVisit) {
        snapshot.value = null
      } else {
        try {
          snapshot.value = await fetchPortfolioMetrics(locale.value)
        } catch {
          snapshot.value = null
        }
      }
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    void syncSnapshot(true)
  })

  watch(
    () => locale.value,
    () => {
      void syncSnapshot(false)
    },
  )

  const metricDisplayValues = computed(() => {
    const projectCount = snapshot.value?.projectCount ?? fallbackProjectCount.value
    const visitorCount = snapshot.value?.visitorCount ?? 0
    const experienceMonths = snapshot.value?.experienceMonths ?? fallbackExperienceMonths.value

    return [
      formatMetricNumber(locale.value, projectCount),
      formatMetricNumber(locale.value, visitorCount),
      formatCareerExperience(locale.value, experienceMonths),
    ]
  })

  return {
    metricsSnapshot: snapshot,
    metricDisplayValues,
    isLoading,
    errorMessage,
    reload: () => syncSnapshot(false),
  }
}
