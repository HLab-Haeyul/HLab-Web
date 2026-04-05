import type { Locale, WorkItem } from './types'
import clueMainImageSrc from '@/shared/assets/images/paletto banner.png'
import hlabLogoImageSrc from '@/shared/assets/images/logo.svg'
import sizzMainImageSrc from '@/shared/assets/images/SIZZ Image.png'

export const worksByLocale: Record<Locale, WorkItem[]> = {
  ko: [
    {
      title: 'HLab',
      summary: '개인 소프트웨어 연구실',
      impact: '업무 기록률 +31% 상승',
      stack: ['Vue 3', 'ECharts', 'FastAPI', 'Jenkins', 'GCP'],
      links: [
        { name: 'Git Repository (Web)', url: 'https://github.com/fixgramwork/HLab-Web' },
        { name: 'Git Repository (Backend)', url: 'https://github.com/fixgramwork/HLab-Backend' },
      ],
      imageSrc: hlabLogoImageSrc,
      imageAlt: 'HLab 로고',
    },
    {
      title: 'CLUE',
      summary: '클라우드 기반 통합 교육 서비스',
      impact: '기존 서비스 대비 사용자 이동 시간 80% 절약',
      stack: ['SpringBoot', 'Fastapi', 'AWS', 'GitAction'],
      links: [
        {
          name: 'Workspace Notion',
          url: 'https://victorious-secure-70d.notion.site/1c71a084dc46804aa4fafbff39fd7dd9?source=copy_link',
        },
        { name: 'Git Organization', url: 'https://github.com/SIZZ-Project' },
      ],
      imageSrc: clueMainImageSrc,
      imageAlt: '캠페인 랜딩 페이지 화면',
    },
    {
      title: 'SIZZ',
      summary: '신뢰성 있는 뉴스 플랫폼',
      impact: '일일 활성 사용자 +15%',
      stack: ['Next', 'TypeScript', 'Tailwind', 'Axios'],
      links: [
        {
          name: 'Workspace Notion',
          url: 'https://accurate-oak-9c7.notion.site/20c9223fac5380b98bf1f1c8882ab3e8?source=copy_link',
        },
        { name: 'Git Organization', url: 'https://github.com/SIZZ-Project' },
      ],
      imageSrc: sizzMainImageSrc,
      imageAlt: 'SIZZ 프로젝트 메인 화면',
    },
  ],
  en: [
    {
      title: 'HLab',
      summary: 'Personal software research lab',
      impact: 'Work logging rate +31%',
      stack: ['Vue 3', 'ECharts', 'FastAPI', 'Jenkins', 'GCP'],
      links: [
        { name: 'Git Repository (Web)', url: 'https://github.com/fixgramwork/HLab-Web' },
        { name: 'Git Repository (Backend)', url: 'https://github.com/fixgramwork/HLab-Backend' },
      ],
      imageSrc: hlabLogoImageSrc,
      imageAlt: 'HLab logo',
    },
    {
      title: 'CLUE',
      summary: 'Cloud-based integrated education service',
      impact: 'User navigation time reduced by 80%',
      stack: ['SpringBoot', 'Fastapi', 'AWS', 'GitAction'],
      links: [
        {
          name: 'Workspace Notion',
          url: 'https://victorious-secure-70d.notion.site/1c71a084dc46804aa4fafbff39fd7dd9?source=copy_link',
        },
        { name: 'Git Organization', url: 'https://github.com/SIZZ-Project' },
      ],
      imageSrc: clueMainImageSrc,
      imageAlt: 'Campaign landing page interface',
    },
    {
      title: 'SIZZ',
      summary: 'Reliable news platform',
      impact: 'Daily active users +15%',
      stack: ['Next', 'TypeScript', 'Tailwind', 'Axios'],
      links: [
        {
          name: 'Workspace Notion',
          url: 'https://accurate-oak-9c7.notion.site/20c9223fac5380b98bf1f1c8882ab3e8?source=copy_link',
        },
        { name: 'Git Organization', url: 'https://github.com/SIZZ-Project' },
      ],
      imageSrc: sizzMainImageSrc,
      imageAlt: 'SIZZ project main interface',
    },
  ],
}
