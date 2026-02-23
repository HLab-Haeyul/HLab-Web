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

export const blogPageCopyByLocale: Record<Locale, BlogPageCopySet> = {
  ko: {
    kicker: 'STUDY ARCHIVE',
    heading: '내가 공부한 기록을 쌓는 블로그',
    description:
      '기술 실험, 프로젝트 회고, 자기 개발 루틴을 한 곳에 정리합니다. 실제 게시글은 API 연동 후 표시됩니다.',
    popularKicker: '인기 글',
    popularHeading: '인기글',
    popularDescription: '표시할 인기 글이 없습니다.',
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
    popularPosts: [],
    posts: [],
  },
  en: {
    kicker: 'STUDY ARCHIVE',
    heading: 'A blog to track what I learn',
    description:
      'Technical experiments, retrospectives, and growth notes are shown here once the API is connected.',
    popularKicker: 'Popular Posts',
    popularHeading: 'Popular Posts',
    popularDescription: 'No popular posts available yet.',
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
    popularPosts: [],
    posts: [],
  },
}

export const blogPostDetailsByLocale: Record<Locale, Record<string, BlogPostDetail>> = {
  ko: {},
  en: {},
}

export const getFallbackBlogPostDetail = (_locale: Locale, _id: string): BlogPostDetail | null => null
