import type { BlogComment } from '../data/blog/content'
import type { Locale } from '../data/portfolio/types'

type FetchOptions = {
  signal?: AbortSignal
}

type InteractionPayload = {
  likes: number
  liked: boolean
  comments: BlogComment[]
}

type CommentCreateInput = {
  authorName: string
  body: string
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

  return (
    typeof value.likes === 'number' &&
    typeof value.liked === 'boolean' &&
    Array.isArray(value.comments) &&
    value.comments.every((comment) => isBlogComment(comment))
  )
}

const resolvePostBaseUrl = (locale: Locale, slug: string) => {
  const absoluteUrl = (import.meta.env.VITE_BLOG_API_URL as string | undefined)?.trim()
  const baseUrl = (import.meta.env.VITE_BLOG_API_BASE_URL as string | undefined)?.trim()
  const apiPath = (import.meta.env.VITE_BLOG_API_PATH as string | undefined)?.trim() || DEFAULT_API_PATH
  const origin = globalThis.location?.origin ?? 'http://localhost'

  const url = absoluteUrl ? new URL(absoluteUrl) : new URL(apiPath, baseUrl || origin)
  url.pathname = `${url.pathname.replace(/\/$/, '')}/${encodeURIComponent(slug)}`
  url.searchParams.set('locale', locale)

  return url
}

const extractPayload = (payload: unknown) => (isRecord(payload) && 'data' in payload ? payload.data : payload)

export const fetchBlogEngagement = async (
  locale: Locale,
  slug: string,
  options: FetchOptions = {},
): Promise<InteractionPayload | null> => {
  const url = resolvePostBaseUrl(locale, slug)
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

export const toggleBlogLike = async (
  locale: Locale,
  slug: string,
  liked: boolean,
  options: FetchOptions = {},
): Promise<Pick<InteractionPayload, 'likes' | 'liked'> | null> => {
  const url = resolvePostBaseUrl(locale, slug)
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
  slug: string,
  input: CommentCreateInput,
  options: FetchOptions = {},
): Promise<BlogComment | null> => {
  const url = resolvePostBaseUrl(locale, slug)
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
