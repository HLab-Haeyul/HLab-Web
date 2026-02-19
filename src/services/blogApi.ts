import {
  BLOG_CATEGORY_KEYS,
  type BlogPageCopySet,
  type BlogPost,
  type BlogPostDetail,
} from '../data/blog/content'
import type { Locale } from '../data/portfolio/types'

type FetchBlogOptions = {
  signal?: AbortSignal
}

const DEFAULT_API_PATH = '/api/blog'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string')

const isBlogCategoryKey = (value: unknown): value is (typeof BLOG_CATEGORY_KEYS)[number] =>
  typeof value === 'string' && BLOG_CATEGORY_KEYS.some((key) => key === value)

const hasAllCategoryKeys = (value: unknown) => {
  if (!isRecord(value)) {
    return false
  }

  return BLOG_CATEGORY_KEYS.every((key) => {
    const category = value[key]

    return (
      isRecord(category) &&
      typeof category.title === 'string' &&
      typeof category.description === 'string'
    )
  })
}

const isBlogPost = (value: unknown): value is BlogPost => {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.slug === 'string' &&
    typeof value.title === 'string' &&
    typeof value.excerpt === 'string' &&
    typeof value.publishedAt === 'string' &&
    typeof value.readTime === 'string' &&
    isStringArray(value.tags) &&
    isBlogCategoryKey(value.category)
  )
}

const isPopularPost = (value: unknown) => {
  if (!isBlogPost(value) || !isRecord(value)) {
    return false
  }

  const candidate = value as Record<string, unknown>

  return (
    typeof candidate.heroTag === 'string' &&
    typeof candidate.highlight === 'string' &&
    typeof candidate.bannerBackground === 'string'
  )
}

const isBlogPostDetail = (value: unknown): value is BlogPostDetail => {
  if (!isBlogPost(value) || !isRecord(value)) {
    return false
  }

  const candidate = value as Record<string, unknown>

  return (
    typeof candidate.heroTag === 'string' &&
    typeof candidate.authorName === 'string' &&
    isStringArray(candidate.content)
  )
}

const isBlogPageCopySet = (value: unknown): value is BlogPageCopySet => {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.kicker === 'string' &&
    typeof value.heading === 'string' &&
    typeof value.description === 'string' &&
    typeof value.popularKicker === 'string' &&
    typeof value.popularHeading === 'string' &&
    typeof value.popularDescription === 'string' &&
    typeof value.readLabel === 'string' &&
    hasAllCategoryKeys(value.categories) &&
    Array.isArray(value.popularPosts) &&
    value.popularPosts.every((post) => isPopularPost(post)) &&
    Array.isArray(value.posts) &&
    value.posts.every((post) => isBlogPost(post))
  )
}

const resolveBlogListApiUrl = (locale: Locale) => {
  const absoluteUrl = (import.meta.env.VITE_BLOG_API_URL as string | undefined)?.trim()
  const baseUrl = (import.meta.env.VITE_BLOG_API_BASE_URL as string | undefined)?.trim()
  const apiPath = (import.meta.env.VITE_BLOG_API_PATH as string | undefined)?.trim() || DEFAULT_API_PATH
  const origin = globalThis.location?.origin ?? 'http://localhost'

  const url = absoluteUrl ? new URL(absoluteUrl) : new URL(apiPath, baseUrl || origin)
  url.searchParams.set('locale', locale)

  return url.toString()
}

const resolveBlogPostApiUrl = (locale: Locale, slug: string) => {
  const absoluteUrl = (import.meta.env.VITE_BLOG_API_URL as string | undefined)?.trim()
  const baseUrl = (import.meta.env.VITE_BLOG_API_BASE_URL as string | undefined)?.trim()
  const apiPath = (import.meta.env.VITE_BLOG_API_PATH as string | undefined)?.trim() || DEFAULT_API_PATH
  const origin = globalThis.location?.origin ?? 'http://localhost'

  const url = absoluteUrl ? new URL(absoluteUrl) : new URL(apiPath, baseUrl || origin)
  url.pathname = `${url.pathname.replace(/\/$/, '')}/${encodeURIComponent(slug)}`
  url.searchParams.set('locale', locale)

  return url.toString()
}

export const fetchBlogPageCopy = async (
  locale: Locale,
  options: FetchBlogOptions = {},
): Promise<BlogPageCopySet | null> => {
  const response = await fetch(resolveBlogListApiUrl(locale), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal: options.signal,
  })

  if (!response.ok) {
    return null
  }

  const payload = (await response.json()) as unknown
  const normalized = isRecord(payload) && 'data' in payload ? payload.data : payload

  if (!isBlogPageCopySet(normalized)) {
    return null
  }

  return normalized
}

export const fetchBlogPostDetail = async (
  locale: Locale,
  slug: string,
  options: FetchBlogOptions = {},
): Promise<BlogPostDetail | null> => {
  const response = await fetch(resolveBlogPostApiUrl(locale, slug), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal: options.signal,
  })

  if (!response.ok) {
    return null
  }

  const payload = (await response.json()) as unknown
  const normalized = isRecord(payload) && 'data' in payload ? payload.data : payload

  if (!isBlogPostDetail(normalized)) {
    return null
  }

  return normalized
}
