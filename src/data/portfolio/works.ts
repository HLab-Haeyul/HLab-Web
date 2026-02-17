import type { Locale, WorkItem } from './types'

export const worksByLocale: Record<Locale, WorkItem[]> = {
  ko: [
    {
      title: 'HLab',
      summary: 'Personal software research lab',
      impact: 'Work logging rate +31%',
      stack: ['Vue 3', 'ECharts', 'FastAPI', 'Jenkins', 'GCP'],
    },
    {
      title: 'CLUE',
      summary: 'Cloud-based integrated education service',
      impact: 'Users save 30% more time than with the previous service',
      stack: ['SpringBoot', 'Fastapi', 'AWS', 'GitAction'],
    },
    {
      title: 'SIZZ',
      summary: 'Reliable news platform',
      impact: 'Daily active users +15%',
      stack: ['Next', 'TypeScript', 'Tailwind', 'Axios'],
    },
  ],
  en: [
    {
      title: 'HLab',
      summary: 'Personal software research lab',
      impact: 'Work logging rate +31%',
      stack: ['Vue 3', 'ECharts', 'FastAPI', 'Jenkins', 'GCP'],
    },
    {
      title: 'CLUE',
      summary: 'Cloud-based integrated education service',
      impact: 'Users save 30% more time than with the previous service',
      stack: ['SpringBoot', 'Fastapi', 'AWS', 'GitAction'],
    },
    {
      title: 'SIZZ',
      summary: 'Reliable news platform',
      impact: 'Daily active users +15%',
      stack: ['Next', 'TypeScript', 'Tailwind', 'Axios'],
    },
  ],
}
