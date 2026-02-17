import type { Locale, WorkItem } from './types'

export const worksByLocale: Record<Locale, WorkItem[]> = {
  ko: [
    {
      title: 'HLab',
      summary: '개인 소프트웨어 연구실',
      impact: '업무 기록률 +31% 상승',
      stack: ['Vue 3', 'ECharts', 'FastAPI', 'Jenkins', 'GCP'],
      imageSrc:
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
      imageAlt: '운영 대시보드 화면',
    },
    {
      title: 'CLUE',
      summary: '클라우드 기반 통합 교육 서비스',
      impact: '기존 서비스 대비 사용자 30% 시간 절약',
      stack: ['SpringBoot', 'Fastapi', 'AWS', 'GitAction'],
      imageSrc:
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
      imageAlt: '캠페인 랜딩 페이지 화면',
    },
    {
      title: 'SIZZ',
      summary: '신뢰성 있는 뉴스 플랫폼',
      impact: '일일 활성 사용자 +15%',
      stack: ['Next', 'TypeScript', 'Tailwind', 'Axios'],
      imageSrc:
        'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1200&q=80',
      imageAlt: '디자인 시스템 컴포넌트 화면',
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
