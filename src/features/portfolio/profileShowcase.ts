import type { Locale, ProfileShowcaseCopy } from './types'

export const profileShowcaseByLocale: Record<Locale, ProfileShowcaseCopy> = {
  ko: {
    kicker: 'Profile',
    heading: '사진과 수상 경력',
    photoTitle: '내 사진',
    photoHint: '여기에 본인 사진 경로를 넣으세요 (예: /images/profile.jpg)',
    photoUploadLabel: '얼굴 사진 업로드',
    photoUploadHint: '또는 profileShowcase.ts의 photoSrc에 이미지 경로를 넣으세요.',
    photoSrc: '',
    photoAlt: 'Kim Minjae profile photo',
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
    kicker: 'Profile',
    heading: 'Photo and Awards',
    photoTitle: 'My Photo',
    photoHint: 'Set your photo path here (e.g. /images/profile.jpg)',
    photoUploadLabel: 'Upload profile photo',
    photoUploadHint: 'Or set an image path in profileShowcase.ts photoSrc.',
    photoSrc: '',
    photoAlt: 'Kim Minjae profile photo',
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
