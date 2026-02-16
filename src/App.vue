<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const calligraphyChars = ['一', '以', '貫', '之']
const showIntro = ref(true)
const mainVisible = ref(false)

let introTimer: ReturnType<typeof setTimeout> | undefined

const openMainScene = () => {
  mainVisible.value = true
  showIntro.value = false
}

onMounted(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reducedMotion) {
    openMainScene()
    return
  }

  introTimer = setTimeout(() => {
    openMainScene()
  }, 3600)
})

onBeforeUnmount(() => {
  if (introTimer) {
    clearTimeout(introTimer)
  }
})

const curriculum = [
  {
    title: '한지 인터페이스 공방',
    summary:
      '여백과 밀도를 조율해 읽기 쉬운 화면 구조를 만듭니다. 카드, 목록, 폼 같은 실전 UI를 한글 맥락에 맞춰 설계합니다.',
    meta: '반응형 · 접근성',
  },
  {
    title: '필묵 모션 수업',
    summary:
      '종이 위 번짐처럼 자연스러운 전환을 연구합니다. 과하지 않은 인터랙션으로 흐름을 살리고 집중도를 높입니다.',
    meta: '마이크로 인터랙션 · UX 흐름',
  },
  {
    title: '신식 성능 실학',
    summary:
      '번들 최적화와 렌더링 성능을 함께 다룹니다. 빠른 첫 화면과 안정적인 상태 관리를 제품 단위로 적용합니다.',
    meta: 'Web Vitals · 배포 품질',
  },
]

const exhibits = [
  {
    title: '학당 출결 관제판',
    detail:
      '선생과 학생이 동시에 쓰는 출결 대시보드를 설계/개발했습니다. 핵심 지표를 첫 화면에 정리해 일일 운영 시간을 단축했습니다.',
    result: '주간 활성 사용자 +34%',
    stack: ['Vue 3', 'TypeScript', 'ECharts'],
  },
  {
    title: '신입생 모집 랜딩',
    detail:
      '옛 포스터의 문장 톤을 현대 웹으로 옮긴 캠페인 페이지입니다. 콘텐츠 계층을 재설계해 이탈 구간을 줄였습니다.',
    result: '문의 전환율 +22%',
    stack: ['Vite', 'A/B Test', 'SEO'],
  },
  {
    title: '학사 행정 디자인 시스템',
    detail:
      '행정 화면 전반을 컴포넌트화해 제작 시간을 줄였습니다. 토큰 기반으로 색/간격 규칙을 고정해 유지보수 비용을 낮췄습니다.',
    result: '기능 화면 제작 속도 1.8배',
    stack: ['Design Tokens', 'Storybook', 'CI'],
  },
]

const annals = [
  {
    period: '2025 - 현재',
    role: 'Frontend Engineer · HLab',
    note: '서비스 운영 화면과 브랜드 페이지를 함께 맡아 제품 경험의 일관성을 설계하고 있습니다.',
  },
  {
    period: '2022 - 2025',
    role: 'Product Designer to Developer',
    note: '기획/디자인/개발을 한 사이클로 수행하며 초기 제품의 의사결정과 구현 속도를 끌어올렸습니다.',
  },
  {
    period: '2019 - 2022',
    role: 'Interaction Designer',
    note: '복잡한 업무 흐름을 화면 언어로 번역해 팀이 바로 개발 가능한 문서와 시안을 만들었습니다.',
  },
]

const strengths = [
  '한글 타이포',
  '컴포넌트 설계',
  '디자인 시스템',
  '접근성',
  '성능 최적화',
  '제품 전략',
  '협업 문서화',
  '실험 기반 개선',
]

const currentYear = new Date().getFullYear()
</script>

<template>
  <Transition name="intro-fade">
    <section v-if="showIntro" class="intro-screen" aria-label="인트로 애니메이션">
      <div class="intro-frame">
        <p class="intro-reading">일이관지</p>
        <div class="calligraphy-line" role="img" aria-label="한자 일이관지">
          <span
            v-for="(char, index) in calligraphyChars"
            :key="`${char}-${index}`"
            class="calligraphy-char"
            :style="{ '--char-delay': `${index * 0.58}s` }"
          >
            {{ char }}
          </span>
        </div>
        <p class="intro-caption">한눈에 질서를 세우는 화면 설계</p>
      </div>
    </section>
  </Transition>

  <div class="academy-page" :class="{ 'academy-page--ready': mainVisible }">
    <div class="paper-noise" aria-hidden="true"></div>
    <div class="light light-left" aria-hidden="true"></div>
    <div class="light light-right" aria-hidden="true"></div>

    <header class="top-ribbon reveal" style="--delay: 0.02s">
      <a class="logo" href="#">
        <span class="seal">學堂</span>
        <span class="logo-text">
          <strong>김민제 신식학당</strong>
          <small>Modern Portfolio Atelier</small>
        </span>
      </a>
      <nav class="menu" aria-label="Primary">
        <a href="#curriculum">교과</a>
        <a href="#exhibit">전시</a>
        <a href="#annals">약력</a>
        <a href="#admission">입학문의</a>
      </nav>
      <a class="mail-link" href="mailto:hello@kimminje.dev">hello@kimminje.dev</a>
    </header>

    <main>
      <section class="hero">
        <div class="hero-copy">
          <p class="hero-label reveal" style="--delay: 0.08s">2026 학당 편람 · Frontend Portfolio</p>
          <h1 class="reveal" style="--delay: 0.14s">옛 학당의 결을 담아, 오늘의 웹을 짓습니다.</h1>
          <p class="hero-desc reveal" style="--delay: 0.2s">
            고전적인 서체 감성과 현대적인 제품 구현 방식을 결합해, 읽기 쉽고 오래 가는 인터페이스를
            만듭니다. 화면은 단정하게, 경험은 선명하게 설계합니다.
          </p>
          <div class="hero-actions reveal" style="--delay: 0.26s">
            <a class="btn btn-ink" href="#exhibit">작품 전시 보기</a>
            <a class="btn btn-outline" href="#admission">상담 신청</a>
          </div>
          <ul class="hero-metrics reveal" style="--delay: 0.32s">
            <li>
              <strong>14+</strong>
              <span>출시 프로젝트</span>
            </li>
            <li>
              <strong>96</strong>
              <span>평균 Lighthouse</span>
            </li>
            <li>
              <strong>7년</strong>
              <span>디자인 + 개발 경력</span>
            </li>
          </ul>
        </div>

        <aside class="hero-panel reveal" style="--delay: 0.36s">
          <p class="panel-kicker">훈장 소개</p>
          <h2>제품의 문장력과 구현력을 함께 다룹니다.</h2>
          <p>
            서비스 구조를 읽고 핵심 행동을 빠르게 이끌어내는 화면을 설계합니다. 팀이 유지보수하기 쉬운
            코드와 디자인 규칙을 남기는 것을 기준으로 작업합니다.
          </p>
          <div class="panel-subjects">
            <span>한글 UX</span>
            <span>디자인 토큰</span>
            <span>배포 자동화</span>
          </div>
        </aside>
      </section>

      <section id="curriculum" class="section">
        <div class="section-head reveal" style="--delay: 0.06s">
          <p>교과 편성</p>
          <h2>학당식 감성과 제품 실무를 잇는 수업</h2>
        </div>
        <div class="curriculum-grid">
          <article
            v-for="(subject, index) in curriculum"
            :key="subject.title"
            class="subject-card reveal"
            :style="{ '--delay': `${0.1 + index * 0.08}s` }"
          >
            <p class="subject-meta">{{ subject.meta }}</p>
            <h3>{{ subject.title }}</h3>
            <p>{{ subject.summary }}</p>
          </article>
        </div>
      </section>

      <section id="exhibit" class="section">
        <div class="section-head reveal" style="--delay: 0.07s">
          <p>작품 전시</p>
          <h2>성과로 검증된 최근 작업</h2>
        </div>
        <div class="exhibit-list">
          <article
            v-for="(work, index) in exhibits"
            :key="work.title"
            class="work-card reveal"
            :style="{ '--delay': `${0.1 + index * 0.08}s` }"
          >
            <div class="work-top">
              <h3>{{ work.title }}</h3>
              <span>{{ work.result }}</span>
            </div>
            <p>{{ work.detail }}</p>
            <ul>
              <li v-for="tool in work.stack" :key="`${work.title}-${tool}`">{{ tool }}</li>
            </ul>
          </article>
        </div>
      </section>

      <section id="annals" class="section annals-layout">
        <article class="annals-panel reveal" style="--delay: 0.1s">
          <div class="section-head small">
            <p>약력</p>
            <h2>화면 언어를 다듬어 온 시간</h2>
          </div>
          <ol>
            <li v-for="item in annals" :key="`${item.period}-${item.role}`">
              <p>{{ item.period }}</p>
              <h3>{{ item.role }}</h3>
              <span>{{ item.note }}</span>
            </li>
          </ol>
        </article>
        <article class="strength-panel reveal" style="--delay: 0.16s">
          <div class="section-head small">
            <p>강의 분야</p>
            <h2>현재 가장 잘하는 것</h2>
          </div>
          <ul>
            <li v-for="item in strengths" :key="item">{{ item }}</li>
          </ul>
        </article>
      </section>

      <section id="admission" class="admission reveal" style="--delay: 0.2s">
        <p>입학 문의</p>
        <h2>브랜드 감성과 제품 성과를 함께 만드는 작업을 찾고 있습니다.</h2>
        <div class="admission-actions">
          <a class="btn btn-ink" href="mailto:hello@kimminje.dev">이메일 보내기</a>
          <a class="btn btn-outline" href="https://github.com" target="_blank" rel="noopener"
            >GitHub 보기</a
          >
        </div>
      </section>
    </main>

    <footer class="footer">
      <p>© {{ currentYear }} 김민제 신식학당. Built in Vue.</p>
    </footer>
  </div>
</template>

<style scoped>
.intro-screen {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  place-items: center;
  padding: 1rem;
  background:
    radial-gradient(circle at 14% 16%, rgba(165, 72, 46, 0.16), transparent 38%),
    radial-gradient(circle at 88% 4%, rgba(47, 111, 99, 0.14), transparent 32%),
    linear-gradient(140deg, #fcf7ec 0%, #f5ebd8 52%, #efe2cb 100%);
}

.intro-screen::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    repeating-linear-gradient(
      0deg,
      rgba(108, 88, 71, 0.06) 0px,
      rgba(108, 88, 71, 0.06) 1px,
      transparent 1px,
      transparent 32px
    ),
    repeating-linear-gradient(
      90deg,
      rgba(108, 88, 71, 0.04) 0px,
      rgba(108, 88, 71, 0.04) 1px,
      transparent 1px,
      transparent 32px
    );
}

.intro-frame {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 0.9rem;
  width: min(680px, 100%);
  padding: clamp(1.6rem, 5vw, 2.6rem) 1rem;
  border: 1px solid rgba(76, 61, 47, 0.26);
  border-radius: 18px;
  background: rgba(255, 251, 245, 0.75);
  box-shadow: 0 18px 42px rgba(35, 29, 22, 0.12);
}

.intro-reading {
  margin: 0;
  color: #706354;
  font-size: 0.82rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.calligraphy-line {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(0.4rem, 1.4vw, 1.1rem);
  line-height: 1;
}

.calligraphy-char {
  position: relative;
  display: inline-block;
  min-width: 1em;
  color: #201913;
  font-family: var(--font-display);
  font-size: clamp(2.8rem, 9vw, 6.8rem);
  letter-spacing: 0.02em;
  text-shadow: 0 2px 3px rgba(31, 25, 19, 0.18);
  opacity: 0;
  filter: blur(4px);
  clip-path: inset(0 100% 0 0);
  animation: brush-write 760ms cubic-bezier(0.16, 0.82, 0.19, 1) forwards;
  animation-delay: var(--char-delay);
}

.calligraphy-char::after {
  content: '';
  position: absolute;
  top: 4%;
  bottom: 7%;
  left: -0.1em;
  width: 0.42em;
  background: linear-gradient(180deg, rgba(32, 25, 19, 0.05), rgba(32, 25, 19, 0.38));
  border-radius: 999px;
  filter: blur(3px);
  opacity: 0;
  animation: brush-tip 760ms cubic-bezier(0.16, 0.82, 0.19, 1) forwards;
  animation-delay: var(--char-delay);
}

.intro-caption {
  margin: 0.2rem 0 0;
  color: #716252;
  font-size: 0.84rem;
  letter-spacing: 0.08em;
}

.intro-fade-leave-active {
  transition:
    opacity 620ms cubic-bezier(0.2, 0.7, 0.2, 1),
    transform 620ms cubic-bezier(0.2, 0.7, 0.2, 1);
}

.intro-fade-leave-from {
  opacity: 1;
  transform: scale(1);
}

.intro-fade-leave-to {
  opacity: 0;
  transform: scale(1.015);
}

.academy-page {
  position: relative;
  isolation: isolate;
  width: min(1140px, 100%);
  margin: 0 auto;
  padding: 1.2rem clamp(1rem, 3.2vw, 2.7rem) 3rem;
  color: var(--ink);
  opacity: 0;
  transform: translateY(20px);
  filter: blur(1px);
  transition:
    opacity 740ms cubic-bezier(0.2, 0.7, 0.2, 1),
    transform 740ms cubic-bezier(0.2, 0.7, 0.2, 1),
    filter 740ms cubic-bezier(0.2, 0.7, 0.2, 1);
  --paper: #f6efdf;
  --paper-soft: #f9f3e7;
  --paper-deep: #efe3ce;
  --ink: #1f1915;
  --ink-soft: #5d5245;
  --ink-muted: #817363;
  --line: #c9bba5;
  --stamp: #a5482e;
  --jade: #2f6f63;
  --gold: #b68a4b;
}

.academy-page--ready {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}

.paper-noise {
  position: fixed;
  inset: 0;
  z-index: -3;
  pointer-events: none;
  background:
    linear-gradient(140deg, rgba(255, 251, 244, 0.88), rgba(247, 238, 222, 0.88)),
    repeating-linear-gradient(
      0deg,
      rgba(114, 94, 76, 0.06) 0px,
      rgba(114, 94, 76, 0.06) 1px,
      transparent 1px,
      transparent 34px
    ),
    repeating-linear-gradient(
      90deg,
      rgba(114, 94, 76, 0.04) 0px,
      rgba(114, 94, 76, 0.04) 1px,
      transparent 1px,
      transparent 34px
    );
}

.light {
  position: fixed;
  z-index: -2;
  width: clamp(14rem, 30vw, 24rem);
  aspect-ratio: 1;
  border-radius: 999px;
  opacity: 0.35;
  filter: blur(84px);
  pointer-events: none;
}

.light-left {
  top: -7rem;
  left: -8rem;
  background: color-mix(in oklab, var(--stamp), white 44%);
}

.light-right {
  top: 34%;
  right: -9rem;
  background: color-mix(in oklab, var(--jade), white 58%);
}

.top-ribbon {
  position: sticky;
  top: 1rem;
  z-index: 5;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 0.78rem 1rem;
  margin-bottom: clamp(2.1rem, 6vw, 4rem);
  border: 1px solid var(--line);
  border-radius: 16px;
  background: color-mix(in oklab, var(--paper-soft), white 18%);
  box-shadow: 0 14px 36px rgba(34, 28, 21, 0.08);
  backdrop-filter: blur(8px);
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
}

.seal {
  display: inline-grid;
  place-items: center;
  width: 2.5rem;
  aspect-ratio: 1;
  border-radius: 9px;
  background: linear-gradient(135deg, #bf5c3a, #8e3222);
  color: #fff5eb;
  font-family: var(--font-display);
  font-size: 0.87rem;
  letter-spacing: 0.07em;
}

.logo-text {
  display: grid;
  line-height: 1.15;
}

.logo-text strong {
  font-size: 0.97rem;
  letter-spacing: 0.04em;
}

.logo-text small {
  color: var(--ink-muted);
  font-size: 0.72rem;
}

.menu {
  display: flex;
  justify-content: center;
  gap: 1.1rem;
}

.menu a {
  color: var(--ink-soft);
  font-size: 0.92rem;
  transition: color 180ms ease;
}

.menu a:hover,
.menu a:focus-visible,
.mail-link:hover,
.mail-link:focus-visible {
  color: var(--ink);
}

.mail-link {
  color: var(--ink-muted);
  font-size: 0.9rem;
}

.hero {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: clamp(1rem, 2.8vw, 2.1rem);
  align-items: start;
}

.hero-label {
  margin: 0 0 0.8rem;
  color: var(--ink-muted);
  font-size: 0.78rem;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}

.hero-copy h1 {
  margin: 0;
  max-width: 15ch;
  font-family: var(--font-display);
  font-size: clamp(2rem, 4.8vw, 4rem);
  letter-spacing: -0.015em;
  line-height: 1.05;
}

.hero-desc {
  margin: 1.2rem 0 0;
  max-width: 58ch;
  color: var(--ink-soft);
  font-size: 1.04rem;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.72rem;
  margin-top: 1.6rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0.7rem 1.15rem;
  border: 1px solid transparent;
  font-size: 0.91rem;
  font-weight: 600;
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    border-color 180ms ease,
    background-color 180ms ease;
}

.btn:hover,
.btn:focus-visible {
  transform: translateY(-2px);
}

.btn-ink {
  background: var(--ink);
  color: #fff7ea;
  box-shadow: 0 10px 24px rgba(31, 25, 21, 0.22);
}

.btn-outline {
  border-color: var(--line);
  background: color-mix(in oklab, var(--paper-soft), white 22%);
}

.hero-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.68rem;
  margin: 1.35rem 0 0;
  padding: 0;
  list-style: none;
}

.hero-metrics li {
  padding: 0.78rem 0.84rem;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: color-mix(in oklab, var(--paper-soft), white 18%);
}

.hero-metrics strong {
  display: block;
  font-size: 1.2rem;
  letter-spacing: -0.02em;
}

.hero-metrics span {
  color: var(--ink-muted);
  font-size: 0.79rem;
}

.hero-panel {
  padding: 1.3rem;
  border: 1px solid var(--line);
  border-radius: 20px;
  background:
    radial-gradient(
      circle at 110% 0%,
      color-mix(in oklab, var(--gold), white 45%),
      transparent 48%
    ),
    linear-gradient(150deg, color-mix(in oklab, var(--paper-soft), white 24%), var(--paper));
  box-shadow: 0 18px 36px rgba(37, 30, 22, 0.1);
}

.panel-kicker {
  margin: 0;
  font-size: 0.78rem;
  color: var(--ink-muted);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.hero-panel h2 {
  margin: 0.5rem 0 0;
  font-size: 1.4rem;
  line-height: 1.2;
}

.hero-panel p {
  margin: 0.8rem 0 0;
  color: var(--ink-soft);
}

.panel-subjects {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.panel-subjects span {
  padding: 0.28rem 0.62rem;
  border-radius: 999px;
  font-size: 0.76rem;
  color: var(--ink-soft);
  border: 1px solid var(--line);
  background: color-mix(in oklab, var(--paper-soft), white 14%);
}

.section {
  margin-top: clamp(2.8rem, 8vw, 5rem);
}

.section-head p {
  margin: 0;
  color: var(--ink-muted);
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.section-head h2 {
  margin: 0.58rem 0 0;
  font-family: var(--font-display);
  font-size: clamp(1.48rem, 3.1vw, 2.35rem);
  line-height: 1.1;
}

.curriculum-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.9rem;
  margin-top: 1.2rem;
}

.subject-card {
  padding: 1rem;
  border-radius: 18px;
  border: 1px solid var(--line);
  background: color-mix(in oklab, var(--paper-soft), white 22%);
  box-shadow: 0 12px 30px rgba(36, 30, 23, 0.08);
}

.subject-meta {
  margin: 0;
  color: color-mix(in oklab, var(--jade), black 20%);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
}

.subject-card h3 {
  margin: 0.55rem 0 0;
  font-size: 1.14rem;
}

.subject-card p:last-child {
  margin: 0.68rem 0 0;
  color: var(--ink-soft);
}

.exhibit-list {
  display: grid;
  gap: 0.82rem;
  margin-top: 1.15rem;
}

.work-card {
  padding: 1rem;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: linear-gradient(
    160deg,
    color-mix(in oklab, var(--paper-soft), white 22%),
    color-mix(in oklab, var(--paper), white 8%)
  );
  transition:
    transform 220ms ease,
    box-shadow 220ms ease;
}

.work-card:hover,
.work-card:focus-within {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px rgba(36, 29, 22, 0.1);
}

.work-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
}

.work-top h3 {
  margin: 0;
  font-size: 1.17rem;
}

.work-top span {
  color: var(--stamp);
  font-size: 0.82rem;
  font-weight: 700;
  white-space: nowrap;
}

.work-card p {
  margin: 0.6rem 0 0;
  color: var(--ink-soft);
}

.work-card ul {
  display: flex;
  flex-wrap: wrap;
  gap: 0.48rem;
  margin: 0.85rem 0 0;
  padding: 0;
  list-style: none;
}

.work-card li {
  padding: 0.24rem 0.55rem;
  border-radius: 999px;
  border: 1px solid var(--line);
  font-size: 0.75rem;
  color: var(--ink-muted);
}

.annals-layout {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 0.9rem;
}

.annals-panel,
.strength-panel {
  padding: 1rem;
  border-radius: 18px;
  border: 1px solid var(--line);
  background: color-mix(in oklab, var(--paper-soft), white 24%);
}

.section-head.small h2 {
  font-size: 1.35rem;
}

.annals-panel ol {
  display: grid;
  gap: 0.9rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.annals-panel li {
  border-left: 2px solid color-mix(in oklab, var(--line), black 8%);
  padding-left: 0.84rem;
}

.annals-panel li p {
  margin: 0;
  font-size: 0.8rem;
  color: var(--ink-muted);
}

.annals-panel li h3 {
  margin: 0.34rem 0 0;
  font-size: 1rem;
}

.annals-panel li span {
  display: block;
  margin-top: 0.42rem;
  color: var(--ink-soft);
}

.strength-panel ul {
  display: flex;
  flex-wrap: wrap;
  gap: 0.48rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.strength-panel li {
  padding: 0.32rem 0.6rem;
  border-radius: 999px;
  border: 1px solid color-mix(in oklab, var(--jade), black 76%);
  background: color-mix(in oklab, var(--jade), white 78%);
  color: color-mix(in oklab, var(--jade), black 32%);
  font-size: 0.79rem;
}

.admission {
  margin-top: clamp(2.7rem, 7vw, 4.4rem);
  padding: clamp(1.1rem, 3.2vw, 1.8rem);
  border: 1px solid color-mix(in oklab, var(--stamp), white 42%);
  border-radius: 20px;
  background:
    radial-gradient(circle at 100% 0%, rgba(182, 138, 75, 0.22), transparent 52%),
    linear-gradient(
      130deg,
      color-mix(in oklab, var(--stamp), white 84%),
      color-mix(in oklab, var(--gold), white 86%)
    );
}

.admission > p {
  margin: 0;
  font-size: 0.78rem;
  letter-spacing: 0.1em;
  color: color-mix(in oklab, var(--stamp), black 4%);
  text-transform: uppercase;
}

.admission h2 {
  margin: 0.7rem 0 0;
  max-width: 24ch;
  font-family: var(--font-display);
  font-size: clamp(1.45rem, 3vw, 2.1rem);
  line-height: 1.15;
}

.admission-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin-top: 1.1rem;
}

.footer {
  margin-top: 1.3rem;
  text-align: center;
}

.footer p {
  margin: 0;
  color: var(--ink-muted);
  font-size: 0.83rem;
}

.reveal {
  opacity: 0;
  transform: translateY(14px);
}

.academy-page--ready .reveal {
  animation: rise 760ms cubic-bezier(0.2, 0.78, 0.2, 1) forwards;
  animation-delay: var(--delay, 0s);
}

@keyframes brush-write {
  0% {
    opacity: 0;
    filter: blur(5px);
    clip-path: inset(0 100% 0 0);
  }
  18% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    filter: blur(0);
    clip-path: inset(0 0 0 0);
  }
}

@keyframes brush-tip {
  0% {
    opacity: 0.78;
    transform: translateX(0);
  }
  82% {
    opacity: 0.4;
    transform: translateX(1em);
  }
  100% {
    opacity: 0;
    transform: translateX(1.12em);
  }
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .intro-screen {
    display: none;
  }

  .academy-page {
    opacity: 1;
    transform: none;
    filter: none;
    transition: none;
  }

  .reveal,
  .academy-page--ready .reveal {
    opacity: 1;
    transform: none;
    animation: none;
  }

  .work-card,
  .btn {
    transition: none;
  }
}

@media (max-width: 1040px) {
  .hero,
  .annals-layout {
    grid-template-columns: 1fr;
  }

  .curriculum-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .top-ribbon {
    grid-template-columns: 1fr auto;
  }

  .menu,
  .mail-link {
    display: none;
  }

  .hero-copy h1 {
    font-size: clamp(1.85rem, 9vw, 2.7rem);
  }

  .hero-metrics,
  .curriculum-grid {
    grid-template-columns: 1fr;
  }

  .work-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.35rem;
  }

  .btn {
    width: 100%;
  }
}
</style>
