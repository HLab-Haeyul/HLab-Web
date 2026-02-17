export type Locale = 'ko' | 'en'

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
  projectUsed: boolean
  practicalUsed: boolean
  internalsExplored: boolean
}

export type StackDetailItem = {
  icon?: string
  imageSrc?: string
  imageAlt?: string
  label: string
  category: string
  proficiency: string
  capability: StackDetailCapability
}

export type StackDetailCopy = {
  kicker: string
  heading: string
  description: string
  backCta: string
  columnSkill: string
  columnCategory: string
  columnProficiency: string
  columnProjectUsed: string
  columnPracticalUsed: string
  columnInternals: string
  columnNote: string
  yesLabel: string
  noLabel: string
  summaryProjectUsed: string
  summaryPracticalUsed: string
  summaryInternals: string
  items: StackDetailItem[]
}
