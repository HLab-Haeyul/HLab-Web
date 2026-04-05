import { computed, reactive, ref, watch } from 'vue'
import { usePortfolioCertificates } from '@/entities/certificate'
import { usePortfolioProfileContent } from '@/entities/profile'
import { useLocale } from '@/shared/lib/routing'
import type { AwardItem, CareerTimelineItem, CertificateItem } from '@/entities/portfolio'
import type { StackDetailItem } from '@/entities/stack'

type SectionTone = 'editable' | 'readonly'

type EditableSection = {
  id: string
  title: string
  description: string
  status: string
  tone: SectionTone
  metric: string
  helper: string
}

type OverviewStat = {
  id: string
  label: string
  value: string
  helper: string
}

type ChecklistItem = {
  id: string
  label: string
  description: string
  isComplete: boolean
  isOptional?: boolean
}

type CertificateInsight = {
  id: string
  label: string
  value: string
}

type CertificateDraft = {
  title: string
  issuer: string
  issuedAt: string
  credentialId: string
  imageSrc: string
  imageAlt: string
  description: string
  tagsInput: string
  status: string
}

type AwardDraft = {
  year: string
  title: string
  organizer: string
  imageSrc: string
  imageAlt: string
}

type CareerDraft = {
  category: string
  role: string
  organization: string
  startedAt: string
  endedAt: string
  periodLabel: string
  durationLabel: string
  summary: string
  highlightsInput: string
}

type StackDraft = {
  label: string
  category: string
  proficiency: string
  icon: string
  imageSrc: string
  imageAlt: string
  projectUsed: boolean
  practicalUsed: boolean
  internalsExplored: boolean
}

const createEmptyCertificateDraft = (): CertificateDraft => ({
  title: '',
  issuer: '',
  issuedAt: '',
  credentialId: '',
  imageSrc: '',
  imageAlt: '',
  description: '',
  tagsInput: '',
  status: '',
})

const createEmptyAwardDraft = (): AwardDraft => ({
  year: '',
  title: '',
  organizer: '',
  imageSrc: '',
  imageAlt: '',
})

const createEmptyCareerDraft = (): CareerDraft => ({
  category: '',
  role: '',
  organization: '',
  startedAt: '',
  endedAt: '',
  periodLabel: '',
  durationLabel: '',
  summary: '',
  highlightsInput: '',
})

const createEmptyStackDraft = (): StackDraft => ({
  label: '',
  category: '',
  proficiency: '',
  icon: '',
  imageSrc: '',
  imageAlt: '',
  projectUsed: false,
  practicalUsed: false,
  internalsExplored: false,
})

const parseTagsInput = (value: string) =>
  value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)

const parseHighlightsInput = (value: string) =>
  value
    .split('\n')
    .map((highlight) => highlight.trim())
    .filter(Boolean)

const cloneCertificate = (certificate: CertificateItem): CertificateItem => ({
  ...certificate,
  tags: [...certificate.tags],
})

const cloneAward = (award: AwardItem): AwardItem => ({
  ...award,
})

const cloneCareerTimelineItem = (item: CareerTimelineItem): CareerTimelineItem => ({
  ...item,
  highlights: [...item.highlights],
})

const cloneStackItem = (item: StackDetailItem): StackDetailItem => ({
  ...item,
  capability: {
    ...item.capability,
  },
})

const hasImage = (certificate: CertificateItem) => Boolean(certificate.imageSrc?.trim())

const hasIssuedInfo = (certificate: CertificateItem) =>
  Boolean(certificate.issuer.trim() && certificate.issuedAt.trim())

const hasDescription = (certificate: CertificateItem) => Boolean(certificate.description.trim())

const isPublishReady = (certificate: CertificateItem) =>
  Boolean(
    certificate.title.trim() &&
    hasIssuedInfo(certificate) &&
    hasDescription(certificate) &&
    hasImage(certificate) &&
    certificate.tags.length > 0,
  )

const certificateToDraft = (certificate: CertificateItem): CertificateDraft => ({
  title: certificate.title,
  issuer: certificate.issuer,
  issuedAt: certificate.issuedAt,
  credentialId: certificate.credentialId ?? '',
  imageSrc: certificate.imageSrc ?? '',
  imageAlt: certificate.imageAlt ?? '',
  description: certificate.description,
  tagsInput: certificate.tags.join(', '),
  status: certificate.status ?? '',
})

const draftToCertificate = (draft: CertificateDraft): CertificateItem => ({
  title: draft.title.trim(),
  issuer: draft.issuer.trim(),
  issuedAt: draft.issuedAt.trim(),
  credentialId: draft.credentialId.trim() || undefined,
  imageSrc: draft.imageSrc.trim() || undefined,
  imageAlt: draft.imageAlt.trim() || undefined,
  description: draft.description.trim(),
  tags: parseTagsInput(draft.tagsInput),
  status: draft.status.trim() || undefined,
})

const awardToDraft = (award: AwardItem): AwardDraft => ({
  year: award.year,
  title: award.title,
  organizer: award.organizer,
  imageSrc: award.imageSrc ?? '',
  imageAlt: award.imageAlt ?? '',
})

const draftToAward = (draft: AwardDraft): AwardItem => ({
  year: draft.year.trim(),
  title: draft.title.trim(),
  organizer: draft.organizer.trim(),
  imageSrc: draft.imageSrc.trim() || undefined,
  imageAlt: draft.imageAlt.trim() || undefined,
})

const createCareerId = (draft: CareerDraft) => {
  const seed = [draft.category, draft.role, draft.organization, draft.startedAt]
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
    .join('-')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9가-힣_-]/g, '')

  return seed || `career-${Date.now()}`
}

const careerToDraft = (item: CareerTimelineItem): CareerDraft => ({
  category: item.category,
  role: item.role,
  organization: item.organization,
  startedAt: item.startedAt,
  endedAt: item.endedAt ?? '',
  periodLabel: item.periodLabel,
  durationLabel: item.durationLabel,
  summary: item.summary,
  highlightsInput: item.highlights.join('\n'),
})

const draftToCareer = (draft: CareerDraft, existingId?: string): CareerTimelineItem => ({
  id: existingId ?? createCareerId(draft),
  category: draft.category.trim(),
  role: draft.role.trim(),
  organization: draft.organization.trim(),
  startedAt: draft.startedAt.trim(),
  endedAt: draft.endedAt.trim() || undefined,
  periodLabel: draft.periodLabel.trim(),
  durationLabel: draft.durationLabel.trim(),
  summary: draft.summary.trim(),
  highlights: parseHighlightsInput(draft.highlightsInput),
})

const stackItemToDraft = (item: StackDetailItem): StackDraft => ({
  label: item.label,
  category: item.category,
  proficiency: item.proficiency,
  icon: item.icon ?? '',
  imageSrc: item.imageSrc ?? '',
  imageAlt: item.imageAlt ?? '',
  projectUsed: item.capability.projectUsed,
  practicalUsed: item.capability.practicalUsed,
  internalsExplored: item.capability.internalsExplored,
})

const draftToStackItem = (draft: StackDraft): StackDetailItem => ({
  label: draft.label.trim(),
  category: draft.category.trim(),
  proficiency: draft.proficiency.trim(),
  icon: draft.icon.trim() || undefined,
  imageSrc: draft.imageSrc.trim() || undefined,
  imageAlt: draft.imageAlt.trim() || undefined,
  capability: {
    projectUsed: draft.projectUsed,
    practicalUsed: draft.practicalUsed,
    internalsExplored: draft.internalsExplored,
  },
})

export const useAdminPortfolioManagerPage = () => {
  const { locale, basePath, adminPath } = useLocale()
  const { certificates, saveCertificates, resetCertificates, defaultCertificates } =
    usePortfolioCertificates(locale)
  const {
    portfolioCopy,
    profileShowcase,
    stackDetail,
    heroTitle,
    awards,
    careerTimeline,
    stackItems,
    defaultAwards,
    defaultCareerTimeline,
    defaultStackItems,
    saveHeroTitle,
    saveAwards,
    saveCareerTimeline,
    saveStackItems,
    resetHeroTitle,
    resetAwards,
    resetCareerTimeline,
    resetStackItems,
  } = usePortfolioProfileContent(locale)

  const selectedCertificateIndex = ref<number | null>(certificates.value.length > 0 ? 0 : null)
  const selectedAwardIndex = ref<number | null>(awards.value.length > 0 ? 0 : null)
  const selectedCareerIndex = ref<number | null>(careerTimeline.value.length > 0 ? 0 : null)
  const selectedStackIndex = ref<number | null>(stackItems.value.length > 0 ? 0 : null)

  const heroTitleDraft = ref(heroTitle.value)
  const draft = reactive<CertificateDraft>(createEmptyCertificateDraft())
  const awardDraft = reactive<AwardDraft>(createEmptyAwardDraft())
  const careerDraft = reactive<CareerDraft>(createEmptyCareerDraft())
  const stackDraft = reactive<StackDraft>(createEmptyStackDraft())

  const titleFeedbackMessage = ref('')
  const certificateFeedbackMessage = ref('')
  const awardFeedbackMessage = ref('')
  const careerFeedbackMessage = ref('')
  const stackFeedbackMessage = ref('')

  const certificatesWithImagesCount = computed(
    () => certificates.value.filter((certificate) => hasImage(certificate)).length,
  )
  const certificatesWithIssuedInfoCount = computed(
    () => certificates.value.filter((certificate) => hasIssuedInfo(certificate)).length,
  )
  const certificatesReadyCount = computed(
    () => certificates.value.filter((certificate) => isPublishReady(certificate)).length,
  )
  const completionRate = computed(() => {
    if (certificates.value.length === 0) {
      return 0
    }

    return Math.round((certificatesReadyCount.value / certificates.value.length) * 100)
  })

  const editableSections = computed<EditableSection[]>(() => [
    {
      id: 'portfolio-hero',
      title: '메인 타이틀',
      description: '포트폴리오 첫 화면의 대표 타이틀을 줄 단위로 편집합니다.',
      status: '이 페이지에서 수정',
      tone: 'editable',
      metric: `${portfolioCopy.value.heroTitle.split('\n').length}줄 타이틀`,
      helper: 'localStorage 동기화',
    },
    {
      id: 'portfolio-metrics',
      title: '핵심 지표',
      description: '상단 카운터에 노출되는 프로젝트/방문자/경력 값을 관리합니다.',
      status: '코드 기반',
      tone: 'readonly',
      metric: `${portfolioCopy.value.metrics.length}개 지표`,
      helper: 'src/data/portfolio/copy.ts',
    },
    {
      id: 'portfolio-principles',
      title: '작업 원칙',
      description: '포트폴리오가 강조하는 작업 태도와 원칙 문구를 구성합니다.',
      status: '코드 기반',
      tone: 'readonly',
      metric: `${portfolioCopy.value.principles.length}개 문장`,
      helper: 'src/data/portfolio/copy.ts',
    },
    {
      id: 'portfolio-stack',
      title: '기술 스택',
      description: '포트폴리오 티커와 스택 상세 페이지에 쓰이는 기술 항목을 관리합니다.',
      status: '이 페이지에서 수정',
      tone: 'editable',
      metric: `${stackDetail.value.items.length}개 기술`,
      helper: 'localStorage 동기화',
    },
    {
      id: 'portfolio-career',
      title: '경력 타임라인',
      description: '멘토링, 외주, 실무 경험을 시간순 카드 형태로 관리합니다.',
      status: '이 페이지에서 수정',
      tone: 'editable',
      metric: `${profileShowcase.value.careerTimeline.length}개 경력`,
      helper: 'localStorage 동기화',
    },
    {
      id: 'portfolio-awards',
      title: '수상 경력',
      description: '수상 이력 리스트와 대표 이미지를 관리합니다.',
      status: '이 페이지에서 수정',
      tone: 'editable',
      metric: `${profileShowcase.value.awards.length}개 수상`,
      helper: 'localStorage 동기화',
    },
    {
      id: 'portfolio-certificates',
      title: '자격증 레일',
      description: '공개 페이지에서 자동 스크롤되는 자격증 카드 순서와 내용을 관리합니다.',
      status: '이 페이지에서 수정',
      tone: 'editable',
      metric: `${certificates.value.length}개 카드`,
      helper: 'localStorage 동기화',
    },
  ])

  const editableSectionCount = computed(
    () => editableSections.value.filter((section) => section.tone === 'editable').length,
  )
  const moduleCoverageLabel = computed(() =>
    locale.value === 'en'
      ? `${editableSectionCount.value} of ${editableSections.value.length} modules editable here`
      : `${editableSectionCount.value} / ${editableSections.value.length}개 모듈 이 페이지에서 편집 가능`,
  )
  const currentLocaleLabel = computed(() =>
    locale.value === 'en' ? 'English portfolio data' : '한국어 포트폴리오 데이터',
  )
  const currentLocaleDescription = computed(() =>
    locale.value === 'en'
      ? 'Title, stack, career, awards, and certificates are being edited for the English portfolio.'
      : '현재 경로 기준 메인 타이틀, 기술스택, 경력 타임라인, 수상 경력, 자격증 레일을 함께 수정합니다.',
  )
  const stackCountLabel = computed(() =>
    locale.value === 'en' ? `${stackItems.value.length} stack items` : `기술 ${stackItems.value.length}개`,
  )
  const awardCountLabel = computed(() =>
    locale.value === 'en' ? `${awards.value.length} awards` : `수상 ${awards.value.length}개`,
  )
  const careerCountLabel = computed(() =>
    locale.value === 'en'
      ? `${careerTimeline.value.length} career entries`
      : `경력 ${careerTimeline.value.length}개`,
  )
  const titleLineLabel = computed(() =>
    locale.value === 'en'
      ? `${portfolioCopy.value.heroTitle.split('\n').length} title lines`
      : `타이틀 ${portfolioCopy.value.heroTitle.split('\n').length}줄`,
  )

  const overviewStats = computed<OverviewStat[]>(() => [
    {
      id: 'hero-title-lines',
      label: locale.value === 'en' ? 'Hero Title' : '메인 타이틀',
      value: `${portfolioCopy.value.heroTitle.split('\n').length}`,
      helper:
        locale.value === 'en'
          ? 'Number of lines shown in the portfolio hero.'
          : '포트폴리오 첫 화면에 노출되는 타이틀 줄 수',
    },
    {
      id: 'stack-count',
      label: locale.value === 'en' ? 'Stack Items' : '기술 스택',
      value: String(stackItems.value.length),
      helper:
        locale.value === 'en'
          ? 'Used by both the ticker and the stack detail page.'
          : '티커와 스택 상세 페이지가 함께 참조하는 기술 항목 수',
    },
    {
      id: 'award-count',
      label: locale.value === 'en' ? 'Awards' : '수상 경력',
      value: String(awards.value.length),
      helper:
        locale.value === 'en'
          ? 'Shown in the timeline and the spotlight preview.'
          : '타임라인과 대표 미리보기에 함께 노출되는 수상 개수',
    },
    {
      id: 'career-count',
      label: locale.value === 'en' ? 'Career Entries' : '경력 타임라인',
      value: String(careerTimeline.value.length),
      helper:
        locale.value === 'en'
          ? 'Shown in the chronological career section.'
          : '공개 포트폴리오 커리어 섹션에 노출되는 경력 개수',
    },
    {
      id: 'certificate-ready',
      label: locale.value === 'en' ? 'Certificates Ready' : '자격증 게시 준비',
      value: `${completionRate.value}%`,
      helper:
        locale.value === 'en'
          ? 'Completion rate for the certificate rail.'
          : '자격증 레일에서 제목, 설명, 이미지, 태그가 채워진 비율',
    },
  ])

  const selectedCertificate = computed(() => {
    const index = selectedCertificateIndex.value

    if (index === null) {
      return null
    }

    return certificates.value[index] ?? null
  })
  const selectedAward = computed(() => {
    const index = selectedAwardIndex.value

    if (index === null) {
      return null
    }

    return awards.value[index] ?? null
  })
  const selectedCareer = computed(() => {
    const index = selectedCareerIndex.value

    if (index === null) {
      return null
    }

    return careerTimeline.value[index] ?? null
  })
  const selectedStackItem = computed(() => {
    const index = selectedStackIndex.value

    if (index === null) {
      return null
    }

    return stackItems.value[index] ?? null
  })

  const draftPreview = computed(() => draftToCertificate(draft))
  const awardDraftPreview = computed(() => draftToAward(awardDraft))
  const careerDraftPreview = computed(() =>
    draftToCareer(careerDraft, selectedCareer.value?.id ?? 'career-preview'),
  )
  const stackDraftPreview = computed(() => draftToStackItem(stackDraft))

  const isCreateMode = computed(() => selectedCertificateIndex.value === null)
  const isCreateAwardMode = computed(() => selectedAwardIndex.value === null)
  const isCreateCareerMode = computed(() => selectedCareerIndex.value === null)
  const isCreateStackMode = computed(() => selectedStackIndex.value === null)

  const hasSelectedCertificate = computed(() => Boolean(selectedCertificate.value))
  const hasSelectedAward = computed(() => Boolean(selectedAward.value))
  const hasSelectedCareer = computed(() => Boolean(selectedCareer.value))
  const hasSelectedStackItem = computed(() => Boolean(selectedStackItem.value))

  const editorTitle = computed(() => (isCreateMode.value ? '새 자격증 추가' : '선택한 자격증 수정'))
  const editorDescription = computed(() =>
    isCreateMode.value
      ? '이미지 URL 또는 파일을 넣고 저장하면 자격증 레일 오른쪽에 추가됩니다.'
      : '선택한 자격증의 텍스트와 이미지를 수정한 뒤 저장할 수 있습니다.',
  )
  const awardEditorTitle = computed(() =>
    isCreateAwardMode.value ? '새 수상 경력 추가' : '선택한 수상 경력 수정',
  )
  const awardEditorDescription = computed(() =>
    isCreateAwardMode.value
      ? '연도, 수상명, 주최 기관을 입력해 타임라인에 새 수상을 추가합니다.'
      : '선택한 수상 경력을 수정하거나 대표 이미지를 연결할 수 있습니다.',
  )
  const careerEditorTitle = computed(() =>
    isCreateCareerMode.value ? '새 경력 추가' : '선택한 경력 수정',
  )
  const careerEditorDescription = computed(() =>
    isCreateCareerMode.value
      ? '역할, 조직, 기간을 입력해 공개 포트폴리오 커리어 섹션에 새 항목을 추가합니다.'
      : '선택한 경력의 역할, 기간, 요약, 하이라이트를 수정합니다.',
  )
  const stackEditorTitle = computed(() =>
    isCreateStackMode.value ? '새 기술 스택 추가' : '선택한 기술 스택 수정',
  )
  const stackEditorDescription = computed(() =>
    isCreateStackMode.value
      ? '티커와 스택 상세에 함께 노출될 기술 항목을 새로 추가합니다.'
      : '선택한 기술의 카테고리, 숙련도, 사용 경험 토글을 수정합니다.',
  )

  const selectedOrderLabel = computed(() => {
    if (selectedCertificateIndex.value === null) {
      return locale.value === 'en' ? 'New draft' : '새 항목'
    }

    return `${String(selectedCertificateIndex.value + 1).padStart(2, '0')} / ${String(certificates.value.length).padStart(2, '0')}`
  })
  const selectedAwardOrderLabel = computed(() => {
    if (selectedAwardIndex.value === null) {
      return locale.value === 'en' ? 'New draft' : '새 항목'
    }

    return `${String(selectedAwardIndex.value + 1).padStart(2, '0')} / ${String(awards.value.length).padStart(2, '0')}`
  })
  const selectedCareerOrderLabel = computed(() => {
    if (selectedCareerIndex.value === null) {
      return locale.value === 'en' ? 'New draft' : '새 항목'
    }

    return `${String(selectedCareerIndex.value + 1).padStart(2, '0')} / ${String(careerTimeline.value.length).padStart(2, '0')}`
  })
  const selectedStackOrderLabel = computed(() => {
    if (selectedStackIndex.value === null) {
      return locale.value === 'en' ? 'New draft' : '새 항목'
    }

    return `${String(selectedStackIndex.value + 1).padStart(2, '0')} / ${String(stackItems.value.length).padStart(2, '0')}`
  })

  const canMoveSelectionUp = computed(
    () => selectedCertificateIndex.value !== null && selectedCertificateIndex.value > 0,
  )
  const canMoveSelectionDown = computed(
    () =>
      selectedCertificateIndex.value !== null &&
      selectedCertificateIndex.value < certificates.value.length - 1,
  )
  const canMoveAwardUp = computed(
    () => selectedAwardIndex.value !== null && selectedAwardIndex.value > 0,
  )
  const canMoveAwardDown = computed(
    () => selectedAwardIndex.value !== null && selectedAwardIndex.value < awards.value.length - 1,
  )
  const canMoveCareerUp = computed(
    () => selectedCareerIndex.value !== null && selectedCareerIndex.value > 0,
  )
  const canMoveCareerDown = computed(
    () =>
      selectedCareerIndex.value !== null &&
      selectedCareerIndex.value < careerTimeline.value.length - 1,
  )
  const canMoveStackUp = computed(
    () => selectedStackIndex.value !== null && selectedStackIndex.value > 0,
  )
  const canMoveStackDown = computed(
    () => selectedStackIndex.value !== null && selectedStackIndex.value < stackItems.value.length - 1,
  )

  const titleCharacterCount = computed(() => heroTitleDraft.value.trim().length)
  const titleLineCount = computed(() => {
    const normalized = heroTitleDraft.value
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    return normalized.length > 0 ? normalized.length : 1
  })

  const draftChecklist = computed<ChecklistItem[]>(() => [
    {
      id: 'certificate-title',
      label: locale.value === 'en' ? 'Title' : '자격증 제목',
      description:
        locale.value === 'en'
          ? 'Visible as the card headline.'
          : '카드에서 가장 먼저 보이는 헤드라인입니다.',
      isComplete: Boolean(draft.title.trim()),
    },
    {
      id: 'certificate-issued-info',
      label: locale.value === 'en' ? 'Issuer + Date' : '발급 기관 + 취득 날짜',
      description:
        locale.value === 'en'
          ? 'Needed to show when and where the credential came from.'
          : '자격증의 출처와 취득 시점을 함께 보여줍니다.',
      isComplete: Boolean(draft.issuer.trim() && draft.issuedAt.trim()),
    },
    {
      id: 'certificate-description',
      label: locale.value === 'en' ? 'Description' : '설명',
      description:
        locale.value === 'en'
          ? 'Used to explain what the certificate represents.'
          : '자격증이 어떤 역량을 증명하는지 설명합니다.',
      isComplete: Boolean(draft.description.trim()),
    },
    {
      id: 'certificate-tags',
      label: locale.value === 'en' ? 'Tags' : '태그',
      description:
        locale.value === 'en'
          ? 'Used as quick skill labels in the card.'
          : '기술 키워드를 짧게 보여주는 라벨입니다.',
      isComplete: parseTagsInput(draft.tagsInput).length > 0,
    },
    {
      id: 'certificate-image',
      label: locale.value === 'en' ? 'Certificate Image' : '자격증 이미지',
      description:
        locale.value === 'en'
          ? 'Strongly recommended for a trustworthy portfolio rail.'
          : '포트폴리오 신뢰도를 높이기 위해 이미지 연결을 권장합니다.',
      isComplete: Boolean(draft.imageSrc.trim()),
    },
    {
      id: 'certificate-credential-id',
      label: locale.value === 'en' ? 'Credential ID' : '인증 번호',
      description:
        locale.value === 'en'
          ? 'Optional, but useful when verification matters.'
          : '선택 입력이지만 검증 가능성을 높여 줍니다.',
      isComplete: Boolean(draft.credentialId.trim()),
      isOptional: true,
    },
  ])
  const checklistCompletedCount = computed(
    () => draftChecklist.value.filter((item) => item.isComplete).length,
  )
  const activeCertificateInsights = computed<CertificateInsight[]>(() => {
    const preview = draftPreview.value

    return [
      {
        id: 'certificate-order',
        label: locale.value === 'en' ? 'Rail Order' : '레일 순서',
        value: selectedOrderLabel.value,
      },
      {
        id: 'certificate-image',
        label: locale.value === 'en' ? 'Image' : '이미지',
        value: preview.imageSrc?.trim()
          ? locale.value === 'en'
            ? 'Connected'
            : '연결됨'
          : locale.value === 'en'
            ? 'Missing'
            : '없음',
      },
      {
        id: 'certificate-tags',
        label: locale.value === 'en' ? 'Tags' : '태그',
        value: locale.value === 'en' ? `${preview.tags.length} tags` : `${preview.tags.length}개`,
      },
      {
        id: 'certificate-issued',
        label: locale.value === 'en' ? 'Issued Info' : '발급 정보',
        value: hasIssuedInfo(preview)
          ? locale.value === 'en'
            ? 'Complete'
            : '완료'
          : locale.value === 'en'
            ? 'Needs input'
            : '입력 필요',
      },
      {
        id: 'certificate-readiness',
        label: locale.value === 'en' ? 'Readiness' : '게시 준비도',
        value: isPublishReady(preview)
          ? locale.value === 'en'
            ? 'Ready'
            : '게시 가능'
          : locale.value === 'en'
            ? 'Draft'
            : '작성 중',
      },
    ]
  })

  const applyDraft = (certificate: CertificateItem | null) => {
    Object.assign(
      draft,
      certificate ? certificateToDraft(certificate) : createEmptyCertificateDraft(),
    )
  }

  const applyAwardDraft = (award: AwardItem | null) => {
    Object.assign(awardDraft, award ? awardToDraft(award) : createEmptyAwardDraft())
  }

  const applyCareerDraft = (item: CareerTimelineItem | null) => {
    Object.assign(careerDraft, item ? careerToDraft(item) : createEmptyCareerDraft())
  }

  const applyStackDraft = (item: StackDetailItem | null) => {
    Object.assign(stackDraft, item ? stackItemToDraft(item) : createEmptyStackDraft())
  }

  const selectCertificate = (index: number) => {
    if (index < 0 || index >= certificates.value.length) {
      return
    }

    selectedCertificateIndex.value = index
    certificateFeedbackMessage.value = ''
  }

  const selectAwardEntry = (index: number) => {
    if (index < 0 || index >= awards.value.length) {
      return
    }

    selectedAwardIndex.value = index
    awardFeedbackMessage.value = ''
  }

  const selectCareerEntry = (index: number) => {
    if (index < 0 || index >= careerTimeline.value.length) {
      return
    }

    selectedCareerIndex.value = index
    careerFeedbackMessage.value = ''
  }

  const selectStackEntry = (index: number) => {
    if (index < 0 || index >= stackItems.value.length) {
      return
    }

    selectedStackIndex.value = index
    stackFeedbackMessage.value = ''
  }

  const startCreatingCertificate = () => {
    selectedCertificateIndex.value = null
    applyDraft(null)
    certificateFeedbackMessage.value = ''
  }

  const startCreatingAward = () => {
    selectedAwardIndex.value = null
    applyAwardDraft(null)
    awardFeedbackMessage.value = ''
  }

  const startCreatingCareerEntry = () => {
    selectedCareerIndex.value = null
    applyCareerDraft(null)
    careerFeedbackMessage.value = ''
  }

  const startCreatingStackItem = () => {
    selectedStackIndex.value = null
    applyStackDraft(null)
    stackFeedbackMessage.value = ''
  }

  const moveSelectedCertificate = (direction: 'up' | 'down') => {
    const index = selectedCertificateIndex.value

    if (index === null) {
      return
    }

    const targetIndex = direction === 'up' ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= certificates.value.length) {
      return
    }

    const nextCertificates = certificates.value.map((certificate) => cloneCertificate(certificate))
    const currentCertificate = nextCertificates[index]
    const nextCertificate = nextCertificates[targetIndex]

    if (!currentCertificate || !nextCertificate) {
      return
    }

    nextCertificates[index] = nextCertificate
    nextCertificates[targetIndex] = currentCertificate
    saveCertificates(nextCertificates)
    selectedCertificateIndex.value = targetIndex
    certificateFeedbackMessage.value =
      locale.value === 'en' ? 'Certificate order updated.' : '자격증 순서를 변경했습니다.'
  }

  const moveSelectedAward = (direction: 'up' | 'down') => {
    const index = selectedAwardIndex.value

    if (index === null) {
      return
    }

    const targetIndex = direction === 'up' ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= awards.value.length) {
      return
    }

    const nextAwards = awards.value.map((award) => cloneAward(award))
    const currentAward = nextAwards[index]
    const targetAward = nextAwards[targetIndex]

    if (!currentAward || !targetAward) {
      return
    }

    nextAwards[index] = targetAward
    nextAwards[targetIndex] = currentAward
    saveAwards(nextAwards)
    selectedAwardIndex.value = targetIndex
    awardFeedbackMessage.value =
      locale.value === 'en' ? 'Award order updated.' : '수상 경력 순서를 변경했습니다.'
  }

  const moveSelectedCareer = (direction: 'up' | 'down') => {
    const index = selectedCareerIndex.value

    if (index === null) {
      return
    }

    const targetIndex = direction === 'up' ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= careerTimeline.value.length) {
      return
    }

    const nextCareerTimeline = careerTimeline.value.map((item) => cloneCareerTimelineItem(item))
    const currentEntry = nextCareerTimeline[index]
    const targetEntry = nextCareerTimeline[targetIndex]

    if (!currentEntry || !targetEntry) {
      return
    }

    nextCareerTimeline[index] = targetEntry
    nextCareerTimeline[targetIndex] = currentEntry
    saveCareerTimeline(nextCareerTimeline)
    selectedCareerIndex.value = targetIndex
    careerFeedbackMessage.value =
      locale.value === 'en' ? 'Career order updated.' : '경력 순서를 변경했습니다.'
  }

  const moveSelectedStackItem = (direction: 'up' | 'down') => {
    const index = selectedStackIndex.value

    if (index === null) {
      return
    }

    const targetIndex = direction === 'up' ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= stackItems.value.length) {
      return
    }

    const nextItems = stackItems.value.map((item) => cloneStackItem(item))
    const currentItem = nextItems[index]
    const targetItem = nextItems[targetIndex]

    if (!currentItem || !targetItem) {
      return
    }

    nextItems[index] = targetItem
    nextItems[targetIndex] = currentItem
    saveStackItems(nextItems)
    selectedStackIndex.value = targetIndex
    stackFeedbackMessage.value =
      locale.value === 'en' ? 'Stack order updated.' : '기술 스택 순서를 변경했습니다.'
  }

  const duplicateSelectedCertificate = () => {
    const index = selectedCertificateIndex.value
    const target = selectedCertificate.value

    if (index === null || !target) {
      return
    }

    const duplicatedCertificate: CertificateItem = {
      ...target,
      title: locale.value === 'en' ? `${target.title} Copy` : `${target.title} 복사본`,
      tags: [...target.tags],
    }
    const nextCertificates = certificates.value.map((certificate) => cloneCertificate(certificate))
    nextCertificates.splice(index + 1, 0, duplicatedCertificate)
    saveCertificates(nextCertificates)
    selectedCertificateIndex.value = index + 1
    certificateFeedbackMessage.value =
      locale.value === 'en' ? 'Certificate duplicated.' : '선택한 자격증을 복제했습니다.'
  }

  const resetDraft = () => {
    applyDraft(selectedCertificate.value)
    certificateFeedbackMessage.value =
      locale.value === 'en' ? 'Draft reset.' : '편집 중인 내용을 초기화했습니다.'
  }

  const resetAwardDraft = () => {
    applyAwardDraft(selectedAward.value)
    awardFeedbackMessage.value =
      locale.value === 'en' ? 'Draft reset.' : '수상 경력 편집 내용을 초기화했습니다.'
  }

  const resetCareerDraft = () => {
    applyCareerDraft(selectedCareer.value)
    careerFeedbackMessage.value =
      locale.value === 'en' ? 'Draft reset.' : '경력 편집 내용을 초기화했습니다.'
  }

  const resetStackDraft = () => {
    applyStackDraft(selectedStackItem.value)
    stackFeedbackMessage.value =
      locale.value === 'en' ? 'Draft reset.' : '기술 스택 편집 내용을 초기화했습니다.'
  }

  const resetHeroTitleDraft = () => {
    heroTitleDraft.value = heroTitle.value
    titleFeedbackMessage.value =
      locale.value === 'en' ? 'Title draft reset.' : '메인 타이틀 편집 내용을 초기화했습니다.'
  }

  const saveCurrentHeroTitle = () => {
    const nextTitle = heroTitleDraft.value.trim()

    if (!nextTitle) {
      if (typeof window !== 'undefined') {
        window.alert(locale.value === 'en' ? 'Hero title is required.' : '메인 타이틀은 필수입니다.')
      }

      return
    }

    saveHeroTitle(nextTitle)
    titleFeedbackMessage.value =
      locale.value === 'en' ? 'Hero title updated.' : '메인 타이틀을 저장했습니다.'
  }

  const restoreDefaultHeroTitle = () => {
    if (typeof window !== 'undefined') {
      const confirmed = window.confirm(
        locale.value === 'en'
          ? 'Restore the default hero title for this locale?'
          : '현재 로케일 메인 타이틀을 기본값으로 되돌리시겠습니까?',
      )

      if (!confirmed) {
        return
      }
    }

    resetHeroTitle()
    titleFeedbackMessage.value =
      locale.value === 'en' ? 'Default hero title restored.' : '메인 타이틀을 기본값으로 되돌렸습니다.'
  }

  const saveCurrentCertificate = () => {
    const nextCertificate = draftToCertificate(draft)

    if (!nextCertificate.title) {
      if (typeof window !== 'undefined') {
        window.alert(
          locale.value === 'en' ? 'Certificate title is required.' : '자격증 제목은 필수입니다.',
        )
      }

      return
    }

    const nextCertificates = certificates.value.map((certificate) => cloneCertificate(certificate))

    if (selectedCertificateIndex.value === null) {
      nextCertificates.push(nextCertificate)
      saveCertificates(nextCertificates)
      selectedCertificateIndex.value = nextCertificates.length - 1
      certificateFeedbackMessage.value =
        locale.value === 'en' ? 'Certificate added.' : '새 자격증을 추가했습니다.'
      return
    }

    if (selectedCertificateIndex.value >= nextCertificates.length) {
      return
    }

    nextCertificates[selectedCertificateIndex.value] = nextCertificate
    saveCertificates(nextCertificates)
    certificateFeedbackMessage.value =
      locale.value === 'en' ? 'Certificate updated.' : '자격증 정보를 저장했습니다.'
  }

  const saveCurrentAward = () => {
    const nextAward = draftToAward(awardDraft)

    if (!nextAward.title) {
      if (typeof window !== 'undefined') {
        window.alert(locale.value === 'en' ? 'Award title is required.' : '수상명은 필수입니다.')
      }

      return
    }

    const nextAwards = awards.value.map((award) => cloneAward(award))

    if (selectedAwardIndex.value === null) {
      nextAwards.push(nextAward)
      saveAwards(nextAwards)
      selectedAwardIndex.value = nextAwards.length - 1
      awardFeedbackMessage.value =
        locale.value === 'en' ? 'Award added.' : '새 수상 경력을 추가했습니다.'
      return
    }

    if (selectedAwardIndex.value >= nextAwards.length) {
      return
    }

    nextAwards[selectedAwardIndex.value] = nextAward
    saveAwards(nextAwards)
    awardFeedbackMessage.value =
      locale.value === 'en' ? 'Award updated.' : '수상 경력을 저장했습니다.'
  }

  const saveCurrentCareer = () => {
    const nextCareer = draftToCareer(careerDraft, selectedCareer.value?.id)

    if (!nextCareer.role) {
      if (typeof window !== 'undefined') {
        window.alert(locale.value === 'en' ? 'Career role is required.' : '경력 역할은 필수입니다.')
      }

      return
    }

    const nextCareerTimeline = careerTimeline.value.map((item) => cloneCareerTimelineItem(item))

    if (selectedCareerIndex.value === null) {
      nextCareerTimeline.push(nextCareer)
      saveCareerTimeline(nextCareerTimeline)
      selectedCareerIndex.value = nextCareerTimeline.length - 1
      careerFeedbackMessage.value =
        locale.value === 'en' ? 'Career entry added.' : '새 경력 항목을 추가했습니다.'
      return
    }

    if (selectedCareerIndex.value >= nextCareerTimeline.length) {
      return
    }

    nextCareerTimeline[selectedCareerIndex.value] = nextCareer
    saveCareerTimeline(nextCareerTimeline)
    careerFeedbackMessage.value =
      locale.value === 'en' ? 'Career entry updated.' : '경력 항목을 저장했습니다.'
  }

  const saveCurrentStackItem = () => {
    const nextItem = draftToStackItem(stackDraft)

    if (!nextItem.label) {
      if (typeof window !== 'undefined') {
        window.alert(locale.value === 'en' ? 'Stack label is required.' : '기술 이름은 필수입니다.')
      }

      return
    }

    const nextItems = stackItems.value.map((item) => cloneStackItem(item))

    if (selectedStackIndex.value === null) {
      nextItems.push(nextItem)
      saveStackItems(nextItems)
      selectedStackIndex.value = nextItems.length - 1
      stackFeedbackMessage.value =
        locale.value === 'en' ? 'Stack item added.' : '새 기술 스택을 추가했습니다.'
      return
    }

    if (selectedStackIndex.value >= nextItems.length) {
      return
    }

    nextItems[selectedStackIndex.value] = nextItem
    saveStackItems(nextItems)
    stackFeedbackMessage.value =
      locale.value === 'en' ? 'Stack item updated.' : '기술 스택 정보를 저장했습니다.'
  }

  const deleteSelectedCertificate = () => {
    const index = selectedCertificateIndex.value
    const target = selectedCertificate.value

    if (index === null || !target) {
      return
    }

    if (typeof window !== 'undefined') {
      const confirmed = window.confirm(
        locale.value === 'en'
          ? `Delete "${target.title}"?`
          : `"${target.title}" 자격증을 삭제하시겠습니까?`,
      )

      if (!confirmed) {
        return
      }
    }

    const nextCertificates = certificates.value.filter((_, currentIndex) => currentIndex !== index)
    saveCertificates(nextCertificates)

    if (nextCertificates.length === 0) {
      selectedCertificateIndex.value = null
      applyDraft(null)
    } else {
      selectedCertificateIndex.value = Math.min(index, nextCertificates.length - 1)
    }

    certificateFeedbackMessage.value =
      locale.value === 'en' ? 'Certificate removed.' : '자격증을 삭제했습니다.'
  }

  const deleteSelectedAward = () => {
    const index = selectedAwardIndex.value
    const target = selectedAward.value

    if (index === null || !target) {
      return
    }

    if (typeof window !== 'undefined') {
      const confirmed = window.confirm(
        locale.value === 'en'
          ? `Delete "${target.title}"?`
          : `"${target.title}" 수상 경력을 삭제하시겠습니까?`,
      )

      if (!confirmed) {
        return
      }
    }

    const nextAwards = awards.value.filter((_, currentIndex) => currentIndex !== index)
    saveAwards(nextAwards)

    if (nextAwards.length === 0) {
      selectedAwardIndex.value = null
      applyAwardDraft(null)
    } else {
      selectedAwardIndex.value = Math.min(index, nextAwards.length - 1)
    }

    awardFeedbackMessage.value =
      locale.value === 'en' ? 'Award removed.' : '수상 경력을 삭제했습니다.'
  }

  const deleteSelectedCareer = () => {
    const index = selectedCareerIndex.value
    const target = selectedCareer.value

    if (index === null || !target) {
      return
    }

    if (typeof window !== 'undefined') {
      const confirmed = window.confirm(
        locale.value === 'en'
          ? `Delete "${target.role}"?`
          : `"${target.role}" 경력 항목을 삭제하시겠습니까?`,
      )

      if (!confirmed) {
        return
      }
    }

    const nextCareerTimeline = careerTimeline.value.filter((_, currentIndex) => currentIndex !== index)
    saveCareerTimeline(nextCareerTimeline)

    if (nextCareerTimeline.length === 0) {
      selectedCareerIndex.value = null
      applyCareerDraft(null)
    } else {
      selectedCareerIndex.value = Math.min(index, nextCareerTimeline.length - 1)
    }

    careerFeedbackMessage.value =
      locale.value === 'en' ? 'Career entry removed.' : '경력 항목을 삭제했습니다.'
  }

  const deleteSelectedStackItem = () => {
    const index = selectedStackIndex.value
    const target = selectedStackItem.value

    if (index === null || !target) {
      return
    }

    if (typeof window !== 'undefined') {
      const confirmed = window.confirm(
        locale.value === 'en'
          ? `Delete "${target.label}"?`
          : `"${target.label}" 기술 스택을 삭제하시겠습니까?`,
      )

      if (!confirmed) {
        return
      }
    }

    const nextItems = stackItems.value.filter((_, currentIndex) => currentIndex !== index)
    saveStackItems(nextItems)

    if (nextItems.length === 0) {
      selectedStackIndex.value = null
      applyStackDraft(null)
    } else {
      selectedStackIndex.value = Math.min(index, nextItems.length - 1)
    }

    stackFeedbackMessage.value =
      locale.value === 'en' ? 'Stack item removed.' : '기술 스택을 삭제했습니다.'
  }

  const restoreDefaultCertificates = () => {
    if (typeof window !== 'undefined') {
      const confirmed = window.confirm(
        locale.value === 'en'
          ? 'Restore the default certificate list for this locale?'
          : '현재 로케일 자격증 목록을 기본값으로 되돌리시겠습니까?',
      )

      if (!confirmed) {
        return
      }
    }

    resetCertificates()
    selectedCertificateIndex.value = defaultCertificates.value.length > 0 ? 0 : null
    certificateFeedbackMessage.value =
      locale.value === 'en'
        ? 'Default certificate list restored.'
        : '기본 자격증 목록으로 되돌렸습니다.'
  }

  const restoreDefaultAwards = () => {
    if (typeof window !== 'undefined') {
      const confirmed = window.confirm(
        locale.value === 'en'
          ? 'Restore the default awards for this locale?'
          : '현재 로케일 수상 경력을 기본값으로 되돌리시겠습니까?',
      )

      if (!confirmed) {
        return
      }
    }

    resetAwards()
    selectedAwardIndex.value = defaultAwards.value.length > 0 ? 0 : null
    awardFeedbackMessage.value =
      locale.value === 'en' ? 'Default awards restored.' : '기본 수상 경력으로 되돌렸습니다.'
  }

  const restoreDefaultCareerTimeline = () => {
    if (typeof window !== 'undefined') {
      const confirmed = window.confirm(
        locale.value === 'en'
          ? 'Restore the default career timeline for this locale?'
          : '현재 로케일 경력 타임라인을 기본값으로 되돌리시겠습니까?',
      )

      if (!confirmed) {
        return
      }
    }

    resetCareerTimeline()
    selectedCareerIndex.value = defaultCareerTimeline.value.length > 0 ? 0 : null
    careerFeedbackMessage.value =
      locale.value === 'en'
        ? 'Default career timeline restored.'
        : '기본 경력 타임라인으로 되돌렸습니다.'
  }

  const restoreDefaultStackItems = () => {
    if (typeof window !== 'undefined') {
      const confirmed = window.confirm(
        locale.value === 'en'
          ? 'Restore the default stack items for this locale?'
          : '현재 로케일 기술 스택을 기본값으로 되돌리시겠습니까?',
      )

      if (!confirmed) {
        return
      }
    }

    resetStackItems()
    selectedStackIndex.value = defaultStackItems.value.length > 0 ? 0 : null
    stackFeedbackMessage.value =
      locale.value === 'en' ? 'Default stack restored.' : '기본 기술 스택으로 되돌렸습니다.'
  }

  const clearDraftImage = () => {
    draft.imageSrc = ''
    draft.imageAlt = ''
    certificateFeedbackMessage.value =
      locale.value === 'en' ? 'Draft image removed.' : '초안 이미지를 제거했습니다.'
  }

  const clearAwardDraftImage = () => {
    awardDraft.imageSrc = ''
    awardDraft.imageAlt = ''
    awardFeedbackMessage.value =
      locale.value === 'en' ? 'Draft image removed.' : '수상 경력 이미지를 제거했습니다.'
  }

  const handleSelectCertificateImage = (event: Event) => {
    const input = event.target as HTMLInputElement | null
    const file = input?.files?.[0]

    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      if (typeof window !== 'undefined') {
        window.alert(
          locale.value === 'en'
            ? 'Only image files are allowed.'
            : '이미지 파일만 선택할 수 있습니다.',
        )
      }

      input.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''

      if (!result) {
        return
      }

      draft.imageSrc = result

      if (!draft.imageAlt.trim()) {
        draft.imageAlt = file.name.replace(/\.[^.]+$/, '')
      }

      certificateFeedbackMessage.value =
        locale.value === 'en' ? 'Image loaded into the draft.' : '이미지를 편집 폼에 불러왔습니다.'
    }
    reader.readAsDataURL(file)
    input.value = ''
  }

  const handleSelectAwardImage = (event: Event) => {
    const input = event.target as HTMLInputElement | null
    const file = input?.files?.[0]

    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      if (typeof window !== 'undefined') {
        window.alert(
          locale.value === 'en'
            ? 'Only image files are allowed.'
            : '이미지 파일만 선택할 수 있습니다.',
        )
      }

      input.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''

      if (!result) {
        return
      }

      awardDraft.imageSrc = result

      if (!awardDraft.imageAlt.trim()) {
        awardDraft.imageAlt = file.name.replace(/\.[^.]+$/, '')
      }

      awardFeedbackMessage.value =
        locale.value === 'en'
          ? 'Award image loaded into the draft.'
          : '수상 경력 이미지를 편집 폼에 불러왔습니다.'
    }
    reader.readAsDataURL(file)
    input.value = ''
  }

  watch(
    () => locale.value,
    () => {
      heroTitleDraft.value = heroTitle.value
      selectedCertificateIndex.value = certificates.value.length > 0 ? 0 : null
      selectedAwardIndex.value = awards.value.length > 0 ? 0 : null
      selectedCareerIndex.value = careerTimeline.value.length > 0 ? 0 : null
      selectedStackIndex.value = stackItems.value.length > 0 ? 0 : null
      titleFeedbackMessage.value = ''
      certificateFeedbackMessage.value = ''
      awardFeedbackMessage.value = ''
      careerFeedbackMessage.value = ''
      stackFeedbackMessage.value = ''
    },
    { immediate: true },
  )

  watch(
    () => heroTitle.value,
    (nextTitle) => {
      heroTitleDraft.value = nextTitle
    },
    { immediate: true },
  )

  watch(
    [() => selectedCertificateIndex.value, () => certificates.value],
    () => {
      const currentIndex = selectedCertificateIndex.value

      if (currentIndex !== null && currentIndex >= certificates.value.length) {
        selectedCertificateIndex.value =
          certificates.value.length > 0 ? certificates.value.length - 1 : null
        return
      }

      applyDraft(selectedCertificate.value)
    },
    { immediate: true },
  )

  watch(
    [() => selectedAwardIndex.value, () => awards.value],
    () => {
      const currentIndex = selectedAwardIndex.value

      if (currentIndex !== null && currentIndex >= awards.value.length) {
        selectedAwardIndex.value = awards.value.length > 0 ? awards.value.length - 1 : null
        return
      }

      applyAwardDraft(selectedAward.value)
    },
    { immediate: true },
  )

  watch(
    [() => selectedCareerIndex.value, () => careerTimeline.value],
    () => {
      const currentIndex = selectedCareerIndex.value

      if (currentIndex !== null && currentIndex >= careerTimeline.value.length) {
        selectedCareerIndex.value =
          careerTimeline.value.length > 0 ? careerTimeline.value.length - 1 : null
        return
      }

      applyCareerDraft(selectedCareer.value)
    },
    { immediate: true },
  )

  watch(
    [() => selectedStackIndex.value, () => stackItems.value],
    () => {
      const currentIndex = selectedStackIndex.value

      if (currentIndex !== null && currentIndex >= stackItems.value.length) {
        selectedStackIndex.value = stackItems.value.length > 0 ? stackItems.value.length - 1 : null
        return
      }

      applyStackDraft(selectedStackItem.value)
    },
    { immediate: true },
  )

  return {
    basePath,
    adminPath,
    editableSections,
    overviewStats,
    currentLocaleLabel,
    currentLocaleDescription,
    moduleCoverageLabel,
    stackCountLabel,
    awardCountLabel,
    careerCountLabel,
    titleLineLabel,
    heroTitleDraft,
    titleFeedbackMessage,
    titleCharacterCount,
    titleLineCount,
    saveCurrentHeroTitle,
    resetHeroTitleDraft,
    restoreDefaultHeroTitle,
    certificates,
    selectedCertificateIndex,
    selectedCertificate,
    draft,
    draftPreview,
    draftChecklist,
    checklistCompletedCount,
    activeCertificateInsights,
    certificateFeedbackMessage,
    isCreateMode,
    hasSelectedCertificate,
    selectedOrderLabel,
    canMoveSelectionUp,
    canMoveSelectionDown,
    editorTitle,
    editorDescription,
    selectCertificate,
    startCreatingCertificate,
    moveSelectedCertificate,
    duplicateSelectedCertificate,
    saveCurrentCertificate,
    deleteSelectedCertificate,
    resetDraft,
    restoreDefaultCertificates,
    clearDraftImage,
    handleSelectCertificateImage,
    awards,
    selectedAwardIndex,
    selectedAward,
    awardDraft,
    awardDraftPreview,
    awardFeedbackMessage,
    isCreateAwardMode,
    hasSelectedAward,
    selectedAwardOrderLabel,
    canMoveAwardUp,
    canMoveAwardDown,
    awardEditorTitle,
    awardEditorDescription,
    selectAwardEntry,
    startCreatingAward,
    moveSelectedAward,
    saveCurrentAward,
    deleteSelectedAward,
    resetAwardDraft,
    restoreDefaultAwards,
    clearAwardDraftImage,
    handleSelectAwardImage,
    careerTimeline,
    selectedCareerIndex,
    selectedCareer,
    careerDraft,
    careerDraftPreview,
    careerFeedbackMessage,
    isCreateCareerMode,
    hasSelectedCareer,
    selectedCareerOrderLabel,
    canMoveCareerUp,
    canMoveCareerDown,
    careerEditorTitle,
    careerEditorDescription,
    selectCareerEntry,
    startCreatingCareerEntry,
    moveSelectedCareer,
    saveCurrentCareer,
    deleteSelectedCareer,
    resetCareerDraft,
    restoreDefaultCareerTimeline,
    stackItems,
    selectedStackIndex,
    selectedStackItem,
    stackDraft,
    stackDraftPreview,
    stackFeedbackMessage,
    isCreateStackMode,
    hasSelectedStackItem,
    selectedStackOrderLabel,
    canMoveStackUp,
    canMoveStackDown,
    stackEditorTitle,
    stackEditorDescription,
    selectStackEntry,
    startCreatingStackItem,
    moveSelectedStackItem,
    saveCurrentStackItem,
    deleteSelectedStackItem,
    resetStackDraft,
    restoreDefaultStackItems,
  }
}
