import type { Locale, ProfileShowcaseCopy } from './types'

export const profileShowcaseByLocale: Record<Locale, ProfileShowcaseCopy> = {
  ko: {
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
