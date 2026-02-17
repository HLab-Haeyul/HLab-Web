import { stackDetailByLocale } from './stackDetail'
import type { Locale, StackTickerCopy, StackTickerItem } from './types'

const toTickerItems = (locale: Locale): StackTickerItem[] =>
  stackDetailByLocale[locale].items.map((item) => ({
    icon: item.icon,
    imageSrc: item.imageSrc,
    imageAlt: item.imageAlt,
    label: item.label,
  }))

export const stackTickerByLocale: Record<Locale, StackTickerCopy> = {
  ko: {
    kicker: '기술 스택',
    heading: '실무에서 사용하는 도구와 기술',
    viewAllCta: '더보기',
    items: toTickerItems('ko'),
  },
  en: {
    kicker: 'Tech Stack',
    heading: 'Tools and technologies I use in production',
    viewAllCta: 'View all',
    items: toTickerItems('en'),
  },
}
