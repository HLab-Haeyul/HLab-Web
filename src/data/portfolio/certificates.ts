import type { Locale, PortfolioCertificatesCopy } from './types'

export const portfolioCertificatesByLocale: Record<Locale, PortfolioCertificatesCopy> = {
  ko: {
    kicker: 'Certificates',
    heading: '자격증',
    body: '',
    issuerLabel: '발급 기관',
    issuedAtLabel: '취득일',
    credentialIdLabel: '인증 번호',
    imageHint: '이미지가 추가되면 자격증 캡처나 스캔본이 이 칸에 표시됩니다.',
    emptyTitle: '등록된 자격증이 없습니다.',
    emptyBody: '자격증 데이터를 추가하면 이 영역에 카드가 바로 표시됩니다.',
    certificates: [
      {
        title: '백엔드 관련 자격증',
        issuer: '등록 준비 중',
        issuedAt: '추가 예정',
        credentialId: 'BACKEND SLOT',
        description: '정보처리기사나 데이터, 서버 운영과 연결되는 자격증을 게시하는 칸입니다.',
        tags: ['Backend', 'Server', 'Data'],
        status: '게시 칸',
      },
      {
        title: '보안 관련 자격증',
        issuer: '등록 준비 중',
        issuedAt: '추가 예정',
        credentialId: 'SECURITY SLOT',
        description:
          '보안 분석, 시스템 이해, 취약점 대응 역량을 보여주는 자격증을 정리할 수 있습니다.',
        tags: ['Security', 'Infra', 'Analysis'],
        status: '게시 칸',
      },
      {
        title: '클라우드 및 인프라 자격증',
        issuer: '등록 준비 중',
        issuedAt: '추가 예정',
        credentialId: 'CLOUD SLOT',
        description: '배포, 네트워크, 운영 자동화와 연결되는 자격증을 묶어서 보여주는 칸입니다.',
        tags: ['Cloud', 'Deploy', 'Network'],
        status: '게시 칸',
      },
    ],
  },
  en: {
    kicker: 'Certificates',
    heading: 'Certificate Slots',
    body: '',
    issuerLabel: 'Issuer',
    issuedAtLabel: 'Issued',
    credentialIdLabel: 'Credential ID',
    imageHint: 'When an image is added later, the certificate scan or screenshot will appear here.',
    emptyTitle: 'No certificates are registered yet.',
    emptyBody: 'Add certificate data and cards will appear here immediately.',
    certificates: [
      {
        title: 'Backend Certificate Slot',
        issuer: 'Waiting for entry',
        issuedAt: 'To be added',
        credentialId: 'BACKEND SLOT',
        description:
          'Use this card for backend, data, or server-related certificates once the real record is available.',
        tags: ['Backend', 'Server', 'Data'],
        status: 'Slot',
      },
      {
        title: 'Security Certificate Slot',
        issuer: 'Waiting for entry',
        issuedAt: 'To be added',
        credentialId: 'SECURITY SLOT',
        description:
          'Use this card for security analysis, system hardening, or incident response certificates.',
        tags: ['Security', 'Infra', 'Analysis'],
        status: 'Slot',
      },
      {
        title: 'Cloud and Infrastructure Slot',
        issuer: 'Waiting for entry',
        issuedAt: 'To be added',
        credentialId: 'CLOUD SLOT',
        description: 'Use this card for deployment, networking, and infrastructure certifications.',
        tags: ['Cloud', 'Deploy', 'Network'],
        status: 'Slot',
      },
    ],
  },
}
