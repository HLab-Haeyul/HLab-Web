import type { Locale, WorkItem } from './types'
import clueMainImageSrc from '@/assets/images/paletto banner.png'
import hlabLogoImageSrc from '@/assets/images/logo.svg'
import sizzMainImageSrc from '@/assets/images/SIZZ Image.png'

export const worksByLocale: Record<Locale, WorkItem[]> = {
  ko: [
    {
      title: 'HLab',
      summary: '개인 소프트웨어 연구실',
      impact: '업무 기록률 +31% 상승',
      stack: ['Vue 3', 'ECharts', 'FastAPI', 'Jenkins', 'GCP'],
      role: '풀스택 개발자',
      contributions: [
        'Vue 3 기반 대시보드 구조를 설계하고 운영 화면을 구현했습니다.',
        'FastAPI API 설계와 Jenkins CI 파이프라인 자동화를 구축했습니다.',
        'GCP 배포 흐름과 운영 모니터링 환경을 정리했습니다.',
      ],
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
      role: '백엔드 · AI · 팀 리더 · 기획',
      contributions: [
        '서비스 아키텍쳐 설계',
        'AI 수업 자료 기능 개발',
        '보안 설계',
        '시간표 관리 기능 API 개발',
        'CI/CD 환경 설정',
        '서비스 기획',
      ],
      links: [
        {
          name: 'Workspace Notion',
          url: 'https://bssm.notion.site/Paletto-264f4899fc868056870de0c479446aca',
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
      role: '프론트엔드 개발자 · AI · 기술 결정자',
      contributions: [
        '프론트 뉴스 피드 화면 개발',
        '기사 분류 모델 개발',
      ],
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
      role: 'Full-Stack Developer',
      contributions: [
        'Designed the Vue 3 dashboard structure and implemented operations-facing UI screens.',
        'Built FastAPI endpoints and automated CI pipelines with Jenkins.',
        'Organized the GCP deployment flow and monitoring setup.',
      ],
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
      role: 'Backend, AI, Team Leader, and Planner',
      contributions: [
        'Implemented core Spring Boot APIs with authentication and authorization flows.',
        'Structured AWS infrastructure and deployment pipelines.',
        'Improved team productivity with Notion documentation and Git collaboration rules.',
      ],
      links: [
        {
          name: 'Workspace Notion',
          url: 'https://bssm.notion.site/Paletto-264f4899fc868056870de0c479446aca',
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
      role: 'Frontend Developer, AI, and Technical Decision Maker',
      contributions: [
        'Developed frontend news feed screens.',
        'Developed an article classification model.',
      ],
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
