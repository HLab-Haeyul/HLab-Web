export type BlogCategoryKey = 'tech' | 'retrospective' | 'selfDev'

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  publishedAt: string
  readTime: string
  tags: string[]
  category: BlogCategoryKey
}

export type PopularPost = BlogPost & {
  heroTag: string
  highlight: string
  bannerBackground: string
}

export type BlogCategoryCopy = {
  title: string
  description: string
}

export type BlogPageCopySet = {
  kicker: string
  heading: string
  description: string
  popularKicker: string
  popularHeading: string
  popularDescription: string
  readLabel: string
  categories: Record<BlogCategoryKey, BlogCategoryCopy>
  popularPosts: PopularPost[]
  posts: BlogPost[]
}

export type BlogPostDetail = BlogPost & {
  heroTag: string
  authorName: string
  markdown: string
  images?: BlogPostImage[]
  videos?: BlogPostVideo[]
}

export type BlogPostImage = {
  src: string
  alt?: string
  caption?: string
}

export type BlogPostVideo = {
  src: string
  title?: string
  poster?: string
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
}

export type BlogComment = {
  id: string
  authorName: string
  body: string
  createdAt: string
}

export const BLOG_CATEGORY_KEYS: BlogCategoryKey[] = ['tech', 'retrospective', 'selfDev']
