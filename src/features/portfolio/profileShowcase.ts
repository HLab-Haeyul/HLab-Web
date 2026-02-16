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
        imageSrc:
          'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80',
        imageAlt: '대회 시상식 메달과 트로피 사진',
      },
      {
        year: '2023',
        title: 'KISA 버그바운티 우수 리포트',
        organizer: 'KISA',
        imageSrc:
          'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80',
        imageAlt: '보안 리포트와 노트북이 놓인 작업 환경 사진',
      },
      {
        year: '2022',
        title: 'Malware Analysis Contest 장려상',
        organizer: 'Security Community',
        imageSrc:
          'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
        imageAlt: '발표장 무대와 참가자 사진',
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
        imageSrc:
          'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Award ceremony with medal and trophy',
      },
      {
        year: '2023',
        title: 'Outstanding Bug Bounty Report',
        organizer: 'KISA',
        imageSrc:
          'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Security report and laptop workspace',
      },
      {
        year: '2022',
        title: 'Honorable Mention, Malware Analysis Contest',
        organizer: 'Security Community',
        imageSrc:
          'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Conference stage and participants',
      },
    ],
  },
}
