import type { WorkItem } from '@/data/portfolio/types'

export type CollaborationLink = {
  name: string
  url: string
}

export type AdminProjectRecord = WorkItem & {
  id: string
  teamRole: string
  troubleshooting: string
  collaborationLinks: CollaborationLink[]
}

export type AdminProjectEditorDraft = {
  title: string
  summary: string
  impact: string
  teamRole: string
  imageSrc: string
  imageAlt: string
  troubleshooting: string
  collaborationSiteName: string
  collaborationSiteUrl: string
  collaborationLinks: CollaborationLink[]
}

export type AdminProjectEditorPanel = 'troubleshooting' | 'settings' | null
