export type { Locale } from '@/shared/types'

export type CertificateItem = {
  title: string
  issuer: string
  issuedAt: string
  credentialId?: string
  description: string
  tags: string[]
  status?: string
  imageSrc?: string
  imageAlt?: string
}

export type PortfolioCertificatesCopy = {
  kicker: string
  heading: string
  body: string
  issuerLabel: string
  issuedAtLabel: string
  credentialIdLabel: string
  imageHint: string
  emptyTitle: string
  emptyBody: string
  certificates: CertificateItem[]
}
