import type { Locale, ProfileShowcaseCopy } from './types'
import myPictureSrc from '@/shared/assets/images/MyPicture.jpeg'

const appJamAwardImageSrc = `${import.meta.env.BASE_URL}downloads/APPJam.jpeg`
const whiteHatAwardImageSrc = `${import.meta.env.BASE_URL}downloads/WhiteHat.jpeg`

export const profileShowcaseByLocale: Record<Locale, ProfileShowcaseCopy> = {
  ko: {
    kicker: 'Achievements',
    heading: '수상 기록 및 자격증',
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
        imageSrc: appJamAwardImageSrc,
        imageAlt: '2024 동계 AppJam 최우수상 상장',
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
        imageSrc: whiteHatAwardImageSrc,
        imageAlt: 'WHITEHACK CONST 수상 증빙 이미지',
      },
      {
        year: '2025',
        title: '서울대학교 SCSC 온라인 해커톤 (최우수상, 1등)',
        organizer: 'SCSC 연구 동호회',
      },
    ],
    certificatesTitle: '자격증',
    certificatesEmptyLabel: '자격증 이력을 추가하면 이곳에 표시됩니다.',
    certificatesDateLabel: '취득 날짜',
    certificates: [
      {
        year: '2025',
        title: '정보처리 산업기사',
        organizer: '한국산업인력공단',
        description: '소프트웨어 설계·개발·데이터베이스·운영 등 정보처리 실무 역량을 검증합니다.',
        acquiredDate: '2025.07',
      },
      {
        year: '2025',
        title: '네트워크 관리사 2급',
        organizer: '한국정보통신자격협회',
        description: 'TCP/IP, 라우팅, 스위칭, 네트워크 운영 및 보안 기초 역량을 검증합니다.',
        acquiredDate: '2025.09.30',
      },
    ],
    experiencesTitle: '추가 정보',
    experiencesEmptyLabel: '추가 정보를 입력하면 이곳에 표시됩니다.',
    experiences: [
      {
        year: '2025',
        title: '밴드부 - 보컬',
        organizer: 'BSSM',
        description: '교내 밴드부에서 보컬로 참여하며 공연을 기획하고 팀 협업 경험을 쌓았습니다.',
      },
      {
        year: '2025',
        title: '개발 멘토링',
        organizer: 'BSSM',
        description:
          '후배 대상 개발 멘토링을 진행하며 실습 중심의 코드 리뷰와 학습 지도를 수행했습니다.',
      },
      {
        year: '2025',
        title: '해킹 멘토링',
        organizer: 'BSSM',
        description:
          '보안 기초부터 CTF 문제 풀이까지 해킹 멘토링을 진행하며 문제 해결 과정을 코칭했습니다.',
      },
    ],
    hobbiesTitle: '취미',
    hobbiesEmptyLabel: '취미를 추가하면 이곳에 표시됩니다.',
    hobbies: [
      {
        name: '독서',
        description: '기술서와 인문서를 꾸준히 읽으며 사고의 폭을 넓히고 있습니다.',
      },
      {
        name: '운동',
        description: '체력과 집중력 유지를 위해 규칙적으로 운동하고 있습니다.',
      },
      {
        name: '사진',
        description: '일상과 풍경을 기록하며 시각적 관찰력과 표현력을 기르고 있습니다.',
      },
      {
        name: '플래서 만들기',
        description: '아이디어를 구체화해 플래서를 직접 만들며 창작을 즐깁니다.',
      },
    ],
  },
  en: {
    kicker: 'Achievements',
    heading: 'Awards & Certifications',
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
        imageSrc: appJamAwardImageSrc,
        imageAlt: '2024 Winter AppJam grand prize certificate',
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
        imageSrc: whiteHatAwardImageSrc,
        imageAlt: 'WHITEHACK CONST award proof image',
      },
      {
        year: '2025',
        title: 'Seoul National University SCSC Online Hackathon (Grand Prize, 1st Place)',
        organizer: 'SCSC Research Club',
      },
    ],
    certificatesTitle: 'Certifications',
    certificatesEmptyLabel: 'Add certification history to show it here.',
    certificatesDateLabel: 'Acquired Date',
    certificates: [
      {
        year: '2025',
        title: 'Industrial Engineer Information Processing',
        organizer: 'Human Resources Development Service of Korea',
        description:
          'Validates practical capabilities across software design, development, database, and operations.',
        acquiredDate: '2025.07',
      },
      {
        year: '2025',
        title: 'Network Administrator Level 2',
        organizer: 'Korea Information Communication Qualification Association',
        description:
          'Validates fundamentals of TCP/IP, routing, switching, network operations, and security.',
        acquiredDate: '2025.09.30',
      },
    ],
    experiencesTitle: 'Additional Information',
    experiencesEmptyLabel: 'Add additional information entries to show them here.',
    experiences: [
      {
        year: '2025',
        title: 'Band Club - Vocal',
        organizer: 'BSSM',
        description:
          'Participated as a vocalist in the school band club, planning performances and collaborating with team members.',
      },
      {
        year: '2025',
        title: 'Development Mentoring',
        organizer: 'BSSM',
        description:
          'Mentored junior students with practice-oriented code reviews and structured learning guidance.',
      },
      {
        year: '2025',
        title: 'Hacking Mentoring',
        organizer: 'BSSM',
        description:
          'Led hacking mentoring sessions from security fundamentals to CTF problem-solving workflows.',
      },
    ],
    hobbiesTitle: 'Hobbies',
    hobbiesEmptyLabel: 'Add hobbies to show them here.',
    hobbies: [
      {
        name: 'Reading',
        description: 'I regularly read technical and humanities books to broaden my perspective.',
      },
      {
        name: 'Workout',
        description: 'I exercise consistently to maintain stamina and concentration.',
      },
      {
        name: 'Photography',
        description: 'I capture daily moments and landscapes to build visual observation skills.',
      },
      {
        name: 'Plasher Making',
        description: 'I enjoy turning ideas into tangible outputs by making plashers.',
      },
    ],
  },
}
