import type { Locale } from '@/data/portfolio/types'
import type { BlogPageCopySet, BlogPostDetail } from './types'

export type {
  BlogCategoryKey,
  BlogPost,
  PopularPost,
  BlogCategoryCopy,
  BlogPageCopySet,
  BlogPostDetail,
  BlogPostImage,
  BlogPostVideo,
  BlogComment,
} from './types'
export { BLOG_CATEGORY_KEYS } from './types'

const koPostDocker: BlogPageCopySet['posts'][number] = {
  id: 'docker-fastapi-ci-cd',
  title: 'Docker + FastAPI 배포 자동화 구성기',
  excerpt: '개발 서버에서 운영까지 이어지는 배포 흐름을 CI/CD 기준으로 정리했습니다.',
  publishedAt: '2026.02.15',
  readTime: '8분',
  tags: ['#docker', '#fastapi', '#cicd'],
  category: 'tech',
}

const koPostRetro: BlogPageCopySet['posts'][number] = {
  id: 'hlab-v1-retro',
  title: 'HLab v1 회고: 빠르게 만들고 천천히 고쳤던 이유',
  excerpt: '초기 구조를 단순화한 선택과 그로 인해 생긴 유지보수 비용을 회고합니다.',
  publishedAt: '2026.02.10',
  readTime: '6분',
  tags: ['#hlab', '#retrospective', '#vue3'],
  category: 'retrospective',
}

const koPostSelfDev: BlogPageCopySet['posts'][number] = {
  id: 'weekly-learning-system',
  title: '주간 학습 루틴 설계: 기록이 쌓이는 시스템 만들기',
  excerpt: '실행력을 유지하기 위해 만든 주간 학습 루틴과 점검 방식을 공유합니다.',
  publishedAt: '2026.02.05',
  readTime: '5분',
  tags: ['#selfdev', '#learning', '#routine'],
  category: 'selfDev',
}

const koSamplePosts: BlogPageCopySet['posts'] = [koPostDocker, koPostRetro, koPostSelfDev]

const enPostDocker: BlogPageCopySet['posts'][number] = {
  id: 'docker-fastapi-ci-cd',
  title: 'Building Docker + FastAPI Deployment Automation',
  excerpt: 'A practical CI/CD flow from development environment to production.',
  publishedAt: '2026.02.15',
  readTime: '8 min',
  tags: ['#docker', '#fastapi', '#cicd'],
  category: 'tech',
}

const enPostRetro: BlogPageCopySet['posts'][number] = {
  id: 'hlab-v1-retro',
  title: 'HLab v1 Retrospective: Why I Built Fast and Fixed Slow',
  excerpt: 'A reflection on early architectural choices and the resulting maintenance cost.',
  publishedAt: '2026.02.10',
  readTime: '6 min',
  tags: ['#hlab', '#retrospective', '#vue3'],
  category: 'retrospective',
}

const enPostSelfDev: BlogPageCopySet['posts'][number] = {
  id: 'weekly-learning-system',
  title: 'Weekly Learning System: Turning Notes Into Momentum',
  excerpt: 'How I designed a repeatable weekly study routine and review cycle.',
  publishedAt: '2026.02.05',
  readTime: '5 min',
  tags: ['#selfdev', '#learning', '#routine'],
  category: 'selfDev',
}

const enSamplePosts: BlogPageCopySet['posts'] = [enPostDocker, enPostRetro, enPostSelfDev]

const samplePostImageById: Record<string, string> = {
  'docker-fastapi-ci-cd':
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1400&q=80',
  'hlab-v1-retro':
    'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1400&q=80',
  'weekly-learning-system':
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=80',
}

const getSamplePostImage = (id: string) => samplePostImageById[id] ?? ''

export const blogPageCopyByLocale: Record<Locale, BlogPageCopySet> = {
  ko: {
    kicker: 'STUDY ARCHIVE',
    heading: '내가 공부한 기록을 쌓는 블로그',
    description:
      '기술 실험, 프로젝트 회고, 자기 개발 루틴을 한 곳에 정리합니다.',
    popularKicker: '인기 글',
    popularHeading: '인기글',
    popularDescription: '최근 반응이 좋은 글을 우선 노출합니다.',
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
        ...koPostDocker,
        heroTag: 'DEPLOYMENT',
        highlight: '배포 속도 + 안정성 확보',
        bannerBackground:
          'linear-gradient(130deg, rgba(62,62,62,0.96) 0%, rgba(26,26,26,0.95) 55%, rgba(10,10,10,0.96) 100%)',
      },
      {
        ...koPostRetro,
        heroTag: 'RETROSPECTIVE',
        highlight: '빠른 실험 후 구조 개선',
        bannerBackground:
          'linear-gradient(138deg, rgba(56,56,56,0.95) 0%, rgba(24,24,24,0.94) 53%, rgba(9,9,9,0.95) 100%)',
      },
    ],
    posts: koSamplePosts,
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
        ...enPostDocker,
        heroTag: 'DEPLOYMENT',
        highlight: 'Delivery speed with stable rollout',
        bannerBackground:
          'linear-gradient(130deg, rgba(62,62,62,0.96) 0%, rgba(26,26,26,0.95) 55%, rgba(10,10,10,0.96) 100%)',
      },
      {
        ...enPostRetro,
        heroTag: 'RETROSPECTIVE',
        highlight: 'Fast experiment, deliberate refactor',
        bannerBackground:
          'linear-gradient(138deg, rgba(56,56,56,0.95) 0%, rgba(24,24,24,0.94) 53%, rgba(9,9,9,0.95) 100%)',
      },
    ],
    posts: enSamplePosts,
  },
}

export const blogPostDetailsByLocale: Record<Locale, Record<string, BlogPostDetail>> = {
  ko: {
    'docker-fastapi-ci-cd': {
      ...koPostDocker,
      heroTag: 'DEPLOYMENT',
      authorName: '김민재',
      images: [
        {
          src: getSamplePostImage('docker-fastapi-ci-cd'),
          alt: 'Docker와 배포 자동화를 상징하는 개발 환경 이미지',
        },
      ],
      markdown: `## 문제 상황

개발 서버와 운영 서버의 배포 절차가 달라서, 장애가 날 때마다 확인 포인트가 많았습니다.

## 목표

- 같은 방식으로 개발/운영 배포
- 실패 시 즉시 이전 버전으로 되돌리기
- 로그 확인 경로를 단일화하기

## 적용한 방식

1. Docker 이미지 태깅 규칙 통일
2. CI에서 테스트 통과 후 이미지 빌드
3. 배포 단계에서 헬스체크 실패 시 롤백

## 결과

- 배포 시간 단축
- 배포 실수 감소
- 이슈 재현 속도 향상`,
    },
    'hlab-v1-retro': {
      ...koPostRetro,
      heroTag: 'RETROSPECTIVE',
      authorName: '김민재',
      images: [
        {
          src: getSamplePostImage('hlab-v1-retro'),
          alt: '프로젝트 회고를 상징하는 노트북 작업 화면',
        },
      ],
      markdown: `## 왜 빠르게 만들었는가

초기에는 사용자 피드백을 빠르게 받는 것이 더 중요했습니다.

## 실제로 발생한 문제

- 컴포넌트 경계가 모호해졌고
- 상태 흐름 추적이 어려워졌습니다.

## 개선 과정

1. 페이지 단위 상태를 composable로 분리
2. 재사용 가능한 UI를 역할별로 재정의
3. API 실패 시 fallback 동작을 공통화

## 배운 점

빠른 실험은 좋지만, 기준 없는 확장은 반드시 비용으로 돌아옵니다.`,
    },
    'weekly-learning-system': {
      ...koPostSelfDev,
      heroTag: 'SELF DEV',
      authorName: '김민재',
      images: [
        {
          src: getSamplePostImage('weekly-learning-system'),
          alt: '학습 루틴 기록을 상징하는 개발자 작업 환경 이미지',
        },
      ],
      markdown: `## 주간 루틴 구조

- 월요일: 학습 목표 3개 설정
- 화요일~목요일: 실습 + 기록
- 금요일: 회고와 다음 주 조정

## 핵심 원칙

1. 목표는 작게 쪼갠다
2. 결과보다 기록을 우선한다
3. 다음 행동을 문장으로 남긴다

## 유지 전략

완벽한 계획보다, 중단 없이 반복 가능한 리듬을 먼저 만드는 것이 중요합니다.`,
    },
  },
  en: {
    'docker-fastapi-ci-cd': {
      ...enPostDocker,
      heroTag: 'DEPLOYMENT',
      authorName: 'Kim Minjae',
      images: [
        {
          src: getSamplePostImage('docker-fastapi-ci-cd'),
          alt: 'Development environment that represents Docker deployment automation',
        },
      ],
      markdown: `## Problem

Deployment steps were different between development and production, which increased failure points.

## Goal

- One consistent deployment process
- Fast rollback on failed health checks
- Unified log inspection path

## Approach

1. Standardized Docker image tags
2. Build images only after CI tests pass
3. Roll back automatically on failed health checks

## Outcome

- Faster deployments
- Fewer release mistakes
- Quicker incident reproduction`,
    },
    'hlab-v1-retro': {
      ...enPostRetro,
      heroTag: 'RETROSPECTIVE',
      authorName: 'Kim Minjae',
      images: [
        {
          src: getSamplePostImage('hlab-v1-retro'),
          alt: 'Notebook workspace representing project retrospectives',
        },
      ],
      markdown: `## Why I moved fast

At the early stage, getting feedback quickly was the top priority.

## What broke later

- Blurry component boundaries
- Harder state tracing

## Refactor path

1. Separated page-level state into composables
2. Redefined reusable UI by responsibility
3. Unified fallback behavior for API failures

## Lesson

Fast experiments are great, but unbounded growth always returns as maintenance cost.`,
    },
    'weekly-learning-system': {
      ...enPostSelfDev,
      heroTag: 'SELF DEV',
      authorName: 'Kim Minjae',
      images: [
        {
          src: getSamplePostImage('weekly-learning-system'),
          alt: 'Focused desk setup representing a weekly learning system',
        },
      ],
      markdown: `## Weekly structure

- Monday: set 3 learning targets
- Tue-Thu: practice + notes
- Friday: retrospective and adjustment

## Core principles

1. Break goals into smaller units
2. Prioritize records over outcomes
3. End each day with one clear next action

## Sustainability

A repeatable rhythm beats a perfect plan.`,
    },
  },
}

export const getFallbackBlogPostDetail = (locale: Locale, id: string): BlogPostDetail | null =>
  blogPostDetailsByLocale[locale][id] ?? null
