import type { CareerTimelineItem, Locale } from '@/entities/portfolio'

const toMonthIndex = (value: string) => {
  const match = /^(\d{4})-(\d{2})$/.exec(value.trim())

  if (!match) {
    return null
  }

  const year = Number.parseInt(match[1] ?? '', 10)
  const month = Number.parseInt(match[2] ?? '', 10)

  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) {
    return null
  }

  return year * 12 + (month - 1)
}

export const calculateCareerExperienceMonths = (items: CareerTimelineItem[]) => {
  const coveredMonths = new Set<number>()

  items.forEach((item) => {
    const startIndex = toMonthIndex(item.startedAt)
    const endIndex = toMonthIndex(item.endedAt ?? item.startedAt)

    if (startIndex === null || endIndex === null) {
      return
    }

    const from = Math.min(startIndex, endIndex)
    const to = Math.max(startIndex, endIndex)

    for (let current = from; current <= to; current += 1) {
      coveredMonths.add(current)
    }
  })

  return coveredMonths.size
}

export const formatCareerExperience = (locale: Locale, totalMonths: number) => {
  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12

  if (locale === 'en') {
    if (years > 0 && months > 0) {
      return `${years} yr ${months} mo`
    }

    if (years > 0) {
      return years === 1 ? '1 year' : `${years} years`
    }

    return months === 1 ? '1 month' : `${months} months`
  }

  if (years > 0 && months > 0) {
    return `${years}년 ${months}개월`
  }

  if (years > 0) {
    return `${years}년`
  }

  return `${months}개월`
}
