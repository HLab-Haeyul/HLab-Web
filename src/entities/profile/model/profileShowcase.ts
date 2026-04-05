import type { Locale, ProfileShowcaseCopy } from './types'
import myPictureSrc from '@/shared/assets/images/MyPicture.jpeg'

export const profileShowcaseByLocale: Record<Locale, ProfileShowcaseCopy> = {
  ko: {
    kicker: 'Awards',
    heading: '수상 경력',
    photoTitle: '내 사진',
    photoHint: '프로필 사진 준비 중',
    photoSrc: myPictureSrc,
    photoAlt: 'Sample profile portrait',
    awardsTitle: '수상 경력',
    awardPreviewLabel: '수상 미리보기',
    selectedAwardLabel: '선택한 수상',
    awardPreviewHintWithImage: '선택한 수상에 연결된 이미지를 보고 있습니다.',
    awardPreviewHintWithoutImage: '실제 수상 사진이 추가되면 이 영역에 바로 표시됩니다.',
    careerKicker: 'Career',
    careerHeading: '나의 커리어',
    careerBody:
      '멘토링, 외주, 회사 혹은 팀 단위 실무 경험을 시간순으로 정리해 어떤 역할을 맡아왔는지 보여주는 섹션입니다.',
    careerEmptyTitle: '커리어 타임라인 준비 중',
    careerEmptyBody:
      '멘토링 진행, 외주 프로젝트, 회사/팀 실무 경험을 시작 시점, 종료 시점, 총 기간과 함께 여기에 추가할 수 있습니다.',
    careerTimeline: [],
    awards: [
      {
        year: '2024',
        title: 'BSSM 2024 하계 해커톤 (인기상, 4등)',
        organizer: 'BSSM',
      },
      {
        year: '2024',
        title: '2024 부경대학교 정보보안 영재 교육 (우수 학생)',
        organizer: '부경대학교 영재교육원',
      },
      {
        year: '2024',
        title: '2024 동계 AppJam (최우수상, 1등)',
        organizer: 'AppJam',
      },
      {
        year: '2025',
        title: '2025 BSSM 전공 동아리 대회 (장려상, 6등)',
        organizer: 'BSSM',
      },
      {
        year: '2025',
        title: 'WHITEHACK CONST (10등)',
        organizer: 'BSSM',
      },
      {
        year: '2025',
        title: '서울대학교 SCSC 온라인 해커톤 (최우수상, 1등)',
        organizer: 'SCSC 연구 동호회',
      },
    ],
  },
  en: {
    kicker: 'Awards',
    heading: 'Awards & Achievements',
    photoTitle: 'My Photo',
    photoHint: 'Profile photo coming soon',
    photoSrc: myPictureSrc,
    photoAlt: 'Sample profile portrait',
    awardsTitle: 'Awards & Achievements',
    awardPreviewLabel: 'Award Preview',
    selectedAwardLabel: 'Selected Award',
    awardPreviewHintWithImage: 'Showing the image linked to this award.',
    awardPreviewHintWithoutImage: 'When an award image is added later, it will appear here.',
    careerKicker: 'Career',
    careerHeading: 'Career Timeline',
    careerBody:
      'A chronological section for mentoring, freelance, and company experience so readers can see how responsibilities have expanded over time.',
    careerEmptyTitle: 'Career timeline coming soon',
    careerEmptyBody:
      'Add mentoring, freelance, and in-house experience here with start date, end date, and total duration.',
    careerTimeline: [],
    awards: [
      {
        year: '2024',
        title: 'BSSM 2024 Summer Hackathon (Popularity Award, 4th Place)',
        organizer: 'BSSM',
      },
      {
        year: '2024',
        title:
          '2024 Pukyong National University Information Security Gifted Program (Outstanding Student)',
        organizer: 'Pukyong National University Gifted Education Center',
      },
      {
        year: '2024',
        title: '2024 Winter AppJam (Grand Prize, 1st Place)',
        organizer: 'AppJam',
      },
      {
        year: '2025',
        title: '2025 BSSM Major Club Competition (Encouragement Award, 6th Place)',
        organizer: 'BSSM',
      },
      {
        year: '2025',
        title: 'WHITEHACK CONST (10th Place)',
        organizer: 'BSSM',
      },
      {
        year: '2025',
        title: 'Seoul National University SCSC Online Hackathon (Grand Prize, 1st Place)',
        organizer: 'SCSC Research Club',
      },
    ],
  },
}
