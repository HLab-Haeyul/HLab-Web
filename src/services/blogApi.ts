import {
  BLOG_CATEGORY_KEYS,
  type BlogCategoryKey,
  type BlogCategoryCopy,
  type BlogPageCopySet,
  type BlogPost,
  type BlogPostDetail,
  type BlogPostImage,
  type BlogPostVideo,
} from '@/data/blog/types'
import type { Locale } from '@/data/portfolio/types'
import { isBlogApiEnabled } from '@/services/blogApiConfig'

type FetchBlogOptions = {
  signal?: AbortSignal
}

export type BlogPostCreateInput = {
  id?: string
  title: string
  excerpt: string
  publishedAt?: string
  readTime?: string
  tags: string[]
  category: BlogCategoryKey
  heroTag?: string
  authorName?: string
  markdown: string
  images?: BlogPostImage[]
  videos?: BlogPostVideo[]
}

export type BlogPostUpdateInput = Partial<Omit<BlogPostCreateInput, 'id'>>
export type BlogPostCreateApiResult = {
  status: number
  post: BlogPostDetail | null
}

export type BlogMainPagePatchInput = Partial<
  Pick<
    BlogPageCopySet,
    | 'kicker'
    | 'heading'
    | 'description'
    | 'popularKicker'
    | 'popularHeading'
    | 'popularDescription'
    | 'readLabel'
    | 'popularPosts'
    | 'posts'
  >
> & {
  categories?: Partial<Record<(typeof BLOG_CATEGORY_KEYS)[number], Partial<BlogCategoryCopy>>>
}

type BlogPostDetailPayload = Omit<BlogPostDetail, 'markdown' | 'images' | 'videos'> & {
  markdown?: string
  content?: string[]
  images?: BlogPostImage[]
  videos?: BlogPostVideo[]
}

const DEFAULT_API_PATH = '/api/blog'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string')

const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean'

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
    typeof value.id === 'string' &&
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

const isBlogPostImage = (value: unknown): value is BlogPostImage => {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.src === 'string' &&
    (typeof value.alt === 'undefined' || typeof value.alt === 'string') &&
    (typeof value.caption === 'undefined' || typeof value.caption === 'string')
  )
}

const isBlogPostVideo = (value: unknown): value is BlogPostVideo => {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.src === 'string' &&
    (typeof value.title === 'undefined' || typeof value.title === 'string') &&
    (typeof value.poster === 'undefined' || typeof value.poster === 'string') &&
    (typeof value.autoplay === 'undefined' || isBoolean(value.autoplay)) &&
    (typeof value.muted === 'undefined' || isBoolean(value.muted)) &&
    (typeof value.loop === 'undefined' || isBoolean(value.loop))
  )
}

const isBlogPostDetailPayload = (value: unknown): value is BlogPostDetailPayload => {
  if (!isBlogPost(value) || !isRecord(value)) {
    return false
  }

  const candidate = value as Record<string, unknown>

  return (
    typeof candidate.heroTag === 'string' &&
    typeof candidate.authorName === 'string' &&
    (typeof candidate.markdown === 'string' || isStringArray(candidate.content)) &&
    (typeof candidate.images === 'undefined' ||
      (Array.isArray(candidate.images) && candidate.images.every((item) => isBlogPostImage(item)))) &&
    (typeof candidate.videos === 'undefined' ||
      (Array.isArray(candidate.videos) && candidate.videos.every((item) => isBlogPostVideo(item))))
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

const resolveBlogPostApiUrl = (locale: Locale, id: string) => {
  const absoluteUrl = (import.meta.env.VITE_BLOG_API_URL as string | undefined)?.trim()
  const baseUrl = (import.meta.env.VITE_BLOG_API_BASE_URL as string | undefined)?.trim()
  const apiPath = (import.meta.env.VITE_BLOG_API_PATH as string | undefined)?.trim() || DEFAULT_API_PATH
  const origin = globalThis.location?.origin ?? 'http://localhost'

  const url = absoluteUrl ? new URL(absoluteUrl) : new URL(apiPath, baseUrl || origin)
  url.pathname = `${url.pathname.replace(/\/$/, '')}/${encodeURIComponent(id)}`
  url.searchParams.set('locale', locale)

  return url.toString()
}

const resolveBlogMainPageApiUrl = (locale: Locale) => {
  const absoluteUrl = (import.meta.env.VITE_BLOG_API_URL as string | undefined)?.trim()
  const baseUrl = (import.meta.env.VITE_BLOG_API_BASE_URL as string | undefined)?.trim()
  const apiPath = (import.meta.env.VITE_BLOG_API_PATH as string | undefined)?.trim() || DEFAULT_API_PATH
  const origin = globalThis.location?.origin ?? 'http://localhost'

  const url = absoluteUrl ? new URL(absoluteUrl) : new URL(apiPath, baseUrl || origin)
  url.pathname = `${url.pathname.replace(/\/$/, '')}/page-content`
  url.searchParams.set('locale', locale)

  return url.toString()
}

const normalizeBlogPostDetailPayload = (payload: unknown): BlogPostDetail | null => {
  const normalized = isRecord(payload) && 'data' in payload ? payload.data : payload

  if (!isBlogPostDetailPayload(normalized)) {
    return null
  }

  const images = Array.isArray(normalized.images) ? normalized.images : undefined
  const videos = Array.isArray(normalized.videos) ? normalized.videos : undefined

  if (typeof normalized.markdown === 'string') {
    return {
      ...normalized,
      markdown: normalized.markdown,
      images,
      videos,
    }
  }

  const legacyContent = isStringArray(normalized.content) ? normalized.content.join('\n\n') : ''

  return {
    ...normalized,
    markdown: legacyContent,
    images,
    videos,
  }
}

export const fetchBlogPageCopy = async (
  locale: Locale,
  options: FetchBlogOptions = {},
): Promise<BlogPageCopySet | null> => {
  if (!isBlogApiEnabled()) {
    return null
  }

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
  id: string,
  options: FetchBlogOptions = {},
): Promise<BlogPostDetail | null> => {
  if (!isBlogApiEnabled()) {
    return null
  }

  const response = await fetch(resolveBlogPostApiUrl(locale, id), {
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

  return normalizeBlogPostDetailPayload(payload)
}

export const updateBlogMainPageCopy = async (
  locale: Locale,
  input: BlogMainPagePatchInput,
  options: FetchBlogOptions = {},
): Promise<BlogPageCopySet | null> => {
  if (!isBlogApiEnabled()) {
    return null
  }

  const response = await fetch(resolveBlogMainPageApiUrl(locale), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(input),
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

export const createBlogPost = async (
  locale: Locale,
  input: BlogPostCreateInput,
  options: FetchBlogOptions = {},
): Promise<BlogPostDetail | null> => {
  const result = await createBlogPostWithStatus(locale, input, options)
  return result.post
}

export const createBlogPostWithStatus = async (
  locale: Locale,
  input: BlogPostCreateInput,
  options: FetchBlogOptions = {},
): Promise<BlogPostCreateApiResult> => {
  if (!isBlogApiEnabled()) {
    return {
      status: 0,
      post: null,
    }
  }

  const response = await fetch(resolveBlogListApiUrl(locale), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(input),
    signal: options.signal,
  })

  if (!response.ok) {
    return {
      status: response.status,
      post: null,
    }
  }

  const payload = (await response.json()) as unknown

  return {
    status: response.status,
    post: normalizeBlogPostDetailPayload(payload),
  }
}

export const updateBlogPost = async (
  locale: Locale,
  id: string,
  input: BlogPostUpdateInput,
  options: FetchBlogOptions = {},
): Promise<BlogPostDetail | null> => {
  if (!isBlogApiEnabled()) {
    return null
  }

  const response = await fetch(resolveBlogPostApiUrl(locale, id), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(input),
    signal: options.signal,
  })

  if (!response.ok) {
    return null
  }

  const payload = (await response.json()) as unknown

  return normalizeBlogPostDetailPayload(payload)
}

export const deleteBlogPost = async (
  locale: Locale,
  id: string,
  options: FetchBlogOptions = {},
): Promise<boolean> => {
  if (!isBlogApiEnabled()) {
    return false
  }

  const response = await fetch(resolveBlogPostApiUrl(locale, id), {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
    },
    signal: options.signal,
  })

  return response.ok
}
