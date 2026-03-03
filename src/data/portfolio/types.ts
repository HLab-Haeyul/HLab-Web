export type Locale = 'ko' | 'en'

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

export type MetricItem = {
  label: string
  value: string
}

export type AwardItem = {
  year: string
  title: string
  organizer: string
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

export type StudyLink = {
  name: string
  url: string
  icon: string
}

export type PortfolioCopySet = {
  navWork: string
  navPrinciples: string
  navContact: string
  eyebrow: string
  heroTitle: string
  heroLead: string
  primaryCta: string
  secondaryCta: string
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
