import type { CertificateItem, Locale, PortfolioCertificatesCopy } from './types'

const koCertificates: CertificateItem[] = [
  {
    title: '정보처리 산업기사',
    issuer: '한국산업인력공단',
    issuedAt: '',
    description:
      '소프트웨어 개발, 운영, 데이터 처리에 대한 실무 역량을 검증하는 국가기술자격입니다.',
    tags: [],
  },
  {
    title: '네트워크 관리사 2급',
    issuer: '한국정보통신자격협회',
    issuedAt: '',
    description:
      '네트워크 구축, 운영, 관리에 대한 기본 역량을 검증하는 자격입니다.',
    tags: [],
  },
]

const enCertificates: CertificateItem[] = [
  {
    title: 'Industrial Engineer Information Processing',
    issuer: 'HRDKOREA',
    issuedAt: '',
    description:
      'National technical certification covering software development, operations, and data processing fundamentals.',
    tags: [],
  },
  {
    title: 'Network Administrator Level 2',
    issuer: 'Korea Information Communication Qualification Association',
    issuedAt: '',
    description:
      'Certification focused on fundamental skills for network setup, operations, and administration.',
    tags: [],
  },
]

export const portfolioCertificatesByLocale: Record<Locale, PortfolioCertificatesCopy> = {
  ko: {
    kicker: 'Certificates',
    heading: '자격증',
    body: '보유 중인 자격증입니다.',
    issuerLabel: '발급 기관',
    issuedAtLabel: '취득 날짜',
    credentialIdLabel: '인증 번호',
    imageHint: '이미지를 추가하면 자격증 스캔본이 이 영역에 표시됩니다.',
    emptyTitle: '등록된 자격증이 없습니다.',
    emptyBody: '자격증을 추가하면 이 영역에 표시됩니다.',
    certificates: koCertificates,
  },
  en: {
    kicker: 'Certificates',
    heading: 'Certificates',
    body: 'Current professional certifications.',
    issuerLabel: 'Issuer',
    issuedAtLabel: 'Issued On',
    credentialIdLabel: 'Credential ID',
    imageHint: 'Add an image to display the certificate scan or screenshot here.',
    emptyTitle: 'No certificates are registered yet.',
    emptyBody: 'Add certificate entries and they will appear here.',
    certificates: enCertificates,
  },
}
