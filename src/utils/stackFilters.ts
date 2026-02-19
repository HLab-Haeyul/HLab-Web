import type { Locale, StackDetailItem } from '../data/stack/types'

export type StackSortOption =
  | 'default'
  | 'nameAsc'
  | 'categoryAsc'
  | 'proficiencyDesc'
  | 'capabilityDesc'

export type StackUiCopy = {
  sortLabel: string
  categoryLabel: string
  allCategory: string
  resetCta: string
  resultSuffix: string
  emptyMessage: string
}

export const buildStackSortOptions = (locale: Locale): Array<{ value: StackSortOption; label: string }> =>
  locale === 'ko'
    ? [
        { value: 'default', label: '기본 순서' },
        { value: 'nameAsc', label: '이름순' },
        { value: 'categoryAsc', label: '분야순' },
        { value: 'proficiencyDesc', label: '숙련도 높은순' },
        { value: 'capabilityDesc', label: '사용 경험 많은순' },
      ]
    : [
        { value: 'default', label: 'Default order' },
        { value: 'nameAsc', label: 'Name (A-Z)' },
        { value: 'categoryAsc', label: 'Category (A-Z)' },
        { value: 'proficiencyDesc', label: 'Highest proficiency' },
        { value: 'capabilityDesc', label: 'Most usage experience' },
      ]

export const buildStackUiCopy = (locale: Locale): StackUiCopy =>
  locale === 'ko'
    ? {
        sortLabel: '정렬',
        categoryLabel: '분야 필터',
        allCategory: '전체',
        resetCta: '필터 초기화',
        resultSuffix: '개 표시 중',
        emptyMessage: '조건에 맞는 기술 스택이 없습니다.',
      }
    : {
        sortLabel: 'Sort',
        categoryLabel: 'Category filter',
        allCategory: 'All',
        resetCta: 'Reset filters',
        resultSuffix: 'items shown',
        emptyMessage: 'No stack items match the selected filters.',
      }

export const buildCategoryOptions = (items: StackDetailItem[]) => {
  const orderedUnique = new Set(items.map((item) => item.category))
  return Array.from(orderedUnique)
}

const capabilityScore = (item: StackDetailItem) =>
  Number(item.capability.projectUsed) +
  Number(item.capability.practicalUsed) +
  Number(item.capability.internalsExplored)

const proficiencyRank = (locale: Locale, value: string) => {
  if (locale === 'ko') {
    const rankMap: Record<string, number> = {
      상: 5,
      중상: 4,
      중: 3,
      중하: 2,
      하: 1,
    }

    return rankMap[value] ?? 0
  }

  const normalized = value.toLowerCase()

  if (normalized.includes('advanced')) {
    return 5
  }

  if (normalized.includes('upper-intermediate')) {
    return 4
  }

  if (normalized.includes('intermediate')) {
    return 3
  }

  if (normalized.includes('beginner')) {
    return 1
  }

  return 0
}

type FilterArgs = {
  items: StackDetailItem[]
  locale: Locale
  selectedCategory: string
  onlyProjectUsed: boolean
  onlyPracticalUsed: boolean
  onlyInternalsExplored: boolean
  sortOption: StackSortOption
}

export const filterAndSortStackItems = ({
  items,
  locale,
  selectedCategory,
  onlyProjectUsed,
  onlyPracticalUsed,
  onlyInternalsExplored,
  sortOption,
}: FilterArgs) => {
  const filtered = items.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false
    }

    if (onlyProjectUsed && !item.capability.projectUsed) {
      return false
    }

    if (onlyPracticalUsed && !item.capability.practicalUsed) {
      return false
    }

    if (onlyInternalsExplored && !item.capability.internalsExplored) {
      return false
    }

    return true
  })

  const sorted = [...filtered]

  if (sortOption === 'nameAsc') {
    return sorted.sort((a, b) => a.label.localeCompare(b.label))
  }

  if (sortOption === 'categoryAsc') {
    return sorted.sort((a, b) => {
      const categoryCompare = a.category.localeCompare(b.category)

      if (categoryCompare !== 0) {
        return categoryCompare
      }

      return a.label.localeCompare(b.label)
    })
  }

  if (sortOption === 'proficiencyDesc') {
    return sorted.sort((a, b) => {
      const proficiencyCompare =
        proficiencyRank(locale, b.proficiency) - proficiencyRank(locale, a.proficiency)

      if (proficiencyCompare !== 0) {
        return proficiencyCompare
      }

      const capabilityCompare = capabilityScore(b) - capabilityScore(a)

      if (capabilityCompare !== 0) {
        return capabilityCompare
      }

      return a.label.localeCompare(b.label)
    })
  }

  if (sortOption === 'capabilityDesc') {
    return sorted.sort((a, b) => {
      const capabilityCompare = capabilityScore(b) - capabilityScore(a)

      if (capabilityCompare !== 0) {
        return capabilityCompare
      }

      const proficiencyCompare =
        proficiencyRank(locale, b.proficiency) - proficiencyRank(locale, a.proficiency)

      if (proficiencyCompare !== 0) {
        return proficiencyCompare
      }

      return a.label.localeCompare(b.label)
    })
  }

  return sorted
}
