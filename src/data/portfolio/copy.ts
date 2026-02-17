import type { Locale, PortfolioCopySet } from './types'
import { worksByLocale } from './works'

export const portfolioCopyByLocale: Record<Locale, PortfolioCopySet> = {
  ko: {
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
    works: worksByLocale.ko,
    principlesKicker: 'Principles',
    principlesHeading: 'Reduce noise, clarify intent.',
    principlesBody:
      'The core of my work is exploring the root of user problems and delivering one clear solution that solves them.',
    principles: [
      'Design structure before decoration',
      'Identify the root problem and define a clear solution',
      'Value collaboration and team growth',
      'Improve outcomes with measurable results',
    ],
    contactKicker: 'Collaboration Inquiry',
    contactHeading: 'Let’s build highly polished black-minimal product experiences together.',
    emailCta: 'Send an Email',
    githubCta: 'View GitHub',
    footerName: 'Kim Minjae',
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
    contactKicker: 'Collaboration Inquiry',
    contactHeading: 'Let’s build highly polished black-minimal product experiences together.',
    emailCta: 'Send an Email',
    githubCta: 'View GitHub',
    footerName: 'Kim Minjae',
  },
}
