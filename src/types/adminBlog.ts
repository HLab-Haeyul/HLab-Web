import type { BlogCategoryKey } from '@/data/blog/content'

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

export type AdminBlogCategoryOption = {
  key: BlogCategoryKey
  label: string
}

export type AdminBlogRetrospectiveProjectOption = {
  key: string
  label: string
}
