import clueMainImageSrc from '@/assets/images/paletto banner.png'
import myPictureSrc from '@/assets/images/MyPicture.jpeg'
import sizzMainImageSrc from '@/assets/images/SIZZ Image.png'
import hlabLogoImageSrc from '@/assets/images/logo.svg'
import type { Locale } from '@/data/portfolio/types'
import type { BlogPageCopySet, BlogPost, BlogPostDetail, PopularPost } from './types'

type MockBlogPostSeed = BlogPostDetail & {
  highlight: string
  bannerBackground: string
  featured?: boolean
}

const createMarkdown = (input: {
  title: string
  introTitle: string
  intro: string
  pointsTitle: string
  points: string[]
  snippetTitle: string
  snippetLanguage: string
  snippet: string
  wrapUpTitle: string
  wrapUp: string[]
}) =>
  [
    `# ${input.title}`,
    '',
    `## ${input.introTitle}`,
    input.intro,
    '',
    `## ${input.pointsTitle}`,
    ...input.points.map((point) => `- ${point}`),
    '',
    `## ${input.snippetTitle}`,
    `\`\`\`${input.snippetLanguage}`,
    input.snippet,
    '```',
    '',
    `## ${input.wrapUpTitle}`,
    ...input.wrapUp.map((point) => `- ${point}`),
  ].join('\n')

const koSeeds: MockBlogPostSeed[] = [
  {
    id: 'feed-style-blog-layout',
    title: '우아한형제들 기술블로그와 velog를 참고해 피드형 블로그 홈 만들기',
    excerpt:
      '편집형 히어로, 트렌딩 레일, 카드 피드를 한 화면에서 자연스럽게 연결한 과정을 정리했습니다.',
    publishedAt: '2026.03.16',
    readTime: '8분',
    tags: ['vue', 'tailwind', 'blog', 'feed'],
    category: 'tech',
    heroTag: 'Design Log',
    authorName: '김민재',
    markdown: createMarkdown({
      title: '우아한형제들 기술블로그와 velog를 참고해 피드형 블로그 홈 만들기',
      introTitle: '문제',
      intro:
        '블로그 홈이 단순 목록으로만 보이면 첫 화면에서 읽을 이유가 약해집니다. 그래서 편집형 기술 블로그의 강한 첫 인상과 피드 서비스의 가벼운 탐색성을 함께 가져가는 구성을 실험했습니다.',
      pointsTitle: '핵심 설계',
      points: [
        '히어로 영역은 대표 글 1개에만 집중해서 첫 시선을 고정했습니다.',
        '카테고리 칩, 검색, 프로젝트 필터를 같은 행위 흐름 안에 배치했습니다.',
        '트렌딩 레일은 짧게 훑을 수 있도록 제목과 태그 중심으로 압축했습니다.',
      ],
      snippetTitle: '레이아웃 스케치',
      snippetLanguage: 'ts',
      snippet: `const sections = [\n  'heroFeature',\n  'searchControls',\n  'topicArchive',\n  'trendingRail',\n] as const\n\nconst visibleFeed = posts.filter((post) => post.category === selectedCategory)\nconst leadPost = visibleFeed[0] ?? null`,
      wrapUpTitle: '적용 결과',
      wrapUp: [
        '첫 화면에서 대표 글과 나머지 글의 위계가 명확해졌습니다.',
        '토픽별 둘러보기와 트렌딩이 분리되어 탐색 부담이 줄었습니다.',
        '실제 글이 없어도 mock 데이터만으로 완성된 화면을 확인할 수 있게 했습니다.',
      ],
    }),
    images: [
      {
        src: clueMainImageSrc,
        alt: '블로그 피드 스타일 참고 이미지',
        caption: '카드형 피드와 편집형 히어로를 섞은 레이아웃 스터디',
      },
    ],
    highlight: '기술 블로그 레퍼런스를 섞어 읽기 흐름이 자연스럽게 이어지는 피드 홈을 설계한 기록.',
    bannerBackground: 'linear-gradient(135deg, #f3f7ee 0%, #d8ebdf 42%, #1f7a5b 100%)',
    featured: true,
  },
  {
    id: 'hlab-first-deploy-retrospective',
    title: 'HLab 첫 배포 회고: Docker, Jenkins, GCP를 한 번에 묶기',
    excerpt:
      '개인 연구실 서비스를 처음 배포하면서 생긴 병목과, 파이프라인을 정리한 기준을 담았습니다.',
    publishedAt: '2026.03.13',
    readTime: '7분',
    tags: ['hlab', 'deploy', 'docker', 'jenkins', 'gcp'],
    category: 'retrospective',
    heroTag: 'Ship Review',
    authorName: '김민재',
    markdown: createMarkdown({
      title: 'HLab 첫 배포 회고: Docker, Jenkins, GCP를 한 번에 묶기',
      introTitle: '배경',
      intro:
        '처음에는 기능을 빠르게 붙이는 데 집중했지만, 배포 과정이 길어질수록 수정 한 번에 드는 비용이 커졌습니다. 그래서 배포 자동화보다 먼저 운영 흐름을 단순화하는 기준을 정리했습니다.',
      pointsTitle: '회고 포인트',
      points: [
        '로컬 환경과 서버 환경의 차이를 Docker 이미지 기준으로 줄였습니다.',
        'Jenkins 파이프라인은 빌드, 테스트, 배포 세 단계만 남기고 단순화했습니다.',
        '알림보다 복구 속도가 중요해서 롤백 경로를 먼저 문서화했습니다.',
      ],
      snippetTitle: '파이프라인 핵심',
      snippetLanguage: 'yaml',
      snippet: `stages:\n  - build\n  - test\n  - deploy\n\ndeploy:\n  script:\n    - docker compose pull\n    - docker compose up -d --remove-orphans`,
      wrapUpTitle: '다음 액션',
      wrapUp: [
        '로그 수집과 장애 감지를 운영 기준에 맞게 추가할 예정입니다.',
        '배포 성공 여부보다 배포 후 검증 체크리스트를 더 엄격하게 관리합니다.',
        '회고 글 태그에 프로젝트 키를 넣어 블로그 프로젝트 필터와 연결했습니다.',
      ],
    }),
    images: [
      {
        src: hlabLogoImageSrc,
        alt: 'HLab 로고',
        caption: 'HLab 서비스 배포 회고와 운영 체크리스트',
      },
    ],
    highlight: '배포 자동화와 운영 부담 사이에서 무엇을 먼저 단순화할지 결정한 회고.',
    bannerBackground: 'linear-gradient(135deg, #0f1c2e 0%, #234369 55%, #f1bf63 100%)',
    featured: true,
  },
  {
    id: 'role-based-admin-guards',
    title: 'admin, teamate, guest 권한 모델을 프론트에 연결한 방법',
    excerpt:
      '로그인 세션, 관리자 라우트, UI 가드에 역할 정보를 붙일 때 놓치기 쉬운 지점을 정리했습니다.',
    publishedAt: '2026.03.12',
    readTime: '6분',
    tags: ['auth', 'rbac', 'admin', 'vue'],
    category: 'tech',
    heroTag: 'API & Access',
    authorName: '김민재',
    markdown: createMarkdown({
      title: 'admin, teamate, guest 권한 모델을 프론트에 연결한 방법',
      introTitle: '문제',
      intro:
        '권한 값이 로그인 응답에는 있지만 세션 저장, 컴포저블, 관리자 라우트에서 기준이 다르면 실제 제어가 느슨해집니다. 그래서 권한 문자열을 한 타입으로 모으고 같은 판별 함수를 재사용하도록 정리했습니다.',
      pointsTitle: '연결 기준',
      points: [
        '역할 값은 admin, teamate, guest 세 가지로만 제한했습니다.',
        '세션 저장소와 /me 응답 파싱 모두 같은 normalize 함수로 통일했습니다.',
        '관리자 페이지는 admin이 아니면 진입 자체를 막도록 구성했습니다.',
      ],
      snippetTitle: '권한 판별 함수',
      snippetLanguage: 'ts',
      snippet: `export const USER_ROLE_VALUES = ['admin', 'teamate', 'guest'] as const\nexport type UserRole = (typeof USER_ROLE_VALUES)[number]\n\nexport const hasAdminRole = (role: UserRole | null | undefined) => role === 'admin'`,
      wrapUpTitle: '체크 포인트',
      wrapUp: [
        '권한 값이 비어 있을 때는 안전하게 guest로 수렴시킵니다.',
        'UI 숨김만으로 끝내지 않고 라우트 진입도 같이 막아야 합니다.',
        '백엔드 응답과 프론트 도메인 타입을 같이 관리해야 drift가 줄어듭니다.',
      ],
    }),
    images: [
      {
        src: myPictureSrc,
        alt: '권한 모델 정리 메모',
        caption: '권한 타입과 관리자 접근 흐름을 정리한 설계 메모',
      },
    ],
    highlight: '권한 문자열 하나를 UI, 세션, 라우팅에 일관되게 연결하는 최소 구조.',
    bannerBackground: 'linear-gradient(135deg, #182331 0%, #2a4662 50%, #d9a441 100%)',
    featured: true,
  },
  {
    id: 'clue-v1-integration-retrospective',
    title: 'CLUE v1 통합 회고: 교육 서비스에서 이동 시간을 줄인 설계',
    excerpt:
      '학생이 필요한 화면까지 빨리 도달하도록 흐름을 다시 짰던 과정과 남은 과제를 정리했습니다.',
    publishedAt: '2026.03.10',
    readTime: '5분',
    tags: ['clue', 'planning', 'retrospective', 'integration'],
    category: 'retrospective',
    heroTag: 'Project Note',
    authorName: '김민재',
    markdown: createMarkdown({
      title: 'CLUE v1 통합 회고: 교육 서비스에서 이동 시간을 줄인 설계',
      introTitle: '목표',
      intro:
        '학생, 교사, 운영자가 각각 다른 시작점에서 들어와도 최대한 적은 클릭으로 목적지에 도달하게 만드는 것이 첫 번째 목표였습니다.',
      pointsTitle: '정리한 기준',
      points: [
        '핵심 기능으로 이동하는 첫 클릭 수를 줄이는 데 집중했습니다.',
        '사용자 흐름이 갈라지는 지점마다 CTA 문구를 역할 기준으로 바꿨습니다.',
        '기획 문서보다 실제 화면 연결 관계를 먼저 검증했습니다.',
      ],
      snippetTitle: '플로우 요약',
      snippetLanguage: 'ts',
      snippet: `const clueEntryFlow = {\n  student: ['dashboard', 'classroom', 'assignment'],\n  teacher: ['overview', 'classroom', 'gradebook'],\n  operator: ['admin', 'schedule', 'support'],\n}`,
      wrapUpTitle: '남은 과제',
      wrapUp: [
        '권한별 첫 화면을 더 세밀하게 분리할 필요가 있습니다.',
        '지표 수집이 부족해서 화면 전환 시간을 더 정확히 측정해야 합니다.',
        '회고 태그에 clue를 유지해 프로젝트 페이지와 연결했습니다.',
      ],
    }),
    images: [
      {
        src: clueMainImageSrc,
        alt: 'CLUE 메인 화면',
        caption: '통합 교육 서비스 CLUE v1 회고',
      },
    ],
    highlight: '학생의 이동 시간을 줄이기 위해 첫 클릭과 역할별 진입 흐름을 다시 설계한 기록.',
    bannerBackground: 'linear-gradient(135deg, #f8f4e8 0%, #e2d6bd 44%, #617184 100%)',
  },
  {
    id: 'sizz-news-platform-retrospective',
    title: 'SIZZ 뉴스 플랫폼 회고: 신뢰도를 화면 언어로 번역한 방법',
    excerpt:
      '기사 신뢰도와 피드 소비 속도를 함께 챙기기 위해 어떤 UI 규칙을 잡았는지 적었습니다.',
    publishedAt: '2026.03.08',
    readTime: '5분',
    tags: ['sizz', 'news', 'retrospective', 'ux'],
    category: 'retrospective',
    heroTag: 'Product Review',
    authorName: '김민재',
    markdown: createMarkdown({
      title: 'SIZZ 뉴스 플랫폼 회고: 신뢰도를 화면 언어로 번역한 방법',
      introTitle: '배경',
      intro:
        '뉴스 플랫폼은 빠르게 훑게 만드는 것만으로는 부족했습니다. 사용자가 기사 신뢰도를 판단할 수 있는 화면 언어를 함께 제공해야 했습니다.',
      pointsTitle: '화면 규칙',
      points: [
        '출처, 발행 시점, 맥락 정보를 한 덩어리로 묶어 배치했습니다.',
        '강한 시각 요소는 제목보다 기사 신뢰 정보 뒤에 오도록 조정했습니다.',
        '카드 리스트와 상세 읽기 화면의 정보 밀도를 다르게 설계했습니다.',
      ],
      snippetTitle: '카드 메타 정보',
      snippetLanguage: 'ts',
      snippet: `const articleMeta = {\n  source: 'verified',\n  publishedAt: 'recent',\n  confidence: 'high',\n  relatedCount: 3,\n}`,
      wrapUpTitle: '회고',
      wrapUp: [
        '속도감 있는 피드와 신뢰 정보 강조는 같은 계층에 두지 않는 편이 좋았습니다.',
        '사용자는 예상보다 출처 배지를 많이 참고했습니다.',
        '프로젝트 회고 글을 sizz 태그로 묶어 프로젝트 화면과 연결했습니다.',
      ],
    }),
    images: [
      {
        src: sizzMainImageSrc,
        alt: 'SIZZ 메인 화면',
        caption: '신뢰 정보와 피드 소비 속도를 함께 설계한 SIZZ',
      },
    ],
    highlight: '신뢰도 배치와 피드 속도의 균형을 잡기 위해 카드 메타 구조를 다시 설계한 회고.',
    bannerBackground: 'linear-gradient(135deg, #1d2027 0%, #2e394d 48%, #f29c52 100%)',
  },
  {
    id: 'mock-content-preview-strategy',
    title: '백엔드 없이도 블로그 화면을 설득력 있게 보여주는 mock 데이터 전략',
    excerpt:
      'API가 비어 있어도 홈, 상세, 썸네일까지 한 번에 확인할 수 있도록 로컬 데이터를 설계한 방법입니다.',
    publishedAt: '2026.03.06',
    readTime: '6분',
    tags: ['mock', 'blog', 'content', 'preview'],
    category: 'tech',
    heroTag: 'Preview Setup',
    authorName: '김민재',
    markdown: createMarkdown({
      title: '백엔드 없이도 블로그 화면을 설득력 있게 보여주는 mock 데이터 전략',
      introTitle: '왜 필요했나',
      intro:
        '디자인 수정이나 화면 리뷰를 할 때마다 API 준비 상태에 묶이면 속도가 크게 떨어집니다. 그래서 목록, 상세, 썸네일을 같은 로컬 데이터에서 파생하도록 구성했습니다.',
      pointsTitle: '구성 방식',
      points: [
        '목록용 데이터와 상세용 데이터를 같은 seed에서 파생했습니다.',
        'API 응답이 없으면 자동으로 mock 데이터를 fallback으로 사용합니다.',
        '상세 페이지도 같은 mock detail을 참조하게 만들어 클릭 흐름을 유지했습니다.',
      ],
      snippetTitle: 'fallback 개념',
      snippetLanguage: 'ts',
      snippet: `if (!isBlogApiEnabled()) {\n  copy.value = getMockBlogPageCopy(locale.value)\n  dataSource.value = 'mock'\n  return\n}`,
      wrapUpTitle: '효과',
      wrapUp: [
        '디자인 시안 검토 때 비어 있는 화면이 사라졌습니다.',
        '프로젝트 회고, 상세 페이지, 목록 썸네일까지 한 번에 데모가 가능합니다.',
        '실제 API가 붙으면 같은 UI를 그대로 검증할 수 있습니다.',
      ],
    }),
    images: [
      {
        src: clueMainImageSrc,
        alt: 'mock 데이터 기반 블로그 프리뷰',
        caption: 'mock 데이터로 홈과 상세를 함께 검증하는 방식',
      },
    ],
    highlight: '로컬 seed 하나로 목록, 상세, 썸네일까지 이어지게 만든 프리뷰 전략.',
    bannerBackground: 'linear-gradient(135deg, #f7efe2 0%, #f0d5a8 40%, #21475c 100%)',
  },
  {
    id: 'deep-work-study-system',
    title: '학교와 개인 프로젝트를 같이 굴릴 때 집중 시간을 지키는 루틴',
    excerpt:
      '해야 할 일이 겹칠수록 목록을 늘리기보다, 하루의 집중 슬롯을 먼저 고정하는 방식을 사용합니다.',
    publishedAt: '2026.03.04',
    readTime: '4분',
    tags: ['deep-work', 'habit', 'study', 'focus'],
    category: 'selfDev',
    heroTag: 'Execution Note',
    authorName: '김민재',
    markdown: createMarkdown({
      title: '학교와 개인 프로젝트를 같이 굴릴 때 집중 시간을 지키는 루틴',
      introTitle: '상황',
      intro:
        '학교 일정과 프로젝트 일정이 겹치면 해야 할 일을 계속 추가하는 방식으로는 버티기 어렵습니다. 그래서 하루를 시간 슬롯 기준으로 먼저 나누고, 슬롯마다 기대 결과를 하나만 잡았습니다.',
      pointsTitle: '루틴 원칙',
      points: [
        '가장 어려운 작업은 아침 첫 슬롯에 배치합니다.',
        '작업 전환 횟수를 줄이기 위해 같은 종류의 일을 묶습니다.',
        '기록은 길게 쓰지 않고 다음 행동이 바로 보이도록 남깁니다.',
      ],
      snippetTitle: '하루 슬롯 예시',
      snippetLanguage: 'yaml',
      snippet: `morning:\n  focus: implementation\n  output: one merged feature\n\nafternoon:\n  focus: class and review\n  output: one clean note`,
      wrapUpTitle: '효과',
      wrapUp: [
        '일정이 많을수록 해야 할 일보다 남은 집중 시간을 먼저 보게 됩니다.',
        '프로젝트와 공부가 섞여도 하루의 중심 작업이 흐려지지 않습니다.',
        '다음 날 시작 비용이 줄어듭니다.',
      ],
    }),
    images: [
      {
        src: myPictureSrc,
        alt: '집중 루틴 메모',
        caption: '하루 집중 슬롯을 기준으로 정리한 개인 루틴',
      },
    ],
    highlight: '해야 할 일 목록보다 집중 슬롯을 먼저 고정하는 개인 실행 시스템.',
    bannerBackground: 'linear-gradient(135deg, #edf4ff 0%, #c8daf2 36%, #2f4d73 100%)',
  },
  {
    id: 'security-notes-indexing-system',
    title: '보안 공부 기록을 다시 찾기 쉽게 만드는 인덱싱 규칙',
    excerpt:
      '악성코드 분석과 개발 노트를 섞어도 다시 찾을 수 있도록 제목, 태그, 목차 기준을 통일했습니다.',
    publishedAt: '2026.03.01',
    readTime: '5분',
    tags: ['security', 'notes', 'knowledge', 'archive'],
    category: 'selfDev',
    heroTag: 'Learning System',
    authorName: '김민재',
    markdown: createMarkdown({
      title: '보안 공부 기록을 다시 찾기 쉽게 만드는 인덱싱 규칙',
      introTitle: '문제',
      intro:
        '보안 공부 기록은 시간이 지나면 다시 찾는 비용이 커집니다. 제목은 기억나지 않고, 분석 대상이나 키워드만 남는 경우가 많기 때문입니다.',
      pointsTitle: '인덱싱 기준',
      points: [
        '제목에는 분석 대상과 핵심 기술어를 함께 넣습니다.',
        '태그는 너무 넓지 않게 주제, 툴, 목적 세 가지 축으로 나눕니다.',
        '본문 목차는 재현 절차와 결론을 빠르게 찾을 수 있도록 고정합니다.',
      ],
      snippetTitle: '노트 구조',
      snippetLanguage: 'md',
      snippet: `# 샘플 제목\n## 분석 대상\n## 재현 환경\n## 핵심 관찰\n## 대응 포인트\n## 참고 링크`,
      wrapUpTitle: '기준을 적용한 뒤',
      wrapUp: [
        '같은 주제를 다시 볼 때 검색 시간이 크게 줄었습니다.',
        '개발 노트와 보안 노트가 섞여도 태그만으로 재탐색이 가능해졌습니다.',
        '블로그 글로 옮길 때도 구조를 거의 그대로 사용할 수 있습니다.',
      ],
    }),
    images: [
      {
        src: myPictureSrc,
        alt: '보안 노트 인덱싱 구조',
        caption: '다시 찾기 쉬운 공부 기록 구조를 만드는 규칙',
      },
    ],
    highlight: '분석 노트를 다시 찾는 시간을 줄이기 위해 제목과 태그 규칙을 통일한 방식.',
    bannerBackground: 'linear-gradient(135deg, #eceef4 0%, #d0d6e2 38%, #364152 100%)',
  },
]

const enSeeds: MockBlogPostSeed[] = [
  {
    id: 'feed-style-blog-layout',
    title: 'Building a feed-style blog home inspired by Woowahan Tech Blog and velog',
    excerpt:
      'How I combined an editorial hero, a trending rail, and a readable card feed on one screen.',
    publishedAt: '2026.03.16',
    readTime: '8 min read',
    tags: ['vue', 'tailwind', 'blog', 'feed'],
    category: 'tech',
    heroTag: 'Design Log',
    authorName: 'Kim Minjae',
    markdown: createMarkdown({
      title: 'Building a feed-style blog home inspired by Woowahan Tech Blog and velog',
      introTitle: 'Context',
      intro:
        'A blog home made of plain cards rarely gives people a reason to stay on the first screen. I wanted the first impression of an editorial tech blog while keeping the lightweight browsing rhythm of a feed product.',
      pointsTitle: 'Design decisions',
      points: [
        'The hero area focuses on a single lead story instead of competing headlines.',
        'Category chips, search, and project filters live in one browsing flow.',
        'The trending rail is compressed to title-plus-tag so it stays scannable.',
      ],
      snippetTitle: 'Layout sketch',
      snippetLanguage: 'ts',
      snippet: `const sections = [\n  'heroFeature',\n  'searchControls',\n  'topicArchive',\n  'trendingRail',\n] as const\n\nconst visibleFeed = posts.filter((post) => post.category === selectedCategory)\nconst leadPost = visibleFeed[0] ?? null`,
      wrapUpTitle: 'Outcome',
      wrapUp: [
        'The lead story now has a clear visual priority.',
        'Topic browsing and trending reading no longer compete for the same space.',
        'The screen can be reviewed with local mock content even before the API is ready.',
      ],
    }),
    images: [
      {
        src: clueMainImageSrc,
        alt: 'Feed-style blog home reference',
        caption: 'A layout study that blends editorial hierarchy and a lightweight feed.',
      },
    ],
    highlight: 'A record of designing a blog home that reads more like an editorial cover than a static archive.',
    bannerBackground: 'linear-gradient(135deg, #f3f7ee 0%, #d8ebdf 42%, #1f7a5b 100%)',
    featured: true,
  },
  {
    id: 'hlab-first-deploy-retrospective',
    title: 'HLab deployment retrospective: simplifying Docker, Jenkins, and GCP together',
    excerpt:
      'What caused friction during the first deployment and which rules I used to simplify the pipeline.',
    publishedAt: '2026.03.13',
    readTime: '7 min read',
    tags: ['hlab', 'deploy', 'docker', 'jenkins', 'gcp'],
    category: 'retrospective',
    heroTag: 'Ship Review',
    authorName: 'Kim Minjae',
    markdown: createMarkdown({
      title: 'HLab deployment retrospective: simplifying Docker, Jenkins, and GCP together',
      introTitle: 'Background',
      intro:
        'Shipping features was easy at first, but every deployment soon became more expensive than the code change itself. I started by simplifying the operating path before adding more automation.',
      pointsTitle: 'Retrospective notes',
      points: [
        'Docker was the baseline for reducing local-versus-server drift.',
        'The Jenkins pipeline was cut down to build, test, and deploy only.',
        'Rollback speed mattered more than alerts, so recovery steps were documented first.',
      ],
      snippetTitle: 'Pipeline core',
      snippetLanguage: 'yaml',
      snippet: `stages:\n  - build\n  - test\n  - deploy\n\ndeploy:\n  script:\n    - docker compose pull\n    - docker compose up -d --remove-orphans`,
      wrapUpTitle: 'Next actions',
      wrapUp: [
        'Logging and incident signals still need to be tightened.',
        'Post-deploy checks matter more than the green deploy status itself.',
        'The retrospective keeps the project tag so it is connected to the project archive.',
      ],
    }),
    images: [
      {
        src: hlabLogoImageSrc,
        alt: 'HLab logo',
        caption: 'Deployment notes and operating checklist for HLab.',
      },
    ],
    highlight: 'A deployment retrospective focused on reducing operator burden before chasing more automation.',
    bannerBackground: 'linear-gradient(135deg, #0f1c2e 0%, #234369 55%, #f1bf63 100%)',
    featured: true,
  },
  {
    id: 'role-based-admin-guards',
    title: 'Wiring admin, teamate, and guest roles into the frontend',
    excerpt:
      'A compact way to keep session parsing, route guards, and admin UI checks aligned around one role model.',
    publishedAt: '2026.03.12',
    readTime: '6 min read',
    tags: ['auth', 'rbac', 'admin', 'vue'],
    category: 'tech',
    heroTag: 'API & Access',
    authorName: 'Kim Minjae',
    markdown: createMarkdown({
      title: 'Wiring admin, teamate, and guest roles into the frontend',
      introTitle: 'Problem',
      intro:
        'If the login response, session storage, and route guard each interpret a role differently, authorization becomes inconsistent very quickly. I reduced that risk by keeping one shared role type and one shared check function.',
      pointsTitle: 'Implementation rules',
      points: [
        'Only three role values are allowed: admin, teamate, guest.',
        'Session parsing and /me response parsing both use the same normalize function.',
        'Admin routes deny access unless the current role is admin.',
      ],
      snippetTitle: 'Role check',
      snippetLanguage: 'ts',
      snippet: `export const USER_ROLE_VALUES = ['admin', 'teamate', 'guest'] as const\nexport type UserRole = (typeof USER_ROLE_VALUES)[number]\n\nexport const hasAdminRole = (role: UserRole | null | undefined) => role === 'admin'`,
      wrapUpTitle: 'Checks',
      wrapUp: [
        'Missing role values should collapse to the safest default.',
        'Hiding admin UI is not enough if route entry still succeeds.',
        'Backend payloads and frontend domain types need to evolve together.',
      ],
    }),
    images: [
      {
        src: myPictureSrc,
        alt: 'RBAC notes',
        caption: 'A compact role model for session, route, and UI authorization.',
      },
    ],
    highlight: 'A minimal RBAC structure that keeps session, UI, and routing logic aligned around one role string.',
    bannerBackground: 'linear-gradient(135deg, #182331 0%, #2a4662 50%, #d9a441 100%)',
    featured: true,
  },
  {
    id: 'clue-v1-integration-retrospective',
    title: 'CLUE v1 retrospective: reducing navigation time in an education service',
    excerpt:
      'How the product flow was restructured so users could reach the next action with fewer steps.',
    publishedAt: '2026.03.10',
    readTime: '5 min read',
    tags: ['clue', 'planning', 'retrospective', 'integration'],
    category: 'retrospective',
    heroTag: 'Project Note',
    authorName: 'Kim Minjae',
    markdown: createMarkdown({
      title: 'CLUE v1 retrospective: reducing navigation time in an education service',
      introTitle: 'Goal',
      intro:
        'Students, teachers, and operators each entered from a different starting point, but the product still needed to get them to the right screen with minimal effort.',
      pointsTitle: 'Rules that helped',
      points: [
        'We optimized around the first click required to reach the primary task.',
        'CTA copy changed depending on role at each branching point.',
        'Screen-to-screen flow was validated earlier than documentation polish.',
      ],
      snippetTitle: 'Flow summary',
      snippetLanguage: 'ts',
      snippet: `const clueEntryFlow = {\n  student: ['dashboard', 'classroom', 'assignment'],\n  teacher: ['overview', 'classroom', 'gradebook'],\n  operator: ['admin', 'schedule', 'support'],\n}`,
      wrapUpTitle: 'What remains',
      wrapUp: [
        'Role-based landing states still need more granularity.',
        'Navigation-time tracking should be tightened with better metrics.',
        'The clue tag keeps this note connected to the project view.',
      ],
    }),
    images: [
      {
        src: clueMainImageSrc,
        alt: 'CLUE main interface',
        caption: 'A retrospective on the CLUE education service flow.',
      },
    ],
    highlight: 'A retrospective focused on faster first-click navigation for a role-driven education product.',
    bannerBackground: 'linear-gradient(135deg, #f8f4e8 0%, #e2d6bd 44%, #617184 100%)',
  },
  {
    id: 'sizz-news-platform-retrospective',
    title: 'SIZZ retrospective: translating trust into interface language',
    excerpt:
      'The UI rules used to balance fast feed consumption with visible credibility signals on a news product.',
    publishedAt: '2026.03.08',
    readTime: '5 min read',
    tags: ['sizz', 'news', 'retrospective', 'ux'],
    category: 'retrospective',
    heroTag: 'Product Review',
    authorName: 'Kim Minjae',
    markdown: createMarkdown({
      title: 'SIZZ retrospective: translating trust into interface language',
      introTitle: 'Context',
      intro:
        'A news product cannot optimize for scanning speed alone. The interface also has to help users judge whether the article deserves trust.',
      pointsTitle: 'Interface rules',
      points: [
        'Source, timing, and context metadata were grouped into one visible block.',
        'Strong visual elements were moved behind trust information, not ahead of it.',
        'Feed cards and article detail pages intentionally carried different information density.',
      ],
      snippetTitle: 'Metadata example',
      snippetLanguage: 'ts',
      snippet: `const articleMeta = {\n  source: 'verified',\n  publishedAt: 'recent',\n  confidence: 'high',\n  relatedCount: 3,\n}`,
      wrapUpTitle: 'Retrospective',
      wrapUp: [
        'Speed and trust should not fight for the same hierarchy level.',
        'Users referenced source badges more often than expected.',
        'The sizz tag keeps the article connected to the project archive.',
      ],
    }),
    images: [
      {
        src: sizzMainImageSrc,
        alt: 'SIZZ main screen',
        caption: 'Balancing trust signals and feed speed on SIZZ.',
      },
    ],
    highlight: 'A retrospective on reworking metadata hierarchy so trust stays visible in a fast feed.',
    bannerBackground: 'linear-gradient(135deg, #1d2027 0%, #2e394d 48%, #f29c52 100%)',
  },
  {
    id: 'mock-content-preview-strategy',
    title: 'A mock data strategy for showing a convincing blog before the backend exists',
    excerpt:
      'How one local seed powers the list view, detail view, and thumbnails so the screen stays reviewable.',
    publishedAt: '2026.03.06',
    readTime: '6 min read',
    tags: ['mock', 'blog', 'content', 'preview'],
    category: 'tech',
    heroTag: 'Preview Setup',
    authorName: 'Kim Minjae',
    markdown: createMarkdown({
      title: 'A mock data strategy for showing a convincing blog before the backend exists',
      introTitle: 'Why',
      intro:
        'Design review slows down quickly when every screen depends on an unfinished API. I switched the blog to derive the list, detail page, and thumbnails from one local seed so the product could still be reviewed end-to-end.',
      pointsTitle: 'Structure',
      points: [
        'List data and detail data are derived from the same local source.',
        'If the API is unavailable, the UI automatically falls back to mock content.',
        'The detail page resolves the same local seed so navigation still works.',
      ],
      snippetTitle: 'Fallback idea',
      snippetLanguage: 'ts',
      snippet: `if (!isBlogApiEnabled()) {\n  copy.value = getMockBlogPageCopy(locale.value)\n  dataSource.value = 'mock'\n  return\n}`,
      wrapUpTitle: 'Result',
      wrapUp: [
        'Design review no longer starts with empty states.',
        'Home, detail, and project-linked retrospectives can all be demonstrated locally.',
        'The same UI can later be validated again with a real API.',
      ],
    }),
    images: [
      {
        src: clueMainImageSrc,
        alt: 'Mock preview strategy',
        caption: 'Using local data to validate the blog experience before API integration.',
      },
    ],
    highlight: 'A preview setup where one local seed powers the list page, detail page, and image thumbnails.',
    bannerBackground: 'linear-gradient(135deg, #f7efe2 0%, #f0d5a8 40%, #21475c 100%)',
  },
  {
    id: 'deep-work-study-system',
    title: 'Protecting focus time while handling school and side projects together',
    excerpt:
      'Instead of extending the task list forever, I lock a few daily focus slots and give each slot one expected output.',
    publishedAt: '2026.03.04',
    readTime: '4 min read',
    tags: ['deep-work', 'habit', 'study', 'focus'],
    category: 'selfDev',
    heroTag: 'Execution Note',
    authorName: 'Kim Minjae',
    markdown: createMarkdown({
      title: 'Protecting focus time while handling school and side projects together',
      introTitle: 'Situation',
      intro:
        'When classes and project work overlap, adding more tasks to the list does not solve the bottleneck. I break the day into a few focus blocks first and assign one expected output to each block.',
      pointsTitle: 'Rules',
      points: [
        'The hardest work moves to the first block of the day.',
        'Similar work is batched to reduce context switching.',
        'Notes are written for the next action, not for completeness.',
      ],
      snippetTitle: 'Example day',
      snippetLanguage: 'yaml',
      snippet: `morning:\n  focus: implementation\n  output: one merged feature\n\nafternoon:\n  focus: class and review\n  output: one clean note`,
      wrapUpTitle: 'Effect',
      wrapUp: [
        'The schedule is evaluated by remaining focus time first.',
        'Study and product work can coexist without blurring the main task.',
        'The next-day startup cost becomes much smaller.',
      ],
    }),
    images: [
      {
        src: myPictureSrc,
        alt: 'Focus routine notes',
        caption: 'A routine based on protected focus slots instead of a growing task list.',
      },
    ],
    highlight: 'A personal execution system that starts from focus slots instead of a longer backlog.',
    bannerBackground: 'linear-gradient(135deg, #edf4ff 0%, #c8daf2 36%, #2f4d73 100%)',
  },
  {
    id: 'security-notes-indexing-system',
    title: 'Indexing security notes so they are easy to find again later',
    excerpt:
      'A simple structure for titles, tags, and headings that keeps malware analysis notes and dev notes searchable.',
    publishedAt: '2026.03.01',
    readTime: '5 min read',
    tags: ['security', 'notes', 'knowledge', 'archive'],
    category: 'selfDev',
    heroTag: 'Learning System',
    authorName: 'Kim Minjae',
    markdown: createMarkdown({
      title: 'Indexing security notes so they are easy to find again later',
      introTitle: 'Problem',
      intro:
        'Security notes become expensive to revisit because you often remember the sample or the technique, but not the title. I normalized the note structure so search and re-entry become predictable.',
      pointsTitle: 'Indexing rules',
      points: [
        'Titles include both the target and the main technical keyword.',
        'Tags are split by topic, tool, and purpose instead of broad buckets.',
        'The heading structure is fixed so reproduction steps and conclusions are easy to scan.',
      ],
      snippetTitle: 'Note skeleton',
      snippetLanguage: 'md',
      snippet: `# Sample title\n## Target\n## Reproduction setup\n## Key observations\n## Response points\n## References`,
      wrapUpTitle: 'After applying it',
      wrapUp: [
        'Search time dropped when revisiting the same topic later.',
        'Security and development notes can coexist without losing findability.',
        'The same structure is reusable when turning notes into blog posts.',
      ],
    }),
    images: [
      {
        src: myPictureSrc,
        alt: 'Security note indexing',
        caption: 'Rules for making security notes easy to revisit.',
      },
    ],
    highlight: 'A note indexing system built to reduce the cost of re-finding analysis later.',
    bannerBackground: 'linear-gradient(135deg, #eceef4 0%, #d0d6e2 38%, #364152 100%)',
  },
]

const basePageCopyByLocale: Record<Locale, Omit<BlogPageCopySet, 'popularPosts' | 'posts'>> = {
  ko: {
    kicker: 'STUDY ARCHIVE',
    heading: '기록은 어제의 나와 오늘의 나를 잇는 다리',
    description: '기술 실험, 프로젝트 회고, 자기 개발 루틴을 한 곳에 정리합니다.',
    popularKicker: '인기 글',
    popularHeading: '인기글',
    popularDescription: '최근 반응이 좋은 글을 우선 노출합니다.',
    readLabel: '글 읽기',
    categories: {
      tech: {
        title: '기술',
        description: '',
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
  },
  en: {
    kicker: 'STUDY ARCHIVE',
    heading: 'A blog to track what I learn',
    description: 'Technical experiments, retrospectives, and growth notes in one place.',
    popularKicker: 'Popular Posts',
    popularHeading: 'Popular Posts',
    popularDescription: 'Most-read notes are highlighted first.',
    readLabel: 'Read Post',
    categories: {
      tech: {
        title: 'Tech',
        description: '',
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
  },
}

const seedsByLocale: Record<Locale, MockBlogPostSeed[]> = {
  ko: koSeeds,
  en: enSeeds,
}

const toListPost = (seed: MockBlogPostSeed): BlogPost => ({
  id: seed.id,
  title: seed.title,
  excerpt: seed.excerpt,
  publishedAt: seed.publishedAt,
  readTime: seed.readTime,
  tags: [...seed.tags],
  category: seed.category,
})

const toPopularPost = (seed: MockBlogPostSeed): PopularPost => ({
  ...toListPost(seed),
  heroTag: seed.heroTag,
  highlight: seed.highlight,
  bannerBackground: seed.bannerBackground,
})

const cloneBlogPostDetail = (post: BlogPostDetail): BlogPostDetail => ({
  ...post,
  tags: [...post.tags],
  images: post.images?.map((image) => ({ ...image })),
  videos: post.videos?.map((video) => ({ ...video })),
})

const cloneBlogPageCopy = (copy: BlogPageCopySet): BlogPageCopySet => ({
  ...copy,
  categories: {
    tech: { ...copy.categories.tech },
    retrospective: { ...copy.categories.retrospective },
    selfDev: { ...copy.categories.selfDev },
  },
  popularPosts: copy.popularPosts.map((post) => ({
    ...post,
    tags: [...post.tags],
  })),
  posts: copy.posts.map((post) => ({
    ...post,
    tags: [...post.tags],
  })),
})

export const blogPageCopyByLocale: Record<Locale, BlogPageCopySet> = {
  ko: {
    ...basePageCopyByLocale.ko,
    popularPosts: seedsByLocale.ko.filter((seed) => seed.featured).map(toPopularPost),
    posts: seedsByLocale.ko.map(toListPost),
  },
  en: {
    ...basePageCopyByLocale.en,
    popularPosts: seedsByLocale.en.filter((seed) => seed.featured).map(toPopularPost),
    posts: seedsByLocale.en.map(toListPost),
  },
}

export const getMockBlogPageCopy = (locale: Locale) => cloneBlogPageCopy(blogPageCopyByLocale[locale])

export const getMockBlogPostDetail = (locale: Locale, id: string) => {
  const post = seedsByLocale[locale].find((item) => item.id === id)
  return post ? cloneBlogPostDetail(post) : null
}
