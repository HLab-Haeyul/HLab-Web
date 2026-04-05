import type { WorkItem } from '@/entities/portfolio'

export type ProjectToneStyle = Record<string, string>

export type ProjectArchiveCopy = {
  kicker: string
  heading: string
  lead: string
  countLabel: string
  currentLabel: string
  listHeading: string
  listLead: string
  detailHeading: string
  detailLead: string
  selectedLabel: string
  summaryLabel: string
  impactLabel: string
  stackLabel: string
  linksHeading: string
  linksLead: string
  linksEmpty: string
}

export type ProjectArchiveProject = WorkItem
