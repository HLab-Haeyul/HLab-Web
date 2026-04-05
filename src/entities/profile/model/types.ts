import type { WorkItem } from '@/entities/project'

<<<<<<< HEAD:src/entities/profile/model/types.ts
export type { Locale } from '@/shared/types'
=======
export type ExternalLink = {
  name: string
  url: string
}

export type WorkItem = {
  title: string
  summary: string
  impact: string
  stack: string[]
  role?: string
  contributions?: string[]
  imageSrc?: string
  imageAlt?: string
  links?: ExternalLink[]
}
>>>>>>> bcb44d31e79bd4ec3b408f7a2820db0293f0d8dd:src/data/portfolio/types.ts

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
<<<<<<< HEAD:src/entities/profile/model/types.ts
=======
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
>>>>>>> bcb44d31e79bd4ec3b408f7a2820db0293f0d8dd:src/data/portfolio/types.ts
  footerName: string
}
