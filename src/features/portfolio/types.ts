export type Locale = 'ko' | 'en'

export type WorkItem = {
  title: string
  summary: string
  impact: string
  stack: string[]
}

export type MetricItem = {
  label: string
  value: string
}

export type StackTickerItem = {
  icon?: string
  imageSrc?: string
  imageAlt?: string
  label: string
}

export type StackTickerCopy = {
  kicker: string
  heading: string
  viewAllCta: string
  items: StackTickerItem[]
}

export type StackDetailCapability = {
  usedOnce: boolean
  projectExperience: boolean
  productionReady: boolean
}

export type StackDetailItem = {
  icon?: string
  imageSrc?: string
  imageAlt?: string
  label: string
  category: string
  proficiency: string
  capability: StackDetailCapability
  note: string
}

export type StackDetailCopy = {
  kicker: string
  heading: string
  description: string
  backCta: string
  columnSkill: string
  columnCategory: string
  columnProficiency: string
  columnUsedOnce: string
  columnProject: string
  columnReady: string
  columnNote: string
  yesLabel: string
  noLabel: string
  summaryUsedOnce: string
  summaryProject: string
  summaryReady: string
  items: StackDetailItem[]
}

export type AwardItem = {
  year: string
  title: string
  organizer: string
}

export type ProfileShowcaseCopy = {
  kicker: string
  heading: string
  photoTitle: string
  photoHint: string
  photoUploadLabel: string
  photoUploadHint: string
  photoSrc: string
  photoAlt: string
  awardsTitle: string
  awards: AwardItem[]
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
  emailCta: string
  githubCta: string
  footerName: string
}
