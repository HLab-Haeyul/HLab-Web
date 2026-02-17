import type { Locale, WorkThumbnailItem } from './types'

export const workThumbnailsByLocale: Record<Locale, WorkThumbnailItem[]> = {
  ko: [
    {
      imageSrc:
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Operations dashboard interface',
    },
    {
      imageSrc:
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Campaign landing page interface',
    },
    {
      imageSrc:
        'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Design system components interface',
    },
  ],
  en: [
    {
      imageSrc:
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Operations dashboard interface',
    },
    {
      imageSrc:
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Campaign landing page interface',
    },
    {
      imageSrc:
        'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Design system components interface',
    },
  ],
}
