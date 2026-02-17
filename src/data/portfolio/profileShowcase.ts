import type { Locale, ProfileShowcaseCopy } from './types'

export const profileShowcaseByLocale: Record<Locale, ProfileShowcaseCopy> = {
  ko: {
    kicker: 'Awards',
    heading: '수상 경력',
    photoTitle: '내 사진',
    photoHint: '프로필 사진 준비 중',
    photoSrc: './assets/images/MyPicture.jpg',
    photoAlt: 'Sample profile portrait',
    awardsTitle: '수상 경력',
    awards: [
      {
        year: '2025',
        title: '서울대학교 SCSC 온라인 해커톤 (최우수상, 1등)',
        organizer: 'SCSC 연구 동호회',
      },
      {
        year: '2025',
        title: 'WHITEHACK CONST (10등)',
        organizer: 'BSSM',
      },
      {
        year: '2025',
        title: '2025 BSSM 전공 동아리 대회 (장려상, 6등)',
        organizer: 'BSSM',
      },
      {
        year: '2024',
        title: '2024 동계 AppJam (최우수상, 1등)',
        organizer: 'AppJam',
      },
      {
        year: '2024',
        title: '2024 동계 AppJam (최우수상, 1등)',
        organizer: 'AppJam',
      },
      {
        year: '2024',
        title: '2024 부경대학교 정보보안 영제 교육 (우수 학생)',
        organizer: '부경대학교 영제교육원',
      },
      {
        year: '2024',
        title: 'BSSM 2024 하계 해커톤 (인기상, 4등)',
        organizer: 'BSSM',
      }
    ],
  },
  en: {
    kicker: 'Awards',
    heading: 'Awards & Achievements',
    photoTitle: 'My Photo',
    photoHint: 'Profile photo coming soon',
    photoSrc: './assets/images/MyPicture.jpg',
    photoAlt: 'Sample profile portrait',
    awardsTitle: 'Awards & Achievements',
    awards: [
      {
        year: '2025',
        title: 'Seoul National University SCSC Online Hackathon (Grand Prize, 1st Place)',
        organizer: 'SCSC Research Club',
      },
      {
        year: '2025',
        title: 'WHITEHACK CONST (10th Place)',
        organizer: 'BSSM',
      },
      {
        year: '2025',
        title: '2025 BSSM Major Club Competition (Encouragement Award, 6th Place)',
        organizer: 'BSSM',
      },
      {
        year: '2024',
        title: '2024 Winter AppJam (Grand Prize, 1st Place)',
        organizer: 'AppJam',
      },
      {
        year: '2024',
        title: '2024 Winter AppJam (Grand Prize, 1st Place)',
        organizer: 'AppJam',
      },
      {
        year: '2024',
        title: '2024 Pukyong National University Information Security Gifted Program (Outstanding Student)',
        organizer: 'Pukyong National University Gifted Education Center',
      },
      {
        year: '2024',
        title: 'BSSM 2024 Summer Hackathon (Popularity Award, 4th Place)',
        organizer: 'BSSM',
      },
    ],
  },
}
