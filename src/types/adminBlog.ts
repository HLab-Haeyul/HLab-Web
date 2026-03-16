import type { BlogCategoryKey } from '@/data/blog/content'

export type AdminBlogCategoryOption = {
  key: BlogCategoryKey
  label: string
}

export type AdminRetrospectiveProjectOption = {
  key: string
  label: string
}

export type BlogPostAdminDraft = {
  id: string
  title: string
  excerpt: string
  category: BlogCategoryKey
  tags: string
  retrospectiveProjectKey: string
  publishedAt: string
  readTime: string
  heroTag: string
  authorName: string
  markdown: string
}

export type AdminBlogPostCardItem = {
  id: string
  title: string
  excerpt: string
  categoryTitle: string
  publishedAt: string
  thumbnailSrc: string | null
}
