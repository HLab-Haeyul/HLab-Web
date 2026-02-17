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
    kicker: 'Tech Stack',
    heading: 'Tools and technologies I use in production',
    viewAllCta: 'View all',
    items: toTickerItems('ko'),
  },
  en: {
    kicker: 'Tech Stack',
    heading: 'Tools and technologies I use in production',
    viewAllCta: 'View all',
    items: toTickerItems('en'),
  },
}
