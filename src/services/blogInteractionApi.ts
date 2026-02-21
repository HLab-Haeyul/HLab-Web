import type { BlogComment } from '@/data/blog/types'
import type { Locale } from '@/data/portfolio/types'
import { isBlogApiEnabled } from '@/services/blogApiConfig'

type FetchOptions = {
  signal?: AbortSignal
}

type InteractionPayload = {
  likes: number
  liked: boolean
}

export type BlogCommentPagePayload = {
  items: BlogComment[]
  page: number
  pageSize: number
  totalCount: number
}

type CommentCreateInput = {
  authorName: string
  body: string
}

type CommentUpdateInput = {
  body: string
}

type FetchCommentPageInput = {
  page: number
  pageSize: number
}

const DEFAULT_API_PATH = '/api/blog'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isBlogComment = (value: unknown): value is BlogComment => {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.id === 'string' &&
    typeof value.authorName === 'string' &&
    typeof value.body === 'string' &&
    typeof value.createdAt === 'string'
  )
}

const isInteractionPayload = (value: unknown): value is InteractionPayload => {
  if (!isRecord(value)) {
    return false
  }

  return typeof value.likes === 'number' && typeof value.liked === 'boolean'
}

const toPositiveInteger = (value: unknown): number | null => {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 1) {
    return null
  }

  return value
}

const normalizeCommentPagePayload = (value: unknown): BlogCommentPagePayload | null => {
  if (!isRecord(value)) {
    return null
  }

  const items = Array.isArray(value.items)
    ? value.items
    : Array.isArray(value.comments)
      ? value.comments
      : null

  if (!items || !items.every((comment) => isBlogComment(comment))) {
    return null
  }

  const page = toPositiveInteger(value.page)
  const pageSize = toPositiveInteger(value.pageSize)
  const totalCount = typeof value.totalCount === 'number' && value.totalCount >= 0 ? value.totalCount : null

  if (!page || !pageSize || totalCount === null) {
    return null
  }

  return {
    items,
    page,
    pageSize,
    totalCount,
  }
}

const resolvePostBaseUrl = (locale: Locale, id: string) => {
  const absoluteUrl = (import.meta.env.VITE_BLOG_API_URL as string | undefined)?.trim()
  const baseUrl = (import.meta.env.VITE_BLOG_API_BASE_URL as string | undefined)?.trim()
  const apiPath = (import.meta.env.VITE_BLOG_API_PATH as string | undefined)?.trim() || DEFAULT_API_PATH
  const origin = globalThis.location?.origin ?? 'http://localhost'

  const url = absoluteUrl ? new URL(absoluteUrl) : new URL(apiPath, baseUrl || origin)
  url.pathname = `${url.pathname.replace(/\/$/, '')}/${encodeURIComponent(id)}`
  url.searchParams.set('locale', locale)

  return url
}

const extractPayload = (payload: unknown) => (isRecord(payload) && 'data' in payload ? payload.data : payload)

export const fetchBlogEngagement = async (
  locale: Locale,
  id: string,
  options: FetchOptions = {},
): Promise<InteractionPayload | null> => {
  if (!isBlogApiEnabled()) {
    return null
  }

  const url = resolvePostBaseUrl(locale, id)
  url.pathname = `${url.pathname}/engagement`

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal: options.signal,
  })

  if (!response.ok) {
    return null
  }

  const payload = extractPayload((await response.json()) as unknown)

  if (!isInteractionPayload(payload)) {
    return null
  }

  return payload
}

export const fetchBlogComments = async (
  locale: Locale,
  id: string,
  input: FetchCommentPageInput,
  options: FetchOptions = {},
): Promise<BlogCommentPagePayload | null> => {
  if (!isBlogApiEnabled()) {
    return null
  }

  const url = resolvePostBaseUrl(locale, id)
  url.pathname = `${url.pathname}/comments`
  url.searchParams.set('page', String(input.page))
  url.searchParams.set('pageSize', String(input.pageSize))

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal: options.signal,
  })

  if (!response.ok) {
    return null
  }

  const payload = extractPayload((await response.json()) as unknown)

  return normalizeCommentPagePayload(payload)
}

export const toggleBlogLike = async (
  locale: Locale,
  id: string,
  liked: boolean,
  options: FetchOptions = {},
): Promise<Pick<InteractionPayload, 'likes' | 'liked'> | null> => {
  if (!isBlogApiEnabled()) {
    return null
  }

  const url = resolvePostBaseUrl(locale, id)
  url.pathname = `${url.pathname}/like`

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ liked }),
    signal: options.signal,
  })

  if (!response.ok) {
    return null
  }

  const payload = extractPayload((await response.json()) as unknown)

  if (!isRecord(payload) || typeof payload.likes !== 'number' || typeof payload.liked !== 'boolean') {
    return null
  }

  return {
    likes: payload.likes,
    liked: payload.liked,
  }
}

export const createBlogComment = async (
  locale: Locale,
  id: string,
  input: CommentCreateInput,
  options: FetchOptions = {},
): Promise<BlogComment | null> => {
  if (!isBlogApiEnabled()) {
    return null
  }

  const url = resolvePostBaseUrl(locale, id)
  url.pathname = `${url.pathname}/comments`

  const response = await fetch(url.toString(), {
    method: 'POST',
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

  const payload = extractPayload((await response.json()) as unknown)

  if (!isBlogComment(payload)) {
    return null
  }

  return payload
}

export const updateBlogComment = async (
  locale: Locale,
  id: string,
  commentId: string,
  input: CommentUpdateInput,
  options: FetchOptions = {},
): Promise<BlogComment | null> => {
  if (!isBlogApiEnabled()) {
    return null
  }

  const url = resolvePostBaseUrl(locale, id)
  url.pathname = `${url.pathname}/comments/${encodeURIComponent(commentId)}`

  const response = await fetch(url.toString(), {
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

  const payload = extractPayload((await response.json()) as unknown)

  if (!isBlogComment(payload)) {
    return null
  }

  return payload
}

export const deleteBlogComment = async (
  locale: Locale,
  id: string,
  commentId: string,
  options: FetchOptions = {},
): Promise<boolean> => {
  if (!isBlogApiEnabled()) {
    return false
  }

  const url = resolvePostBaseUrl(locale, id)
  url.pathname = `${url.pathname}/comments/${encodeURIComponent(commentId)}`

  const response = await fetch(url.toString(), {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
    },
    signal: options.signal,
  })

  return response.ok
}
