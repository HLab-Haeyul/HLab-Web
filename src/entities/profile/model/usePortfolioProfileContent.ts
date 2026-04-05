import { computed, ref, type Ref } from 'vue'
import { portfolioCopyByLocale } from '@/entities/profile'
import { profileShowcaseByLocale } from '@/entities/profile'
import type {
  AwardItem,
  CareerTimelineItem,
  Locale,
  PortfolioCopySet,
  ProfileShowcaseCopy,
} from '@/entities/portfolio'
import { stackDetailByLocale } from '@/entities/stack'
import { stackTickerByLocale } from '@/entities/stack'
import type { StackDetailCopy, StackDetailItem, StackTickerCopy } from '@/entities/stack'

type PortfolioProfileStoreItem = {
  heroTitle: string
  awards: AwardItem[]
  careerTimeline: CareerTimelineItem[]
  stackItems: StackDetailItem[]
}

type PortfolioProfileStore = Record<Locale, PortfolioProfileStoreItem>

const PORTFOLIO_PROFILE_STORAGE_KEY = 'hlab.portfolio.profile.v1'
const PORTFOLIO_PROFILE_MOCK_RESTORE_KEY = 'hlab.portfolio.profile.mock-restore.v1'
const PORTFOLIO_PROFILE_CAREER_CLEAR_KEY = 'hlab.portfolio.profile.career-clear.v1'

const cloneAward = (award: AwardItem): AwardItem => ({
  ...award,
})

const cloneAwards = (awards: AwardItem[]) => awards.map((award) => cloneAward(award))

const cloneCareerTimelineItem = (item: CareerTimelineItem): CareerTimelineItem => ({
  ...item,
  highlights: [...item.highlights],
})

const cloneCareerTimeline = (items: CareerTimelineItem[]) =>
  items.map((item) => cloneCareerTimelineItem(item))

const cloneStackItem = (item: StackDetailItem): StackDetailItem => ({
  ...item,
  capability: {
    ...item.capability,
  },
})

const cloneStackItems = (items: StackDetailItem[]) => items.map((item) => cloneStackItem(item))

const buildDefaultStore = (): PortfolioProfileStore => ({
  ko: {
    heroTitle: portfolioCopyByLocale.ko.heroTitle,
    awards: cloneAwards(profileShowcaseByLocale.ko.awards),
    careerTimeline: cloneCareerTimeline(profileShowcaseByLocale.ko.careerTimeline),
    stackItems: cloneStackItems(stackDetailByLocale.ko.items),
  },
  en: {
    heroTitle: portfolioCopyByLocale.en.heroTitle,
    awards: cloneAwards(profileShowcaseByLocale.en.awards),
    careerTimeline: cloneCareerTimeline(profileShowcaseByLocale.en.careerTimeline),
    stackItems: cloneStackItems(stackDetailByLocale.en.items),
  },
})

const toStringValue = (value: unknown) => (typeof value === 'string' ? value : '')

const toBooleanValue = (value: unknown) => value === true

const toStringArray = (value: unknown) =>
  Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === 'string')
        .map((item) => item.trim())
        .filter(Boolean)
    : []

const toAwardItem = (value: unknown): AwardItem | null => {
  if (typeof value !== 'object' || value === null) {
    return null
  }

  const candidate = value as Record<string, unknown>
  const title = toStringValue(candidate.title).trim()

  if (!title) {
    return null
  }

  return {
    year: toStringValue(candidate.year).trim(),
    title,
    organizer: toStringValue(candidate.organizer).trim(),
    imageSrc: toStringValue(candidate.imageSrc).trim() || undefined,
    imageAlt: toStringValue(candidate.imageAlt).trim() || undefined,
  }
}

const toCareerTimelineItem = (
  value: unknown,
  fallbackIndex: number,
): CareerTimelineItem | null => {
  if (typeof value !== 'object' || value === null) {
    return null
  }

  const candidate = value as Record<string, unknown>
  const role = toStringValue(candidate.role).trim()

  if (!role) {
    return null
  }

  return {
    id: toStringValue(candidate.id).trim() || `career-${fallbackIndex + 1}`,
    category: toStringValue(candidate.category).trim(),
    role,
    organization: toStringValue(candidate.organization).trim(),
    startedAt: toStringValue(candidate.startedAt).trim(),
    endedAt: toStringValue(candidate.endedAt).trim() || undefined,
    periodLabel: toStringValue(candidate.periodLabel).trim(),
    durationLabel: toStringValue(candidate.durationLabel).trim(),
    summary: toStringValue(candidate.summary).trim(),
    highlights: toStringArray(candidate.highlights),
  }
}

const toStackItem = (value: unknown): StackDetailItem | null => {
  if (typeof value !== 'object' || value === null) {
    return null
  }

  const candidate = value as Record<string, unknown>
  const label = toStringValue(candidate.label).trim()

  if (!label) {
    return null
  }

  const capabilityCandidate =
    typeof candidate.capability === 'object' && candidate.capability !== null
      ? (candidate.capability as Record<string, unknown>)
      : {}

  return {
    icon: toStringValue(candidate.icon).trim() || undefined,
    imageSrc: toStringValue(candidate.imageSrc).trim() || undefined,
    imageAlt: toStringValue(candidate.imageAlt).trim() || undefined,
    label,
    category: toStringValue(candidate.category).trim(),
    proficiency: toStringValue(candidate.proficiency).trim(),
    capability: {
      projectUsed: toBooleanValue(capabilityCandidate.projectUsed),
      practicalUsed: toBooleanValue(capabilityCandidate.practicalUsed),
      internalsExplored: toBooleanValue(capabilityCandidate.internalsExplored),
    },
  }
}

const normalizeStoredStore = (value: unknown): PortfolioProfileStore | null => {
  if (typeof value !== 'object' || value === null) {
    return null
  }

  const candidate = value as Record<string, unknown>
  const defaults = buildDefaultStore()
  let hasOverride = false

  ;(['ko', 'en'] as const).forEach((locale) => {
    const storedLocaleValue = candidate[locale]

    if (typeof storedLocaleValue !== 'object' || storedLocaleValue === null) {
      return
    }

    const storedLocaleRecord = storedLocaleValue as Record<string, unknown>
    const heroTitle = toStringValue(storedLocaleRecord.heroTitle).trim()
    const storedAwards = storedLocaleRecord.awards
    const storedCareerTimeline = storedLocaleRecord.careerTimeline
    const storedStackItems = storedLocaleRecord.stackItems

    defaults[locale] = {
      heroTitle: heroTitle || defaults[locale].heroTitle,
      awards: Array.isArray(storedAwards)
        ? storedAwards
            .map((award) => toAwardItem(award))
            .filter((award): award is AwardItem => award !== null)
        : defaults[locale].awards,
      careerTimeline: Array.isArray(storedCareerTimeline)
        ? storedCareerTimeline
            .map((item, index) => toCareerTimelineItem(item, index))
            .filter((item): item is CareerTimelineItem => item !== null)
        : defaults[locale].careerTimeline,
      stackItems: Array.isArray(storedStackItems)
        ? storedStackItems
            .map((item) => toStackItem(item))
            .filter((item): item is StackDetailItem => item !== null)
        : defaults[locale].stackItems,
    }
    hasOverride = true
  })

  return hasOverride ? defaults : null
}

const shouldRestorePortfolioMocks = () => {
  if (typeof window === 'undefined') {
    return false
  }

  return window.localStorage.getItem(PORTFOLIO_PROFILE_MOCK_RESTORE_KEY) !== 'done'
}

const shouldClearStoredCareerTimeline = () => {
  if (typeof window === 'undefined') {
    return false
  }

  return window.localStorage.getItem(PORTFOLIO_PROFILE_CAREER_CLEAR_KEY) !== 'done'
}

const markPortfolioMocksRestored = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(PORTFOLIO_PROFILE_MOCK_RESTORE_KEY, 'done')
}

const markStoredCareerTimelineCleared = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(PORTFOLIO_PROFILE_CAREER_CLEAR_KEY, 'done')
}

const clearCareerTimelineInStore = (store: PortfolioProfileStore): PortfolioProfileStore => {
  const defaults = buildDefaultStore()

  return {
    ko: {
      heroTitle: store.ko.heroTitle,
      awards: cloneAwards(store.ko.awards),
      careerTimeline: cloneCareerTimeline(defaults.ko.careerTimeline),
      stackItems: cloneStackItems(store.ko.stackItems),
    },
    en: {
      heroTitle: store.en.heroTitle,
      awards: cloneAwards(store.en.awards),
      careerTimeline: cloneCareerTimeline(defaults.en.careerTimeline),
      stackItems: cloneStackItems(store.en.stackItems),
    },
  }
}

const restorePortfolioMocksIfEmpty = (store: PortfolioProfileStore) => {
  const defaults = buildDefaultStore()
  const nextStore: PortfolioProfileStore = {
    ko: {
      heroTitle: store.ko.heroTitle,
      awards: cloneAwards(store.ko.awards),
      careerTimeline: cloneCareerTimeline(store.ko.careerTimeline),
      stackItems: cloneStackItems(store.ko.stackItems),
    },
    en: {
      heroTitle: store.en.heroTitle,
      awards: cloneAwards(store.en.awards),
      careerTimeline: cloneCareerTimeline(store.en.careerTimeline),
      stackItems: cloneStackItems(store.en.stackItems),
    },
  }
  let restored = false

  ;(['ko', 'en'] as const).forEach((locale) => {
    if (nextStore[locale].awards.length === 0 && defaults[locale].awards.length > 0) {
      nextStore[locale].awards = cloneAwards(defaults[locale].awards)
      restored = true
    }

    if (
      nextStore[locale].careerTimeline.length === 0 &&
      defaults[locale].careerTimeline.length > 0
    ) {
      nextStore[locale].careerTimeline = cloneCareerTimeline(defaults[locale].careerTimeline)
      restored = true
    }
  })

  return {
    store: nextStore,
    restored,
  }
}

const portfolioProfileStore = ref<PortfolioProfileStore>(buildDefaultStore())

let hasHydratedPortfolioProfileStore = false
let hasPortfolioProfileStorageListener = false

const applyPortfolioProfileStore = (nextStore: PortfolioProfileStore) => {
  portfolioProfileStore.value = {
    ko: {
      heroTitle: nextStore.ko.heroTitle,
      awards: cloneAwards(nextStore.ko.awards),
      careerTimeline: cloneCareerTimeline(nextStore.ko.careerTimeline),
      stackItems: cloneStackItems(nextStore.ko.stackItems),
    },
    en: {
      heroTitle: nextStore.en.heroTitle,
      awards: cloneAwards(nextStore.en.awards),
      careerTimeline: cloneCareerTimeline(nextStore.en.careerTimeline),
      stackItems: cloneStackItems(nextStore.en.stackItems),
    },
  }
}

const persistPortfolioProfileStore = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(
    PORTFOLIO_PROFILE_STORAGE_KEY,
    JSON.stringify(portfolioProfileStore.value),
  )
}

const hydratePortfolioProfileStore = () => {
  if (typeof window === 'undefined') {
    return
  }

  const shouldClearCareerTimeline = shouldClearStoredCareerTimeline()
  const raw = window.localStorage.getItem(PORTFOLIO_PROFILE_STORAGE_KEY)

  if (!raw) {
    if (shouldClearCareerTimeline) {
      markStoredCareerTimelineCleared()
    }

    applyPortfolioProfileStore(buildDefaultStore())
    return
  }

  try {
    const normalized = normalizeStoredStore(JSON.parse(raw) as unknown)

    if (!normalized) {
      if (shouldClearCareerTimeline) {
        markStoredCareerTimelineCleared()
      }

      applyPortfolioProfileStore(buildDefaultStore())
      return
    }

    const careerClearedStore = shouldClearCareerTimeline
      ? clearCareerTimelineInStore(normalized)
      : normalized
    const shouldRestore = shouldRestorePortfolioMocks()
    const restoredResult = shouldRestore ? restorePortfolioMocksIfEmpty(careerClearedStore) : null
    const nextStore = restoredResult ? restoredResult.store : careerClearedStore

    applyPortfolioProfileStore(nextStore)

    if (shouldClearCareerTimeline || restoredResult?.restored) {
      persistPortfolioProfileStore()
    }

    if (shouldClearCareerTimeline) {
      markStoredCareerTimelineCleared()
    }

    if (shouldRestore) {
      markPortfolioMocksRestored()
    }
  } catch {
    if (shouldClearCareerTimeline) {
      markStoredCareerTimelineCleared()
    }

    applyPortfolioProfileStore(buildDefaultStore())
  }
}

const ensurePortfolioProfileStore = () => {
  if (typeof window === 'undefined') {
    return
  }

  if (!hasHydratedPortfolioProfileStore) {
    hydratePortfolioProfileStore()
    hasHydratedPortfolioProfileStore = true
  }

  if (hasPortfolioProfileStorageListener) {
    return
  }

  window.addEventListener('storage', (event) => {
    if (event.key !== PORTFOLIO_PROFILE_STORAGE_KEY) {
      return
    }

    hydratePortfolioProfileStore()
  })
  hasPortfolioProfileStorageListener = true
}

const toTickerItems = (items: StackDetailItem[]) =>
  items.map((item) => ({
    icon: item.icon,
    imageSrc: item.imageSrc,
    imageAlt: item.imageAlt,
    label: item.label,
  }))

export const usePortfolioProfileContent = (locale: Ref<Locale>) => {
  ensurePortfolioProfileStore()

  const heroTitle = computed(() => portfolioProfileStore.value[locale.value].heroTitle)
  const awards = computed(() => cloneAwards(portfolioProfileStore.value[locale.value].awards))
  const careerTimeline = computed(() =>
    cloneCareerTimeline(portfolioProfileStore.value[locale.value].careerTimeline),
  )
  const stackItems = computed(() =>
    cloneStackItems(portfolioProfileStore.value[locale.value].stackItems),
  )

  const portfolioCopy = computed<PortfolioCopySet>(() => ({
    ...portfolioCopyByLocale[locale.value],
    heroTitle: heroTitle.value,
  }))

  const profileShowcase = computed<ProfileShowcaseCopy>(() => ({
    ...profileShowcaseByLocale[locale.value],
    careerTimeline: careerTimeline.value,
    awards: awards.value,
  }))

  const stackDetail = computed<StackDetailCopy>(() => ({
    ...stackDetailByLocale[locale.value],
    items: stackItems.value,
  }))

  const stackTicker = computed<StackTickerCopy>(() => ({
    ...stackTickerByLocale[locale.value],
    items: toTickerItems(stackItems.value),
  }))

  const saveHeroTitle = (nextHeroTitle: string) => {
    portfolioProfileStore.value = {
      ...portfolioProfileStore.value,
      [locale.value]: {
        ...portfolioProfileStore.value[locale.value],
        heroTitle: nextHeroTitle.trim() || portfolioCopyByLocale[locale.value].heroTitle,
      },
    }

    persistPortfolioProfileStore()
  }

  const saveAwards = (nextAwards: AwardItem[]) => {
    portfolioProfileStore.value = {
      ...portfolioProfileStore.value,
      [locale.value]: {
        ...portfolioProfileStore.value[locale.value],
        awards: cloneAwards(nextAwards),
      },
    }

    persistPortfolioProfileStore()
  }

  const saveCareerTimeline = (nextCareerTimeline: CareerTimelineItem[]) => {
    portfolioProfileStore.value = {
      ...portfolioProfileStore.value,
      [locale.value]: {
        ...portfolioProfileStore.value[locale.value],
        careerTimeline: cloneCareerTimeline(nextCareerTimeline),
      },
    }

    persistPortfolioProfileStore()
  }

  const saveStackItems = (nextStackItems: StackDetailItem[]) => {
    portfolioProfileStore.value = {
      ...portfolioProfileStore.value,
      [locale.value]: {
        ...portfolioProfileStore.value[locale.value],
        stackItems: cloneStackItems(nextStackItems),
      },
    }

    persistPortfolioProfileStore()
  }

  const resetHeroTitle = () => {
    saveHeroTitle(portfolioCopyByLocale[locale.value].heroTitle)
  }

  const resetAwards = () => {
    saveAwards(profileShowcaseByLocale[locale.value].awards)
  }

  const resetCareerTimeline = () => {
    saveCareerTimeline(profileShowcaseByLocale[locale.value].careerTimeline)
  }

  const resetStackItems = () => {
    saveStackItems(stackDetailByLocale[locale.value].items)
  }

  const defaultHeroTitle = computed(() => portfolioCopyByLocale[locale.value].heroTitle)
  const defaultAwards = computed(() => cloneAwards(profileShowcaseByLocale[locale.value].awards))
  const defaultCareerTimeline = computed(() =>
    cloneCareerTimeline(profileShowcaseByLocale[locale.value].careerTimeline),
  )
  const defaultStackItems = computed(() => cloneStackItems(stackDetailByLocale[locale.value].items))

  return {
    heroTitle,
    awards,
    careerTimeline,
    stackItems,
    portfolioCopy,
    profileShowcase,
    stackDetail,
    stackTicker,
    defaultHeroTitle,
    defaultAwards,
    defaultCareerTimeline,
    defaultStackItems,
    saveHeroTitle,
    saveAwards,
    saveCareerTimeline,
    saveStackItems,
    resetHeroTitle,
    resetAwards,
    resetCareerTimeline,
    resetStackItems,
  }
}
