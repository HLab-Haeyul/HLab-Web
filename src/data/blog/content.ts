import type { Locale } from '../portfolio/types'

export type BlogCategoryKey = 'tech' | 'retrospective' | 'selfDev'

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  publishedAt: string
  readTime: string
  tags: string[]
  category: BlogCategoryKey
}

export type PopularPost = BlogPost & {
  heroTag: string
  highlight: string
  bannerBackground: string
}

export type BlogCategoryCopy = {
  title: string
  description: string
}

export type BlogPageCopySet = {
  kicker: string
  heading: string
  description: string
  popularKicker: string
  popularHeading: string
  popularDescription: string
  readLabel: string
  categories: Record<BlogCategoryKey, BlogCategoryCopy>
  popularPosts: PopularPost[]
  posts: BlogPost[]
}

export type BlogPostDetail = BlogPost & {
  heroTag: string
  authorName: string
  content: string[]
}

export type BlogComment = {
  id: string
  authorName: string
  body: string
  createdAt: string
}

export const BLOG_CATEGORY_KEYS: BlogCategoryKey[] = ['tech', 'retrospective', 'selfDev']

export const blogPageCopyByLocale: Record<Locale, BlogPageCopySet> = {
  ko: {
    kicker: 'STUDY ARCHIVE',
    heading: '내가 공부한 기록을 쌓는 블로그',
    description:
      '기술 실험, 프로젝트 회고, 자기 개발 루틴을 한 곳에 정리합니다. 핵심만 빠르게 읽을 수 있도록 짧고 선명하게 기록합니다.',
    popularKicker: '인기 글',
    popularHeading: '많이 읽힌 글 5개',
    popularDescription: '배너를 좌우로 넘기며 최근 인기 글을 확인하세요.',
    readLabel: '글 읽기',
    categories: {
      tech: {
        title: '기술',
        description: '실제 개발 과정에서 검증한 기술 선택과 구현 방법을 정리합니다.',
      },
      retrospective: {
        title: '프로젝트 회고',
        description: '프로젝트 목표, 시행착오, 개선 포인트를 회고 형식으로 기록합니다.',
      },
      selfDev: {
        title: '자기 개발',
        description: '학습 습관, 커리어 성장 전략, 실행 루틴을 공유합니다.',
      },
    },
    popularPosts: [
      {
        slug: 'vue-state-pitfalls',
        title: 'Vue 상태 관리에서 자주 놓치는 경계선',
        excerpt: '컴포넌트 분리와 상태 소유권을 기준으로 유지보수 비용을 줄인 사례를 정리했습니다.',
        publishedAt: '2026.02.11',
        readTime: '7분',
        tags: ['Vue', 'Architecture', 'State'],
        category: 'tech',
        heroTag: 'Tech Deep Dive',
        highlight: '복잡한 상태 흐름을 단순화한 구조 개선 노트',
        bannerBackground:
          'linear-gradient(135deg, rgba(35,35,35,0.96) 0%, rgba(22,22,22,0.92) 55%, rgba(12,12,12,0.92) 100%)',
      },
      {
        slug: 'docker-deploy-retro',
        title: '첫 배포 파이프라인 회고: Docker 기반 자동화',
        excerpt: '배포 실패 원인을 단계별로 추적하고 안정화한 체크리스트를 담았습니다.',
        publishedAt: '2026.02.07',
        readTime: '6분',
        tags: ['Docker', 'CI/CD', 'Retrospective'],
        category: 'retrospective',
        heroTag: 'Project Retro',
        highlight: '실패 로그에서 찾은 재현 가능한 운영 기준',
        bannerBackground:
          'linear-gradient(132deg, rgba(41,41,41,0.95) 0%, rgba(25,25,25,0.92) 50%, rgba(12,12,12,0.9) 100%)',
      },
      {
        slug: 'deep-work-routine',
        title: '하루 2시간 집중 학습 루틴 설계 방법',
        excerpt: '방해 요소를 줄이고 꾸준함을 만든 개인 학습 시스템을 소개합니다.',
        publishedAt: '2026.02.01',
        readTime: '5분',
        tags: ['Self Development', 'Routine'],
        category: 'selfDev',
        heroTag: 'Growth Habit',
        highlight: '짧은 시간에도 성과를 내는 학습 루프',
        bannerBackground:
          'linear-gradient(128deg, rgba(36,36,36,0.94) 0%, rgba(19,19,19,0.92) 52%, rgba(10,10,10,0.9) 100%)',
      },
      {
        slug: 'express-error-handling',
        title: 'Express 에러 핸들링 레이어 표준화',
        excerpt: '에러 응답 포맷을 통일해 디버깅 시간을 줄인 API 구조를 정리했습니다.',
        publishedAt: '2026.01.26',
        readTime: '8분',
        tags: ['Node.js', 'Express', 'Backend'],
        category: 'tech',
        heroTag: 'Backend Pattern',
        highlight: '운영 단계에서 바로 쓰는 예외 처리 규칙',
        bannerBackground:
          'linear-gradient(136deg, rgba(38,38,38,0.95) 0%, rgba(22,22,22,0.92) 48%, rgba(11,11,11,0.9) 100%)',
      },
      {
        slug: 'portfolio-v1-retro',
        title: '포트폴리오 V1 제작 회고와 V2 개선 계획',
        excerpt: '초기 버전의 한계와 다음 릴리스에서 우선순위로 잡은 개선 항목을 기록했습니다.',
        publishedAt: '2026.01.20',
        readTime: '6분',
        tags: ['Portfolio', 'Planning', 'Retrospective'],
        category: 'retrospective',
        heroTag: 'Release Journal',
        highlight: '완성보다 개선 주기를 빠르게 만든 의사결정',
        bannerBackground:
          'linear-gradient(140deg, rgba(45,45,45,0.95) 0%, rgba(26,26,26,0.92) 53%, rgba(11,11,11,0.9) 100%)',
      },
    ],
    posts: [
      {
        slug: 'vue-state-pitfalls',
        title: 'Vue 상태 관리에서 자주 놓치는 경계선',
        excerpt: '컴포넌트 분리와 상태 소유권을 기준으로 유지보수 비용을 줄인 사례를 정리했습니다.',
        publishedAt: '2026.02.11',
        readTime: '7분',
        tags: ['Vue', 'Architecture', 'State'],
        category: 'tech',
      },
      {
        slug: 'vue-state-pitfalls',
        title: 'Vue 상태 관리에서 자주 놓치는 경계선',
        excerpt: '컴포넌트 분리와 상태 소유권을 기준으로 유지보수 비용을 줄인 사례를 정리했습니다.',
        publishedAt: '2026.02.11',
        readTime: '7분',
        tags: ['Vue', 'Architecture', 'State'],
        category: 'tech',
      },
      {
        slug: 'vue-state-pitfalls',
        title: 'Vue 상태 관리에서 자주 놓치는 경계선',
        excerpt: '컴포넌트 분리와 상태 소유권을 기준으로 유지보수 비용을 줄인 사례를 정리했습니다.',
        publishedAt: '2026.02.11',
        readTime: '7분',
        tags: ['Vue', 'Architecture', 'State'],
        category: 'tech',
      },
      {
        slug: 'vue-state-pitfalls',
        title: 'Vue 상태 관리에서 자주 놓치는 경계선',
        excerpt: '컴포넌트 분리와 상태 소유권을 기준으로 유지보수 비용을 줄인 사례를 정리했습니다.',
        publishedAt: '2026.02.11',
        readTime: '7분',
        tags: ['Vue', 'Architecture', 'State'],
        category: 'tech',
      },
      {
        slug: 'vue-state-pitfalls',
        title: 'Vue 상태 관리에서 자주 놓치는 경계선',
        excerpt: '컴포넌트 분리와 상태 소유권을 기준으로 유지보수 비용을 줄인 사례를 정리했습니다.',
        publishedAt: '2026.02.11',
        readTime: '7분',
        tags: ['Vue', 'Architecture', 'State'],
        category: 'tech',
      },
      {
        slug: 'vue-state-pitfalls',
        title: 'Vue 상태 관리에서 자주 놓치는 경계선',
        excerpt: '컴포넌트 분리와 상태 소유권을 기준으로 유지보수 비용을 줄인 사례를 정리했습니다.',
        publishedAt: '2026.02.11',
        readTime: '7분',
        tags: ['Vue', 'Architecture', 'State'],
        category: 'tech',
      },
      {
        slug: 'vue-state-pitfalls',
        title: 'Vue 상태 관리에서 자주 놓치는 경계선',
        excerpt: '컴포넌트 분리와 상태 소유권을 기준으로 유지보수 비용을 줄인 사례를 정리했습니다.',
        publishedAt: '2026.02.11',
        readTime: '7분',
        tags: ['Vue', 'Architecture', 'State'],
        category: 'tech',
      },
      {
        slug: 'express-error-handling',
        title: 'Express 에러 핸들링 레이어 표준화',
        excerpt: '에러 응답 포맷을 통일해 디버깅 시간을 줄인 API 구조를 정리했습니다.',
        publishedAt: '2026.01.26',
        readTime: '8분',
        tags: ['Node.js', 'Express', 'Backend'],
        category: 'tech',
      },
      {
        slug: 'docker-deploy-retro',
        title: '첫 배포 파이프라인 회고: Docker 기반 자동화',
        excerpt: '배포 실패 원인을 단계별로 추적하고 안정화한 체크리스트를 담았습니다.',
        publishedAt: '2026.02.07',
        readTime: '6분',
        tags: ['Docker', 'CI/CD', 'Retrospective'],
        category: 'retrospective',
      },
      {
        slug: 'portfolio-v1-retro',
        title: '포트폴리오 V1 제작 회고와 V2 개선 계획',
        excerpt: '초기 버전의 한계와 다음 릴리스에서 우선순위로 잡은 개선 항목을 기록했습니다.',
        publishedAt: '2026.01.20',
        readTime: '6분',
        tags: ['Portfolio', 'Planning', 'Retrospective'],
        category: 'retrospective',
      },
      {
        slug: 'deep-work-routine',
        title: '하루 2시간 집중 학습 루틴 설계 방법',
        excerpt: '방해 요소를 줄이고 꾸준함을 만든 개인 학습 시스템을 소개합니다.',
        publishedAt: '2026.02.01',
        readTime: '5분',
        tags: ['Self Development', 'Routine'],
        category: 'selfDev',
      },
      {
        slug: 'reading-note-system',
        title: '기술 서적을 실무 자산으로 바꾸는 독서 노트 구조',
        excerpt: '읽고 끝나는 독서가 아니라 구현으로 이어지는 정리 템플릿을 공유합니다.',
        publishedAt: '2026.01.15',
        readTime: '4분',
        tags: ['Learning', 'Documentation'],
        category: 'selfDev',
      },
    ],
  },
  en: {
    kicker: 'STUDY ARCHIVE',
    heading: 'A blog to track what I learn',
    description:
      'I archive technical experiments, project retrospectives, and growth routines in one place. Each post is short and focused for quick reading.',
    popularKicker: 'Popular Posts',
    popularHeading: 'Top 5 Most Read',
    popularDescription: 'Slide through the banner to browse the most popular posts.',
    readLabel: 'Read Post',
    categories: {
      tech: {
        title: 'Tech',
        description: 'Practical implementation notes and decisions validated in real projects.',
      },
      retrospective: {
        title: 'Project Retrospective',
        description: 'What worked, what failed, and what to improve in upcoming iterations.',
      },
      selfDev: {
        title: 'Self Development',
        description: 'Learning routines, career growth strategy, and personal execution systems.',
      },
    },
    popularPosts: [
      {
        slug: 'vue-state-pitfalls',
        title: 'Boundaries People Miss in Vue State Management',
        excerpt: 'A practical note on reducing maintenance cost by clarifying component ownership.',
        publishedAt: '2026.02.11',
        readTime: '7 min',
        tags: ['Vue', 'Architecture', 'State'],
        category: 'tech',
        heroTag: 'Tech Deep Dive',
        highlight: 'A structure update that simplified state flow complexity',
        bannerBackground:
          'linear-gradient(135deg, rgba(35,35,35,0.96) 0%, rgba(22,22,22,0.92) 55%, rgba(12,12,12,0.92) 100%)',
      },
      {
        slug: 'docker-deploy-retro',
        title: 'First Deployment Pipeline Retro: Docker Automation',
        excerpt: 'How we tracked failure points and built a stable release checklist step by step.',
        publishedAt: '2026.02.07',
        readTime: '6 min',
        tags: ['Docker', 'CI/CD', 'Retrospective'],
        category: 'retrospective',
        heroTag: 'Project Retro',
        highlight: 'Operational standards extracted from failure logs',
        bannerBackground:
          'linear-gradient(132deg, rgba(41,41,41,0.95) 0%, rgba(25,25,25,0.92) 50%, rgba(12,12,12,0.9) 100%)',
      },
      {
        slug: 'deep-work-routine',
        title: 'How I Designed a 2-Hour Daily Deep Work Routine',
        excerpt: 'A personal system to remove distractions and stay consistent.',
        publishedAt: '2026.02.01',
        readTime: '5 min',
        tags: ['Self Development', 'Routine'],
        category: 'selfDev',
        heroTag: 'Growth Habit',
        highlight: 'A compact learning loop that still produces visible outcomes',
        bannerBackground:
          'linear-gradient(128deg, rgba(36,36,36,0.94) 0%, rgba(19,19,19,0.92) 52%, rgba(10,10,10,0.9) 100%)',
      },
      {
        slug: 'express-error-handling',
        title: 'Standardizing Express Error Handling Layers',
        excerpt: 'A backend pattern that made API debugging faster in production.',
        publishedAt: '2026.01.26',
        readTime: '8 min',
        tags: ['Node.js', 'Express', 'Backend'],
        category: 'tech',
        heroTag: 'Backend Pattern',
        highlight: 'Exception handling rules you can apply right away',
        bannerBackground:
          'linear-gradient(136deg, rgba(38,38,38,0.95) 0%, rgba(22,22,22,0.92) 48%, rgba(11,11,11,0.9) 100%)',
      },
      {
        slug: 'portfolio-v1-retro',
        title: 'Portfolio V1 Retrospective and V2 Upgrade Plan',
        excerpt: 'A release journal of limitations, priorities, and next-step decisions.',
        publishedAt: '2026.01.20',
        readTime: '6 min',
        tags: ['Portfolio', 'Planning', 'Retrospective'],
        category: 'retrospective',
        heroTag: 'Release Journal',
        highlight: 'Decision-making that optimized iteration speed over perfection',
        bannerBackground:
          'linear-gradient(140deg, rgba(45,45,45,0.95) 0%, rgba(26,26,26,0.92) 53%, rgba(11,11,11,0.9) 100%)',
      },
    ],
    posts: [
      {
        slug: 'vue-state-pitfalls',
        title: 'Boundaries People Miss in Vue State Management',
        excerpt: 'A practical note on reducing maintenance cost by clarifying component ownership.',
        publishedAt: '2026.02.11',
        readTime: '7 min',
        tags: ['Vue', 'Architecture', 'State'],
        category: 'tech',
      },
      {
        slug: 'express-error-handling',
        title: 'Standardizing Express Error Handling Layers',
        excerpt: 'A backend pattern that made API debugging faster in production.',
        publishedAt: '2026.01.26',
        readTime: '8 min',
        tags: ['Node.js', 'Express', 'Backend'],
        category: 'tech',
      },
      {
        slug: 'docker-deploy-retro',
        title: 'First Deployment Pipeline Retro: Docker Automation',
        excerpt: 'How we tracked failure points and built a stable release checklist step by step.',
        publishedAt: '2026.02.07',
        readTime: '6 min',
        tags: ['Docker', 'CI/CD', 'Retrospective'],
        category: 'retrospective',
      },
      {
        slug: 'portfolio-v1-retro',
        title: 'Portfolio V1 Retrospective and V2 Upgrade Plan',
        excerpt: 'A release journal of limitations, priorities, and next-step decisions.',
        publishedAt: '2026.01.20',
        readTime: '6 min',
        tags: ['Portfolio', 'Planning', 'Retrospective'],
        category: 'retrospective',
      },
      {
        slug: 'deep-work-routine',
        title: 'How I Designed a 2-Hour Daily Deep Work Routine',
        excerpt: 'A personal system to remove distractions and stay consistent.',
        publishedAt: '2026.02.01',
        readTime: '5 min',
        tags: ['Self Development', 'Routine'],
        category: 'selfDev',
      },
      {
        slug: 'reading-note-system',
        title: 'Turning Reading Notes into Practical Assets',
        excerpt: 'A template to turn books into implementation-ready knowledge.',
        publishedAt: '2026.01.15',
        readTime: '4 min',
        tags: ['Learning', 'Documentation'],
        category: 'selfDev',
      },
    ],
  },
}

export const blogPostDetailsByLocale: Record<Locale, Record<string, BlogPostDetail>> = {
  ko: {
    'vue-state-pitfalls': {
      slug: 'vue-state-pitfalls',
      title: 'Vue 상태 관리에서 자주 놓치는 경계선',
      excerpt: '컴포넌트 분리와 상태 소유권을 기준으로 유지보수 비용을 줄인 사례를 정리했습니다.',
      publishedAt: '2026.02.11',
      readTime: '7분',
      tags: ['Vue', 'Architecture', 'State'],
      category: 'tech',
      heroTag: 'Tech Deep Dive',
      authorName: '김민재',
      content: [
        '상태 관리는 도구 선택보다 경계 정의가 먼저입니다. 이번 프로젝트에서는 상태를 페이지 전역, 기능 단위, 컴포넌트 로컬로 나누고 각 레벨에서 소유권을 명확히 했습니다.',
        '문제가 됐던 지점은 한 화면에서 같은 상태를 여러 컴포넌트가 직접 수정하던 구조였습니다. 이벤트 흐름을 단방향으로 바꾸고, 쓰기 권한을 한 곳으로 모으면서 예외 케이스가 크게 줄었습니다.',
        '핵심은 상태를 어디에 저장하느냐보다 누가 변경할 수 있느냐를 먼저 결정하는 것입니다. 이 기준만 세워도 디버깅 시간과 회귀 버그가 눈에 띄게 줄어듭니다.',
      ],
    },
    'express-error-handling': {
      slug: 'express-error-handling',
      title: 'Express 에러 핸들링 레이어 표준화',
      excerpt: '에러 응답 포맷을 통일해 디버깅 시간을 줄인 API 구조를 정리했습니다.',
      publishedAt: '2026.01.26',
      readTime: '8분',
      tags: ['Node.js', 'Express', 'Backend'],
      category: 'tech',
      heroTag: 'Backend Pattern',
      authorName: '김민재',
      content: [
        '운영 환경에서 가장 큰 비용은 에러 재현 시간입니다. 그래서 에러 타입, 사용자 메시지, 로그 메시지, 추적 ID를 한 포맷으로 고정했습니다.',
        '컨트롤러에서는 비즈니스 예외만 던지고, 공통 에러 미들웨어에서 응답 구조를 최종 확정하게 했습니다. 덕분에 에러 처리 코드가 분산되지 않고 테스트도 단순해졌습니다.',
        '에러 설계는 기능 개발 이후가 아니라 API 설계 단계에서 같이 정의해야 효과가 큽니다. 초기에 표준을 만드는 편이 장기적으로 훨씬 저렴했습니다.',
      ],
    },
    'docker-deploy-retro': {
      slug: 'docker-deploy-retro',
      title: '첫 배포 파이프라인 회고: Docker 기반 자동화',
      excerpt: '배포 실패 원인을 단계별로 추적하고 안정화한 체크리스트를 담았습니다.',
      publishedAt: '2026.02.07',
      readTime: '6분',
      tags: ['Docker', 'CI/CD', 'Retrospective'],
      category: 'retrospective',
      heroTag: 'Project Retro',
      authorName: '김민재',
      content: [
        '첫 배포에서 가장 많이 실패한 지점은 환경 변수 누락과 이미지 태그 관리였습니다. 문제를 재현 가능한 체크리스트로 변환하면서 배포 성공률이 빠르게 올라갔습니다.',
        '파이프라인 단계마다 성공 조건과 롤백 조건을 명시해 두니 장애 대응이 빨라졌습니다. 특히 컨테이너 헬스체크를 배포 기준에 포함한 것이 효과가 컸습니다.',
        '회고의 목적은 실패를 기록하는 것이 아니라 다음 실행을 더 빠르게 만드는 것입니다. 그래서 문서는 길게 쓰기보다 실행 기준 중심으로 압축했습니다.',
      ],
    },
    'portfolio-v1-retro': {
      slug: 'portfolio-v1-retro',
      title: '포트폴리오 V1 제작 회고와 V2 개선 계획',
      excerpt: '초기 버전의 한계와 다음 릴리스에서 우선순위로 잡은 개선 항목을 기록했습니다.',
      publishedAt: '2026.01.20',
      readTime: '6분',
      tags: ['Portfolio', 'Planning', 'Retrospective'],
      category: 'retrospective',
      heroTag: 'Release Journal',
      authorName: '김민재',
      content: [
        'V1은 완성보다 출시 속도를 우선으로 두고 제작했습니다. 덕분에 실제 사용자 반응을 빠르게 수집할 수 있었지만, 구조적 일관성은 부족한 부분이 있었습니다.',
        'V2에서는 컴포넌트 재사용성과 데이터 분리 정책을 우선순위로 두었습니다. 화면을 먼저 고치기보다 데이터 흐름을 먼저 정리해 유지보수 비용을 줄였습니다.',
        '회고에서 가장 중요한 건 개선 항목의 개수보다 순서입니다. 효과가 큰 항목을 앞에 두고 반복 주기를 짧게 유지하는 전략이 유효했습니다.',
      ],
    },
    'deep-work-routine': {
      slug: 'deep-work-routine',
      title: '하루 2시간 집중 학습 루틴 설계 방법',
      excerpt: '방해 요소를 줄이고 꾸준함을 만든 개인 학습 시스템을 소개합니다.',
      publishedAt: '2026.02.01',
      readTime: '5분',
      tags: ['Self Development', 'Routine'],
      category: 'selfDev',
      heroTag: 'Growth Habit',
      authorName: '김민재',
      content: [
        '루틴의 핵심은 의지보다 환경입니다. 집중 시간을 확보하기 위해 시작 시간을 고정하고, 시작 전 10분 준비 작업을 템플릿으로 만들었습니다.',
        '학습은 입력과 출력이 균형을 이뤄야 오래 갑니다. 읽은 내용을 바로 코드나 문서로 정리하는 습관이 학습 속도를 높였습니다.',
        '짧더라도 매일 이어지는 루프가 중요합니다. 2시간을 완벽히 채우는 것보다 다음 날 다시 시작할 수 있는 구조를 만드는 데 집중했습니다.',
      ],
    },
    'reading-note-system': {
      slug: 'reading-note-system',
      title: '기술 서적을 실무 자산으로 바꾸는 독서 노트 구조',
      excerpt: '읽고 끝나는 독서가 아니라 구현으로 이어지는 정리 템플릿을 공유합니다.',
      publishedAt: '2026.01.15',
      readTime: '4분',
      tags: ['Learning', 'Documentation'],
      category: 'selfDev',
      heroTag: 'Learning System',
      authorName: '김민재',
      content: [
        '독서 노트는 요약보다 적용 중심으로 작성해야 실무에서 살아남습니다. 핵심 개념, 적용 가능한 상황, 바로 시도할 액션으로 나눠 기록했습니다.',
        '노트를 많이 쌓는 것보다 검색 가능한 구조로 유지하는 것이 더 중요합니다. 태그 규칙을 고정해 나중에 재사용 가능한 지식 베이스로 만들었습니다.',
        '결국 좋은 노트는 나중에 읽기 위한 문서가 아니라, 다음 행동을 바로 시작하게 만드는 실행 문서였습니다.',
      ],
    },
  },
  en: {
    'vue-state-pitfalls': {
      slug: 'vue-state-pitfalls',
      title: 'Boundaries People Miss in Vue State Management',
      excerpt: 'A practical note on reducing maintenance cost by clarifying component ownership.',
      publishedAt: '2026.02.11',
      readTime: '7 min',
      tags: ['Vue', 'Architecture', 'State'],
      category: 'tech',
      heroTag: 'Tech Deep Dive',
      authorName: 'Kim Minjae',
      content: [
        'State management starts with boundary definition, not tool selection. In this project, state ownership was split into page-level, feature-level, and local component scopes.',
        'The major issue came from multiple components mutating the same state directly. Moving back to a strict one-way flow and centralizing write access reduced edge-case bugs immediately.',
        'The key question is who can modify the state. Once that rule is clear, debugging becomes simpler and regressions are easier to prevent.',
      ],
    },
    'express-error-handling': {
      slug: 'express-error-handling',
      title: 'Standardizing Express Error Handling Layers',
      excerpt: 'A backend pattern that made API debugging faster in production.',
      publishedAt: '2026.01.26',
      readTime: '8 min',
      tags: ['Node.js', 'Express', 'Backend'],
      category: 'tech',
      heroTag: 'Backend Pattern',
      authorName: 'Kim Minjae',
      content: [
        'In production systems, the biggest cost of errors is reproduction time. I standardized error type, user message, log message, and trace ID into one response contract.',
        'Controllers now throw only business exceptions, and the global middleware finalizes the output format. This reduced duplicated logic and made tests easier to write.',
        'Error design should be done early with API design, not as cleanup work later. The upfront investment paid off quickly.',
      ],
    },
    'docker-deploy-retro': {
      slug: 'docker-deploy-retro',
      title: 'First Deployment Pipeline Retro: Docker Automation',
      excerpt: 'How we tracked failure points and built a stable release checklist step by step.',
      publishedAt: '2026.02.07',
      readTime: '6 min',
      tags: ['Docker', 'CI/CD', 'Retrospective'],
      category: 'retrospective',
      heroTag: 'Project Retro',
      authorName: 'Kim Minjae',
      content: [
        'The first deployment failed mostly because of missing environment variables and unclear image tagging rules. Converting those failures into a reproducible checklist improved stability fast.',
        'Defining success and rollback criteria per pipeline step made incident response much faster. Container health checks were the most useful gate.',
        'The value of a retrospective is not documentation volume, but faster next execution. The checklist format worked better than long narratives.',
      ],
    },
    'portfolio-v1-retro': {
      slug: 'portfolio-v1-retro',
      title: 'Portfolio V1 Retrospective and V2 Upgrade Plan',
      excerpt: 'A release journal of limitations, priorities, and next-step decisions.',
      publishedAt: '2026.01.20',
      readTime: '6 min',
      tags: ['Portfolio', 'Planning', 'Retrospective'],
      category: 'retrospective',
      heroTag: 'Release Journal',
      authorName: 'Kim Minjae',
      content: [
        'V1 prioritized release speed over perfection. That decision helped collect user feedback early, but also exposed structural inconsistencies.',
        'For V2, I focused on component reuse and data ownership first. Cleaning the flow before visual updates reduced maintenance cost significantly.',
        'Retrospectives are most useful when priorities are explicit. A shorter iteration loop with fewer high-impact tasks worked better than broad TODO lists.',
      ],
    },
    'deep-work-routine': {
      slug: 'deep-work-routine',
      title: 'How I Designed a 2-Hour Daily Deep Work Routine',
      excerpt: 'A personal system to remove distractions and stay consistent.',
      publishedAt: '2026.02.01',
      readTime: '5 min',
      tags: ['Self Development', 'Routine'],
      category: 'selfDev',
      heroTag: 'Growth Habit',
      authorName: 'Kim Minjae',
      content: [
        'Consistency comes from environment design, not motivation alone. I fixed the same start time every day and added a 10-minute pre-focus checklist.',
        'Learning compounds when input and output stay balanced. Converting notes into code snippets or docs right away improved retention.',
        'The goal is not a perfect 2-hour session every day. The real goal is a loop that is easy to restart tomorrow.',
      ],
    },
    'reading-note-system': {
      slug: 'reading-note-system',
      title: 'Turning Reading Notes into Practical Assets',
      excerpt: 'A template to turn books into implementation-ready knowledge.',
      publishedAt: '2026.01.15',
      readTime: '4 min',
      tags: ['Learning', 'Documentation'],
      category: 'selfDev',
      heroTag: 'Learning System',
      authorName: 'Kim Minjae',
      content: [
        'Reading notes become useful only when they drive execution. I structure each note into concept, applicable context, and immediate next action.',
        'Searchability matters more than note volume. A stable tagging convention made the archive reusable across projects.',
        'A strong note is not for passive review later. It is a trigger for the next concrete implementation step.',
      ],
    },
  },
}

export const getFallbackBlogPostDetail = (locale: Locale, slug: string): BlogPostDetail | null => {
  const fromDetails = blogPostDetailsByLocale[locale][slug]

  if (fromDetails) {
    return fromDetails
  }

  const fallbackPost = blogPageCopyByLocale[locale].posts.find((post) => post.slug === slug)

  if (!fallbackPost) {
    return null
  }

  return {
    ...fallbackPost,
    heroTag: locale === 'en' ? 'Study Note' : '학습 노트',
    authorName: locale === 'en' ? 'Kim Minjae' : '김민재',
    content: [
      fallbackPost.excerpt,
      locale === 'en'
        ? 'This post is currently shown in fallback mode. The full body will be loaded from API when available.'
        : '현재 이 글은 fallback 모드로 표시 중입니다. API가 연결되면 본문 전체를 불러옵니다.',
    ],
  }
}
