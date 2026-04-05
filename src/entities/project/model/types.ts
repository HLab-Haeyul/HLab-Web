export type { Locale } from '@/shared/types'

export type ExternalLink = {
  name: string
  url: string
}

export type WorkItem = {
  title: string
  summary: string
  impact: string
  stack: string[]
  imageSrc?: string
  imageAlt?: string
  links?: ExternalLink[]
}
