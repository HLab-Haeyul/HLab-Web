import type { Locale, ProfileShowcaseCopy } from './types'

export const profileShowcaseByLocale: Record<Locale, ProfileShowcaseCopy> = {
  ko: {
    kicker: 'Awards',
    heading: '수상 경력',
    photoTitle: '내 사진',
    photoHint: '프로필 사진 준비 중',
    photoSrc: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
    photoAlt: 'Sample profile portrait',
    awardsTitle: '수상 경력',
    awards: [
      {
        year: '2024',
        title: 'HLab Security Challenge 대상',
        organizer: 'HLab',
      },
      {
        year: '2023',
        title: 'KISA 버그바운티 우수 리포트',
        organizer: 'KISA',
      },
      {
        year: '2022',
        title: 'Malware Analysis Contest 장려상',
        organizer: 'Security Community',
      },
    ],
  },
  en: {
    kicker: 'Awards',
    heading: 'Awards',
    photoTitle: 'My Photo',
    photoHint: 'Profile photo coming soon',
    photoSrc: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
    photoAlt: 'Sample profile portrait',
    awardsTitle: 'Awards',
    awards: [
      {
        year: '2024',
        title: 'Grand Prize, HLab Security Challenge',
        organizer: 'HLab',
      },
      {
        year: '2023',
        title: 'Outstanding Bug Bounty Report',
        organizer: 'KISA',
      },
      {
        year: '2022',
        title: 'Honorable Mention, Malware Analysis Contest',
        organizer: 'Security Community',
      },
    ],
  },
}
