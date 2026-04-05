import { computed, ref, type Ref } from 'vue'
import { portfolioCertificatesByLocale } from '@/entities/certificate'
import type {
  CertificateItem,
  Locale,
  PortfolioCertificatesCopy,
} from '@/entities/portfolio'

type PortfolioCertificatesStore = Record<Locale, CertificateItem[]>

const PORTFOLIO_CERTIFICATES_STORAGE_KEY = 'hlab.portfolio.certificates.v3'
const LEGACY_PORTFOLIO_CERTIFICATES_KEYS = [
  'hlab.portfolio.certificates.v2',
  'hlab.portfolio.certificates.mock-restore.v1',
]

const cloneCertificate = (certificate: CertificateItem): CertificateItem => ({
  ...certificate,
  tags: [...certificate.tags],
})

const cloneCertificates = (certificates: CertificateItem[]) =>
  certificates.map((certificate) => cloneCertificate(certificate))

const buildDefaultStore = (): PortfolioCertificatesStore => ({
  ko: cloneCertificates(portfolioCertificatesByLocale.ko.certificates),
  en: cloneCertificates(portfolioCertificatesByLocale.en.certificates),
})

const toStringValue = (value: unknown) => (typeof value === 'string' ? value : '')

const toStringArray = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []

const toCertificateItem = (value: unknown): CertificateItem | null => {
  if (typeof value !== 'object' || value === null) {
    return null
  }

  const candidate = value as Record<string, unknown>
  const title = toStringValue(candidate.title).trim()

  if (!title) {
    return null
  }

  return {
    title,
    issuer: toStringValue(candidate.issuer).trim(),
    issuedAt: toStringValue(candidate.issuedAt).trim(),
    credentialId: toStringValue(candidate.credentialId).trim() || undefined,
    description: toStringValue(candidate.description).trim(),
    tags: toStringArray(candidate.tags),
    status: toStringValue(candidate.status).trim() || undefined,
    imageSrc: toStringValue(candidate.imageSrc).trim() || undefined,
    imageAlt: toStringValue(candidate.imageAlt).trim() || undefined,
  }
}

const normalizeStoredStore = (value: unknown): PortfolioCertificatesStore | null => {
  if (typeof value !== 'object' || value === null) {
    return null
  }

  const candidate = value as Record<string, unknown>
  const nextStore = buildDefaultStore()
  let hasOverride = false

  ;(['ko', 'en'] as const).forEach((locale) => {
    const storedCertificates = candidate[locale]

    if (!Array.isArray(storedCertificates)) {
      return
    }

    const normalized = storedCertificates
      .map((certificate) => toCertificateItem(certificate))
      .filter((certificate): certificate is CertificateItem => Boolean(certificate))

    nextStore[locale] = normalized
    hasOverride = true
  })

  return hasOverride ? nextStore : null
}

const cleanupLegacyCertificatesStorage = () => {
  if (typeof window === 'undefined') {
    return
  }

  LEGACY_PORTFOLIO_CERTIFICATES_KEYS.forEach((key) => {
    window.localStorage.removeItem(key)
  })
}

const certificatesStore = ref<PortfolioCertificatesStore>(buildDefaultStore())

let hasHydratedCertificatesStore = false
let hasStorageListener = false

const persistCertificatesStore = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(
    PORTFOLIO_CERTIFICATES_STORAGE_KEY,
    JSON.stringify(certificatesStore.value),
  )
}

const applyCertificatesStore = (nextStore: PortfolioCertificatesStore) => {
  certificatesStore.value = {
    ko: cloneCertificates(nextStore.ko),
    en: cloneCertificates(nextStore.en),
  }
}

const hydrateCertificatesStore = () => {
  if (typeof window === 'undefined') {
    return
  }

  cleanupLegacyCertificatesStorage()

  const raw = window.localStorage.getItem(PORTFOLIO_CERTIFICATES_STORAGE_KEY)

  if (!raw) {
    applyCertificatesStore(buildDefaultStore())
    return
  }

  try {
    const normalized = normalizeStoredStore(JSON.parse(raw) as unknown)

    if (!normalized) {
      applyCertificatesStore(buildDefaultStore())
      return
    }

    applyCertificatesStore(normalized)
  } catch {
    applyCertificatesStore(buildDefaultStore())
  }
}

const ensureCertificatesStore = () => {
  if (typeof window === 'undefined') {
    return
  }

  if (!hasHydratedCertificatesStore) {
    hydrateCertificatesStore()
    hasHydratedCertificatesStore = true
  }

  if (hasStorageListener) {
    return
  }

  window.addEventListener('storage', (event) => {
    if (event.key !== PORTFOLIO_CERTIFICATES_STORAGE_KEY) {
      return
    }

    hydrateCertificatesStore()
  })
  hasStorageListener = true
}

export const createEmptyPortfolioCertificate = (): CertificateItem => ({
  title: '',
  issuer: '',
  issuedAt: '',
  credentialId: undefined,
  description: '',
  tags: [],
  status: undefined,
  imageSrc: undefined,
  imageAlt: undefined,
})

export const usePortfolioCertificates = (locale: Ref<Locale>) => {
  ensureCertificatesStore()

  const certificates = computed(() => certificatesStore.value[locale.value])

  const certificatesCopy = computed<PortfolioCertificatesCopy>(() => ({
    ...portfolioCertificatesByLocale[locale.value],
    certificates: cloneCertificates(certificates.value),
  }))

  const saveCertificates = (nextCertificates: CertificateItem[]) => {
    certificatesStore.value = {
      ...certificatesStore.value,
      [locale.value]: cloneCertificates(nextCertificates),
    }

    persistCertificatesStore()
  }

  const resetCertificates = () => {
    saveCertificates(portfolioCertificatesByLocale[locale.value].certificates)
  }

  const defaultCertificates = computed(() =>
    cloneCertificates(portfolioCertificatesByLocale[locale.value].certificates),
  )

  return {
    certificates,
    certificatesCopy,
    defaultCertificates,
    saveCertificates,
    resetCertificates,
  }
}
