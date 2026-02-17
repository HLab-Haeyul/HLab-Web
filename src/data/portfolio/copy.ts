import type { Locale, PortfolioCopySet } from './types'

export const portfolioCopyByLocale: Record<Locale, PortfolioCopySet> = {
  ko: {
    navWork: '작업',
    navPrinciples: '원칙',
    navContact: '연락',
    eyebrow: '백엔드 엔지니어 · 악성코드 분석가',
    heroTitle: '무한한 공학의 세계',
    heroLead:
      '공학은 무한한 탐구의 여정입니다. 저는 이 여정에서 매일 새로운 도전을 즐기며, 깊이 있는 분석과 창의적인 솔루션을 통해 문제를 해결하는 것을 좋아합니다.',
    primaryCta: '주요 작업 보기',
    secondaryCta: '프로젝트 시작하기',
    metrics: [
      { label: '출시 프로젝트', value: '1' },
      { label: '평균 Lighthouse', value: '96' },
      { label: '보안+개발 경력', value: '0년' },
    ],
    workKicker: '주요 작업',
    workHeading: '비즈니스 성과로 검증된 최근 프로젝트입니다.',
    works: [
      {
        title: 'HLab 운영 대시보드',
        summary:
          '복잡한 운영 데이터를 의사결정 중심 구조로 재정렬해, 팀이 핵심 상태를 더 빠르게 파악하도록 개선했습니다.',
        impact: '업무 완료율 +31%',
        stack: ['Vue 3', 'ECharts', 'FastAPI', 'Jenkins', 'GCP'],
      },
      {
        title: 'CLUE',
        summary:
          '클라우드 기반 통합 교육 서비스',
        impact: '문의 전환율 +22%',
        stack: ['React', 'SpringBoot', 'Fastapi', 'AWS', 'GitAction'],
      },
      {
        title: '관리자 디자인 시스템',
        summary:
          '간격/타이포/컴포넌트 규칙을 토큰 기반으로 표준화해 디자인-개발 간 오차를 크게 줄였습니다.',
        impact: '기능 출시 속도 1.8배',
        stack: ['Design Tokens', 'Storybook', 'CI'],
      },
    ],
    principlesKicker: '원칙',
    principlesHeading: '잡음을 줄이고, 의도를 선명하게.',
    principlesBody:
      '제 작업의 핵심은 화면에서 애매함을 제거하는 것입니다. 타이포, 간격, 인터랙션을 한 방향으로 정렬해 사용자가 빠르고 확신 있게 결정하도록 돕습니다.',
    principles: [
      '장식보다 구조를 먼저 설계',
      '첫 화면 가독성을 최우선',
      '컴포넌트 동작의 예측 가능성',
      '측정 가능한 성능 개선',
    ],
    contactKicker: '협업 문의',
    contactHeading: '높은 완성도의 블랙 미니멀 제품 경험을 함께 만듭니다.',
    emailCta: '이메일 보내기',
    githubCta: 'GitHub 보기',
    footerName: '김민재',
  },
  en: {
    navWork: 'Work',
    navPrinciples: 'Principles',
    navContact: 'Contact',
    eyebrow: 'Backend Engineer · Malware Analyst',
    heroTitle: 'The Infinite World of Engineering',
    heroLead:
      'Engineering is an endless journey of exploration. On this journey, I enjoy taking on new challenges every day and solving problems through in-depth analysis and creative solutions.',
    primaryCta: 'View Key Projects',
    secondaryCta: 'Start a Project',
    metrics: [
      { label: 'Shipped Projects', value: '1' },
      { label: 'Average Lighthouse', value: '96' },
      { label: 'Security + Development Experience', value: '0 years' },
    ],
    workKicker: 'Key Projects',
    workHeading: 'Recent projects validated by business outcomes.',
    works: [
      {
        title: 'HLab Operations Dashboard',
        summary:
          'Restructured complex operational data into a decision-focused architecture so the team can identify critical status faster.',
        impact: 'Task completion +31%',
        stack: ['Vue 3', 'ECharts', 'FastAPI', 'Jenkins', 'GCP'],
      },
      {
        title: 'CLUE',
        summary:
          'Cloud-based integrated education service',
        impact: 'Inquiry conversion +22%',
        stack: ['React', 'SpringBoot', 'Fastapi', 'AWS', 'GitAction'],
      },
      {
        title: 'Admin Design System',
        summary:
          'Standardized spacing, typography, and component rules with a token-based system to significantly reduce design-development mismatches.',
        impact: 'Feature delivery 1.8x faster',
        stack: ['Design Tokens', 'Storybook', 'CI'],
      },
    ],
    principlesKicker: 'Principles',
    principlesHeading: 'Reduce noise, clarify intent.',
    principlesBody:
      'The core of my work is removing ambiguity from the screen. I align typography, spacing, and interaction in one direction to help users make fast and confident decisions.',
    principles: [
      'Design structure before decoration',
      'Prioritize first-screen readability',
      'Predictable component behavior',
      'Measurable performance improvements',
    ],
    contactKicker: 'Collaboration Inquiry',
    contactHeading: 'Let’s build highly polished black-minimal product experiences together.',
    emailCta: 'Send an Email',
    githubCta: 'View GitHub',
    footerName: 'Kim Minjae',
  },
}
