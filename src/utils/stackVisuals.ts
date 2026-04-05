import { stackTickerByLocale } from '@/entities/stack'
import type { Locale, StackTickerItem } from '@/entities/stack'

const normalizeStackToken = (value: string) => value.toLocaleLowerCase().replace(/[^a-z0-9]/g, '')

const additionalStackVisuals: StackTickerItem[] = [
  {
    imageSrc: 'https://cdn.simpleicons.org/apacheecharts/aa344d',
    imageAlt: 'ECharts',
    label: 'ECharts',
  },
  {
    imageSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg',
    imageAlt: 'Jenkins',
    label: 'Jenkins',
  },
  {
    imageSrc: 'https://cdn.simpleicons.org/githubactions/2088ff',
    imageAlt: 'GitHub Actions',
    label: 'GitAction',
  },
  {
    imageSrc:
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
    imageAlt: 'Tailwind CSS',
    label: 'Tailwind',
  },
  {
    imageSrc: 'https://cdn.simpleicons.org/axios/5a29e4',
    imageAlt: 'Axios',
    label: 'Axios',
  },
]

const stackVisualMapByLocale: Partial<Record<Locale, Map<string, StackTickerItem>>> = {}

const getStackVisualMap = (locale: Locale) => {
  const cached = stackVisualMapByLocale[locale]

  if (cached) {
    return cached
  }

  const map = new Map<string, StackTickerItem>()
  const entries = [...stackTickerByLocale[locale].items, ...additionalStackVisuals]

  for (const entry of entries) {
    map.set(normalizeStackToken(entry.label), entry)
  }

  stackVisualMapByLocale[locale] = map
  return map
}

export const resolveStackVisual = (locale: Locale, stackLabel: string): StackTickerItem =>
  getStackVisualMap(locale).get(normalizeStackToken(stackLabel)) ?? { label: stackLabel }
