import type { Locale } from '@/entities/portfolio'
import { isPortfolioMetricsApiEnabled } from '@/shared/config/portfolioMetrics'

type FetchPortfolioMetricsOptions = {
  signal?: AbortSignal
}

export type PortfolioMetricsSnapshot = {
  projectCount: number
  visitorCount: number
  experienceMonths: number
  updatedAt: string
}

const DEFAULT_API_PATH = '/api/portfolio/metrics'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isPortfolioMetricsSnapshot = (value: unknown): value is PortfolioMetricsSnapshot => {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.projectCount === 'number' &&
    Number.isFinite(value.projectCount) &&
    typeof value.visitorCount === 'number' &&
    Number.isFinite(value.visitorCount) &&
    typeof value.experienceMonths === 'number' &&
    Number.isFinite(value.experienceMonths) &&
    typeof value.updatedAt === 'string'
  )
}

const resolvePortfolioMetricsApiUrl = (locale: Locale, suffix = '') => {
  const absoluteUrl = (import.meta.env.VITE_PORTFOLIO_METRICS_API_URL as string | undefined)?.trim()
  const baseUrl = (import.meta.env.VITE_PORTFOLIO_METRICS_API_BASE_URL as string | undefined)?.trim()
  const apiPath =
    (import.meta.env.VITE_PORTFOLIO_METRICS_API_PATH as string | undefined)?.trim() ||
    DEFAULT_API_PATH
  const origin = globalThis.location?.origin ?? 'http://localhost'

  const url = absoluteUrl ? new URL(absoluteUrl) : new URL(apiPath, baseUrl || origin)

  if (suffix) {
    url.pathname = `${url.pathname.replace(/\/$/, '')}/${suffix.replace(/^\//, '')}`
  }

  url.searchParams.set('locale', locale)

  return url.toString()
}

const normalizePortfolioMetricsSnapshot = (payload: unknown): PortfolioMetricsSnapshot | null => {
  const normalized = isRecord(payload) && 'data' in payload ? payload.data : payload

  if (!isPortfolioMetricsSnapshot(normalized)) {
    return null
  }

  return normalized
}

export const fetchPortfolioMetrics = async (
  locale: Locale,
  options: FetchPortfolioMetricsOptions = {},
) => {
  if (!isPortfolioMetricsApiEnabled()) {
    return null
  }

  const response = await fetch(resolvePortfolioMetricsApiUrl(locale), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal: options.signal,
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch portfolio metrics. (status: ${response.status})`)
  }

  const payload = (await response.json()) as unknown
  return normalizePortfolioMetricsSnapshot(payload)
}

export const registerPortfolioVisit = async (
  locale: Locale,
  visitorId: string,
  options: FetchPortfolioMetricsOptions = {},
) => {
  if (!isPortfolioMetricsApiEnabled()) {
    return null
  }

  const response = await fetch(resolvePortfolioMetricsApiUrl(locale, 'visit'), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      visitorId,
    }),
    signal: options.signal,
  })

  if (!response.ok) {
    throw new Error(`Failed to register portfolio visit. (status: ${response.status})`)
  }

  const payload = (await response.json()) as unknown
  return normalizePortfolioMetricsSnapshot(payload)
}
