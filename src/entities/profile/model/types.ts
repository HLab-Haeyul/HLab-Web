import type { WorkItem } from '@/entities/project'

export type { Locale } from '@/shared/types'

export type StudyLink = {
  name: string
  url: string
  icon: string
}

export type ExternalLink = {
  name: string
  url: string
}

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

export type CertificateItem = {
  year: string
  title: string
  organizer: string
  description: string
  acquiredDate: string
  proofImageSrc?: string
  proofImageAlt?: string
}

export type ExperienceItem = {
  year: string
  title: string
  organizer: string
  description: string
}

export type HobbyItem = {
  name: string
  description: string
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
  certificatesTitle: string
  certificatesEmptyLabel: string
  certificatesDateLabel: string
  certificates: CertificateItem[]
  experiencesTitle: string
  experiencesEmptyLabel: string
  experiences: ExperienceItem[]
  hobbiesTitle: string
  hobbiesEmptyLabel: string
  hobbies: HobbyItem[]
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
  contactKicker: string
  contactHeading: string
  contactInfoTitle: string
  gmailLabel: string
  gmailAddress: string
  contactLabel: string
  contactValue: string
  emailCta: string
  githubCta: string
  studyLinksTitle: string
  studyLinks: StudyLink[]
  footerName: string
}
