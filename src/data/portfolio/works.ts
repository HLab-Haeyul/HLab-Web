import type { Locale, WorkItem } from './types'

export const worksByLocale: Record<Locale, WorkItem[]> = {
  ko: [
    {
      title: 'HLab',
      summary: 'Personal software research lab',
      impact: 'Work logging rate +31%',
      stack: ['Vue 3', 'ECharts', 'FastAPI', 'Jenkins', 'GCP'],
      imageSrc:
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Operations dashboard interface',
    },
    {
      title: 'CLUE',
      summary: 'Cloud-based integrated education service',
      impact: 'Users save 30% more time than with the previous service',
      stack: ['SpringBoot', 'Fastapi', 'AWS', 'GitAction'],
      imageSrc:
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Campaign landing page interface',
    },
    {
      title: 'SIZZ',
      summary: 'Reliable news platform',
      impact: 'Daily active users +15%',
      stack: ['Next', 'TypeScript', 'Tailwind', 'Axios'],
      imageSrc:
        'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Design system components interface',
    },
  ],
  en: [
    {
      title: 'HLab',
      summary: 'Personal software research lab',
      impact: 'Work logging rate +31%',
      stack: ['Vue 3', 'ECharts', 'FastAPI', 'Jenkins', 'GCP'],
      imageSrc:
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Operations dashboard interface',
    },
    {
      title: 'CLUE',
      summary: 'Cloud-based integrated education service',
      impact: 'Users save 30% more time than with the previous service',
      stack: ['SpringBoot', 'Fastapi', 'AWS', 'GitAction'],
      imageSrc:
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Campaign landing page interface',
    },
    {
      title: 'SIZZ',
      summary: 'Reliable news platform',
      impact: 'Daily active users +15%',
      stack: ['Next', 'TypeScript', 'Tailwind', 'Axios'],
      imageSrc:
        'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Design system components interface',
    },
  ],
}
