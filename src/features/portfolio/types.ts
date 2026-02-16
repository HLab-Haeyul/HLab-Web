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
  icon: string
  label: string
}

export type StackTickerCopy = {
  kicker: string
  heading: string
  items: StackTickerItem[]
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
