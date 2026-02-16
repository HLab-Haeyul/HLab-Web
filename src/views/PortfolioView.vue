<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

type Locale = 'ko' | 'en'

type WorkItem = {
  title: string
  summary: string
  impact: string
  stack: string[]
}

type MetricItem = {
  label: string
  value: string
}

type CopySet = {
  navWork: string
  navPrinciples: string
  navContact: string
  eyebrow: string
  heroTitle: string
  heroLead: string
  primaryCta: string
  secondaryCta: string
  metrics: MetricItem[]
  workKicker: string
  workHeading: string
  works: WorkItem[]
  principlesKicker: string
  principlesHeading: string
  principlesBody: string
  principles: string[]
  contactKicker: string
  contactHeading: string
  emailCta: string
  githubCta: string
  footerName: string
}

const copyByLocale: Record<Locale, CopySet> = {
  ko: {
    navWork: '작업',
    navPrinciples: '원칙',
    navContact: '연락',
    eyebrow: '프론트엔드 엔지니어 · 프로덕트 경험 설계',
    heroTitle: '화이트 중심 블랙 미니멀, 명확함과 임팩트를 위해 설계합니다.',
    heroLead:
      '짙은 다크 그레이(#0f0f0f~#121212) 기반 위에 여백과 타이포를 정교하게 배치해, 사용자의 판단과 행동이 자연스럽게 이어지는 인터페이스를 만듭니다.',
    primaryCta: '주요 작업 보기',
    secondaryCta: '프로젝트 시작하기',
    metrics: [
      { label: '출시 프로젝트', value: '14+' },
      { label: '평균 Lighthouse', value: '96' },
      { label: '디자인+개발 경력', value: '7년' },
    ],
    workKicker: '주요 작업',
    workHeading: '비즈니스 성과로 검증된 최근 프로젝트입니다.',
    works: [
      {
        title: 'HLab 운영 대시보드',
        summary:
          '복잡한 운영 데이터를 의사결정 중심 구조로 재정렬해, 팀이 핵심 상태를 더 빠르게 파악하도록 개선했습니다.',
        impact: '업무 완료율 +31%',
        stack: ['Vue 3', 'TypeScript', 'ECharts'],
      },
      {
        title: '입학 모집 캠페인 랜딩',
        summary:
          '에디토리얼 구조와 CTA 흐름을 재설계해 콘텐츠 집중도를 높이고 문의 전환을 끌어올렸습니다.',
        impact: '문의 전환율 +22%',
        stack: ['Vite', 'A/B Testing', 'SEO'],
      },
      {
        title: '관리자 디자인 시스템',
        summary:
          '간격/타이포/컴포넌트 규칙을 토큰 기반으로 표준화해 디자인-개발 간 오차를 크게 줄였습니다.',
        impact: '기능 출시 속도 1.8배',
        stack: ['Design Tokens', 'Storybook', 'CI'],
      },
    ],
    principlesKicker: '원칙',
    principlesHeading: '잡음을 줄이고, 의도를 선명하게.',
    principlesBody:
      '제 작업의 핵심은 화면에서 애매함을 제거하는 것입니다. 타이포, 간격, 인터랙션을 한 방향으로 정렬해 사용자가 빠르고 확신 있게 결정하도록 돕습니다.',
    principles: [
      '장식보다 구조를 먼저 설계',
      '첫 화면 가독성을 최우선',
      '컴포넌트 동작의 예측 가능성',
      '측정 가능한 성능 개선',
    ],
    contactKicker: '협업 문의',
    contactHeading: '높은 완성도의 블랙 미니멀 제품 경험을 함께 만듭니다.',
    emailCta: '이메일 보내기',
    githubCta: 'GitHub 보기',
    footerName: '김민재',
  },
  en: {
    navWork: 'Work',
    navPrinciples: 'Principles',
    navContact: 'Contact',
    eyebrow: 'Frontend Engineer · Product Experience',
    heroTitle: 'White-forward black minimal, built for clarity and impact.',
    heroLead:
      'I design interfaces on a deep dark base (#0f0f0f~#121212), using disciplined whitespace and typography to make every decision feel obvious.',
    primaryCta: 'View Selected Work',
    secondaryCta: 'Start a Project',
    metrics: [
      { label: 'Products shipped', value: '14+' },
      { label: 'Average Lighthouse', value: '96' },
      { label: 'Design + dev span', value: '7 years' },
    ],
    workKicker: 'Selected Work',
    workHeading: 'Recent projects with measurable business outcomes.',
    works: [
      {
        title: 'HLab Operations Dashboard',
        summary:
          'Reframed complex operational data into a decision-first interface with cleaner hierarchy and faster daily workflows.',
        impact: 'Task completion +31%',
        stack: ['Vue 3', 'TypeScript', 'ECharts'],
      },
      {
        title: 'Enrollment Campaign Landing',
        summary:
          'Built a high-conversion landing with editorial structure, focused CTA flow, and performance-safe motion.',
        impact: 'Inquiry conversion +22%',
        stack: ['Vite', 'A/B Testing', 'SEO'],
      },
      {
        title: 'Design System for Admin Suite',
        summary:
          'Standardized core UI blocks with tokenized spacing and typography to reduce design-dev mismatch.',
        impact: 'Feature delivery 1.8x faster',
        stack: ['Design Tokens', 'Storybook', 'CI'],
      },
    ],
    principlesKicker: 'Principles',
    principlesHeading: 'Less noise. More precision.',
    principlesBody:
      'My focus is to cut ambiguity from interfaces. Typography, spacing, and interaction all align to one goal: helping users decide quickly with confidence.',
    principles: [
      'Structure before decoration',
      'Readable first interaction',
      'Predictable component behavior',
      'Measurable performance gains',
    ],
    contactKicker: 'Open for collaborations',
    contactHeading: 'Let’s build focused digital products with strong visual discipline.',
    emailCta: 'Send Email',
    githubCta: 'View GitHub',
    footerName: 'Kim Minjae',
  },
}

const route = useRoute()
const locale = computed<Locale>(() => (route.path.startsWith('/en') ? 'en' : 'ko'))
const copy = computed(() => copyByLocale[locale.value])
const currentYear = new Date().getFullYear()
</script>

<template>
  <div class="minimal-page">
    <div class="grid-overlay" aria-hidden="true"></div>

    <header class="topbar reveal" style="--delay: 0.04s">
      <a class="brand" href="#">KIMMINJAE</a>
      <nav class="menu" aria-label="Primary">
        <a href="#work">{{ copy.navWork }}</a>
        <a href="#principles">{{ copy.navPrinciples }}</a>
        <a href="#contact">{{ copy.navContact }}</a>
      </nav>
      <div class="right-controls">
        <a class="mail" href="mailto:hello@kimminje.dev">hello@kimminje.dev</a>
        <div class="lang-switch" aria-label="Language switch">
          <RouterLink class="lang-btn" :class="{ active: locale === 'ko' }" to="/ko">KO</RouterLink>
          <RouterLink class="lang-btn" :class="{ active: locale === 'en' }" to="/en">EN</RouterLink>
        </div>
      </div>
    </header>

    <main>
      <section class="hero">
        <p class="eyebrow reveal" style="--delay: 0.08s">{{ copy.eyebrow }}</p>
        <h1 class="reveal" style="--delay: 0.14s">{{ copy.heroTitle }}</h1>
        <p class="lead reveal" style="--delay: 0.2s">{{ copy.heroLead }}</p>
        <div class="hero-actions reveal" style="--delay: 0.26s">
          <a class="btn btn-solid" href="#work">{{ copy.primaryCta }}</a>
          <a class="btn btn-ghost" href="#contact">{{ copy.secondaryCta }}</a>
        </div>
      </section>

      <section class="metrics">
        <article
          v-for="(item, index) in copy.metrics"
          :key="item.label"
          class="metric reveal"
          :style="{ '--delay': `${0.14 + index * 0.06}s` }"
        >
          <p>{{ item.label }}</p>
          <strong>{{ item.value }}</strong>
        </article>
      </section>

      <section id="work" class="section">
        <div class="section-head reveal" style="--delay: 0.05s">
          <p>{{ copy.workKicker }}</p>
          <h2>{{ copy.workHeading }}</h2>
        </div>
        <div class="work-grid">
          <article
            v-for="(work, index) in copy.works"
            :key="work.title"
            class="work-card reveal"
            :style="{ '--delay': `${0.08 * (index + 1)}s` }"
          >
            <h3>{{ work.title }}</h3>
            <p>{{ work.summary }}</p>
            <strong>{{ work.impact }}</strong>
            <ul>
              <li v-for="item in work.stack" :key="`${work.title}-${item}`">{{ item }}</li>
            </ul>
          </article>
        </div>
      </section>

      <section id="principles" class="section split">
        <article class="split-main reveal" style="--delay: 0.1s">
          <p>{{ copy.principlesKicker }}</p>
          <h2>{{ copy.principlesHeading }}</h2>
          <p>{{ copy.principlesBody }}</p>
        </article>
        <article class="split-side reveal" style="--delay: 0.18s">
          <ul>
            <li v-for="rule in copy.principles" :key="rule">{{ rule }}</li>
          </ul>
        </article>
      </section>

      <section id="contact" class="contact reveal" style="--delay: 0.22s">
        <p>{{ copy.contactKicker }}</p>
        <h2>{{ copy.contactHeading }}</h2>
        <div class="hero-actions">
          <a class="btn btn-solid" href="mailto:hello@kimminje.dev">{{ copy.emailCta }}</a>
          <a class="btn btn-ghost" href="https://github.com" target="_blank" rel="noopener">
            {{ copy.githubCta }}
          </a>
        </div>
      </section>
    </main>

    <footer class="footer">
      <p>© {{ currentYear }} {{ copy.footerName }}</p>
    </footer>
  </div>
</template>

<style scoped>
.minimal-page {
  position: relative;
  isolation: isolate;
  width: min(1220px, 100%);
  margin: 0 auto;
  padding: 1.2rem clamp(1rem, 4vw, 3rem) 3.4rem;
}

.grid-overlay {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(circle at 18% -4%, rgba(255, 255, 255, 0.08), transparent 30%),
    radial-gradient(circle at 82% 108%, rgba(255, 255, 255, 0.07), transparent 34%);
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.88), rgba(0, 0, 0, 0.42));
}

.topbar {
  position: sticky;
  top: 1.05rem;
  z-index: 8;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  align-items: center;
  margin-bottom: clamp(2.2rem, 7vw, 5.8rem);
  padding: 0.82rem 1rem;
  border: 1px solid var(--line-soft);
  border-radius: 14px;
  background: rgba(18, 18, 18, 0.82);
  backdrop-filter: blur(10px);
}

.brand {
  letter-spacing: 0.14em;
  font-size: 0.82rem;
  font-weight: 700;
}

.menu {
  display: flex;
  justify-content: center;
  gap: 1.2rem;
}

.menu a,
.mail {
  color: var(--text-muted);
  font-size: 0.9rem;
  transition: color 160ms ease;
}

.menu a:hover,
.menu a:focus-visible,
.mail:hover,
.mail:focus-visible {
  color: var(--text-strong);
}

.right-controls {
  display: flex;
  align-items: center;
  gap: 0.62rem;
}

.lang-switch {
  display: inline-flex;
  border: 1px solid var(--line-soft);
  border-radius: 999px;
  padding: 0.14rem;
}

.lang-btn {
  min-width: 2.2rem;
  padding: 0.2rem 0.44rem;
  border-radius: 999px;
  color: var(--text-muted);
  font-size: 0.73rem;
  text-align: center;
  letter-spacing: 0.08em;
  transition:
    color 160ms ease,
    background-color 160ms ease;
}

.lang-btn.active {
  background: #ffffff;
  color: #101010;
}

.hero {
  padding-top: clamp(0.7rem, 3vw, 2.2rem);
}

.eyebrow {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.78rem;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.hero h1 {
  margin: 0.8rem 0 0;
  max-width: 17ch;
  font-family: var(--font-display);
  font-size: clamp(2.3rem, 6vw, 5.2rem);
  line-height: 0.98;
  letter-spacing: -0.02em;
  color: #ffffff;
}

.lead {
  margin: 1.3rem 0 0;
  max-width: 62ch;
  color: var(--text-soft);
  font-size: 1.04rem;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.6rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 10rem;
  padding: 0.72rem 1.08rem;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 0.9rem;
  font-weight: 600;
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    background-color 180ms ease,
    color 180ms ease;
}

.btn:hover,
.btn:focus-visible {
  transform: translateY(-2px);
}

.btn-solid {
  background: #ffffff;
  color: #0f0f0f;
}

.btn-ghost {
  border-color: var(--line-soft);
  color: var(--text-strong);
  background: transparent;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  margin-top: clamp(2rem, 6vw, 3.8rem);
}

.metric {
  padding: 1rem;
  border-radius: 14px;
  border: 1px solid var(--line-soft);
  background: var(--bg-soft);
}

.metric p {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.82rem;
}

.metric strong {
  display: block;
  margin-top: 0.45rem;
  color: #ffffff;
  font-size: 1.35rem;
}

.section {
  margin-top: clamp(3rem, 8vw, 5.5rem);
}

.section-head p {
  margin: 0;
  color: var(--text-muted);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 0.74rem;
}

.section-head h2 {
  margin: 0.65rem 0 0;
  max-width: 26ch;
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 3.6vw, 2.8rem);
  line-height: 1.05;
}

.work-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.8rem;
  margin-top: 1.25rem;
}

.work-card {
  display: flex;
  flex-direction: column;
  gap: 0.78rem;
  padding: 1.1rem;
  border-radius: 16px;
  border: 1px solid var(--line-soft);
  background: linear-gradient(170deg, #151515, #121212);
  transition:
    transform 200ms ease,
    border-color 200ms ease;
}

.work-card:hover,
.work-card:focus-within {
  transform: translateY(-4px);
  border-color: #393939;
}

.work-card h3 {
  margin: 0;
  color: #ffffff;
  font-size: 1.1rem;
}

.work-card p {
  margin: 0;
  color: var(--text-soft);
  font-size: 0.93rem;
}

.work-card strong {
  color: #ececec;
  font-size: 0.84rem;
}

.work-card ul {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.work-card li {
  border: 1px solid #2f2f2f;
  border-radius: 999px;
  padding: 0.22rem 0.5rem;
  color: var(--text-muted);
  font-size: 0.72rem;
}

.split {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 0.8rem;
}

.split-main,
.split-side {
  border: 1px solid var(--line-soft);
  border-radius: 16px;
  background: var(--bg-soft);
  padding: 1.15rem;
}

.split-main > p:first-child {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.76rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.split-main h2 {
  margin: 0.6rem 0 0;
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3.1vw, 2.3rem);
}

.split-main > p:last-child {
  margin: 0.9rem 0 0;
  max-width: 58ch;
  color: var(--text-soft);
}

.split-side ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.6rem;
}

.split-side li {
  border-left: 2px solid #2c2c2c;
  padding-left: 0.72rem;
  color: #e8e8e8;
  font-size: 0.95rem;
}

.contact {
  border: 1px solid #303030;
  border-radius: 18px;
  padding: clamp(1.2rem, 3.5vw, 1.8rem);
  background: linear-gradient(145deg, #141414, #101010);
}

.contact p {
  margin: 0;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.74rem;
}

.contact h2 {
  margin: 0.7rem 0 0;
  max-width: 26ch;
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3.1vw, 2.3rem);
  line-height: 1.08;
}

.footer {
  margin-top: 1.2rem;
  text-align: center;
}

.footer p {
  margin: 0;
  color: #828282;
  font-size: 0.82rem;
}

.reveal {
  opacity: 0;
  animation: rise 720ms cubic-bezier(0.19, 0.8, 0.2, 1) forwards;
  animation-delay: var(--delay, 0s);
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    animation: none;
    transform: none;
  }
}

@media (max-width: 980px) {
  .work-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .split {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .topbar {
    grid-template-columns: 1fr auto;
  }

  .menu,
  .mail {
    display: none;
  }

  .metrics,
  .work-grid {
    grid-template-columns: 1fr;
  }

  .btn {
    width: 100%;
  }
}
</style>
