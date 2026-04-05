import type { WorkItem } from '@/entities/project'

export type { Locale } from '@/shared/types'

export type MetricItem = {
  label: string
  value: string
}

export type AwardItem = {
  year: string
  title: string
  organizer: string
  imageSrc?: string
  imageAlt?: string
}

export type CareerTimelineItem = {
  id: string
  category: string
  role: string
  organization: string
  startedAt: string
  endedAt?: string
  periodLabel: string
  durationLabel: string
  summary: string
  highlights: string[]
}

export type ProfileShowcaseCopy = {
  kicker: string
  heading: string
  photoTitle: string
  photoHint: string
  photoSrc: string
  photoAlt: string
  awardsTitle: string
  awardPreviewLabel: string
  selectedAwardLabel: string
  awardPreviewHintWithImage: string
  awardPreviewHintWithoutImage: string
  careerKicker: string
  careerHeading: string
  careerBody: string
  careerEmptyTitle: string
  careerEmptyBody: string
  careerTimeline: CareerTimelineItem[]
  awards: AwardItem[]
}

export type PortfolioCopySet = {
  navWork: string
  navPrinciples: string
  eyebrow: string
  heroTitle: string
  heroLead: string
  metrics: MetricItem[]
  workKicker: string
  workHeading: string
  works: WorkItem[]
  principlesKicker: string
  principlesHeading: string
  principlesBody: string
  principles: string[]
  footerName: string
}
