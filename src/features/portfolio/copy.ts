import type { Locale, PortfolioCopySet } from './types'

export const portfolioCopyByLocale: Record<Locale, PortfolioCopySet> = {
  ko: {
    navWork: '작업',
    navPrinciples: '원칙',
    navContact: '연락',
    eyebrow: '프론트엔드 엔지니어 · 프로덕트 경험 설계',
    heroTitle: '화이트 중심 블랙 미니멀, 명확함과 임팩트를 위해 설계합니다.',
    heroLead:
      '짙은 다크 그레이(#0f0f0f~#121212) 기반 위에 여백과 타이포를 정교하게 배치해, 사용자의 판단과 행동이 자연스럽게 이어지는 인터페이스를 만듭니다.',
    primaryCta: '주요 작업 보기',
    secondaryCta: '프로젝트 시작하기',
    metrics: [
      { label: '출시 프로젝트', value: '14+' },
      { label: '평균 Lighthouse', value: '96' },
      { label: '디자인+개발 경력', value: '7년' },
    ],
    workKicker: '주요 작업',
    workHeading: '비즈니스 성과로 검증된 최근 프로젝트입니다.',
    works: [
      {
        title: 'HLab 운영 대시보드',
        summary:
          '복잡한 운영 데이터를 의사결정 중심 구조로 재정렬해, 팀이 핵심 상태를 더 빠르게 파악하도록 개선했습니다.',
        impact: '업무 완료율 +31%',
        stack: ['Vue 3', 'TypeScript', 'ECharts'],
      },
      {
        title: '입학 모집 캠페인 랜딩',
        summary:
          '에디토리얼 구조와 CTA 흐름을 재설계해 콘텐츠 집중도를 높이고 문의 전환을 끌어올렸습니다.',
        impact: '문의 전환율 +22%',
        stack: ['Vite', 'A/B Testing', 'SEO'],
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
    eyebrow: 'Frontend Engineer · Product Experience',
    heroTitle: 'White-forward black minimal, built for clarity and impact.',
    heroLead:
      'I design interfaces on a deep dark base (#0f0f0f~#121212), using disciplined whitespace and typography to make every decision feel obvious.',
    primaryCta: 'View Selected Work',
    secondaryCta: 'Start a Project',
    metrics: [
      { label: 'Products shipped', value: '14+' },
      { label: 'Average Lighthouse', value: '96' },
      { label: 'Design + dev span', value: '7 years' },
    ],
    workKicker: 'Selected Work',
    workHeading: 'Recent projects with measurable business outcomes.',
    works: [
      {
        title: 'HLab Operations Dashboard',
        summary:
          'Reframed complex operational data into a decision-first interface with cleaner hierarchy and faster daily workflows.',
        impact: 'Task completion +31%',
        stack: ['Vue 3', 'TypeScript', 'ECharts'],
      },
      {
        title: 'Enrollment Campaign Landing',
        summary:
          'Built a high-conversion landing with editorial structure, focused CTA flow, and performance-safe motion.',
        impact: 'Inquiry conversion +22%',
        stack: ['Vite', 'A/B Testing', 'SEO'],
      },
      {
        title: 'Design System for Admin Suite',
        summary:
          'Standardized core UI blocks with tokenized spacing and typography to reduce design-dev mismatch.',
        impact: 'Feature delivery 1.8x faster',
        stack: ['Design Tokens', 'Storybook', 'CI'],
      },
    ],
    principlesKicker: 'Principles',
    principlesHeading: 'Less noise. More precision.',
    principlesBody:
      'My focus is to cut ambiguity from interfaces. Typography, spacing, and interaction all align to one goal: helping users decide quickly with confidence.',
    principles: [
      'Structure before decoration',
      'Readable first interaction',
      'Predictable component behavior',
      'Measurable performance gains',
    ],
    contactKicker: 'Open for collaborations',
    contactHeading: 'Let’s build focused digital products with strong visual discipline.',
    emailCta: 'Send Email',
    githubCta: 'View GitHub',
    footerName: 'Kim Minjae',
  },
}
