import type { Locale, PortfolioCopySet } from './types'
import { worksByLocale } from '@/entities/project'

export const portfolioCopyByLocale: Record<Locale, PortfolioCopySet> = {
  ko: {
    navWork: '작업',
    navPrinciples: '원칙',
    eyebrow: '백엔드 엔지니어 · 악성코드 분석가',
    heroTitle: 'McKinsey-style problem solving\n발본색원(拔本塞源)한 개발자',
    heroLead:
      '공학은 무한한 탐구의 여정입니다. 저는 이 여정에서 매일 새로운 도전을 즐기며, 깊이 있는 분석과 창의적인 솔루션을 통해 문제를 해결하는 것을 좋아합니다.',
    metrics: [
      { label: '프로젝트', value: '3' },
      { label: '방문자 수', value: '2' },
      { label: '보안+개발 경력', value: '0년' },
    ],
    workKicker: '주요 작업',
    workHeading: '대표 프로젝트',
    works: worksByLocale.ko,
    principlesKicker: '원칙',
    principlesHeading: '잡음을 줄이고, 의도를 선명하게.',
    principlesBody:
      '제 작업의 핵심은 사용자의 문제 본질을 탐색하고, 해당 문제를 해결해줄 명확한 해결책 1가지를 만드는 것입니다.',
    principles: [
      '장식보다 구조를 먼저 설계',
      '문제의 본질을 탐색하고 해결책을 명확히',
      '협업과 팀원들의 성장을 중시',
      '측정 가능한 성과 개선',
    ],
    footerName: '김민재',
  },
  en: {
    navWork: 'Work',
    navPrinciples: 'Principles',
    eyebrow: 'Backend Engineer · Malware Analyst',
    heroTitle: 'The Infinite World of Engineering',
    heroLead:
      'Engineering is an endless journey of exploration. On this journey, I enjoy taking on new challenges every day and solving problems through in-depth analysis and creative solutions.',
    metrics: [
      { label: 'Projects Worked On', value: '1' },
      { label: 'Visitors', value: '0' },
      { label: 'Security + Development Experience', value: '0 years' },
    ],
    workKicker: 'Key Projects',
    workHeading: 'Recent projects validated by business outcomes.',
    works: worksByLocale.en,
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
    footerName: 'Kim Minjae',
  },
}
