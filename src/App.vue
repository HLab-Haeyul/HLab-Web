<script setup lang="ts">
const featuredWorks = [
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
]

const principles = [
  'Structure before decoration',
  'Readable first interaction',
  'Predictable component behavior',
  'Measurable performance gains',
]

const currentYear = new Date().getFullYear()
</script>

<template>
  <div class="minimal-page">
    <div class="grid-overlay" aria-hidden="true"></div>

    <header class="topbar reveal" style="--delay: 0.04s">
      <a class="brand" href="#">KIM MINJE</a>
      <nav class="menu" aria-label="Primary">
        <a href="#work">Work</a>
        <a href="#principles">Principles</a>
        <a href="#contact">Contact</a>
      </nav>
      <a class="mail" href="mailto:hello@kimminje.dev">hello@kimminje.dev</a>
    </header>

    <main>
      <section class="hero">
        <p class="eyebrow reveal" style="--delay: 0.08s">Frontend Engineer · Product Experience</p>
        <h1 class="reveal" style="--delay: 0.14s">
          White-forward black minimal, built for clarity and impact.
        </h1>
        <p class="lead reveal" style="--delay: 0.2s">
          I design and build product interfaces on a deep dark base (#0f0f0f~#121212), using
          disciplined whitespace to make every action and decision feel obvious.
        </p>
        <div class="hero-actions reveal" style="--delay: 0.26s">
          <a class="btn btn-solid" href="#work">View Selected Work</a>
          <a class="btn btn-ghost" href="#contact">Start a Project</a>
        </div>
      </section>

      <section class="metrics">
        <article class="metric reveal" style="--delay: 0.14s">
          <p>Products shipped</p>
          <strong>14+</strong>
        </article>
        <article class="metric reveal" style="--delay: 0.2s">
          <p>Average Lighthouse</p>
          <strong>96</strong>
        </article>
        <article class="metric reveal" style="--delay: 0.26s">
          <p>Design + dev span</p>
          <strong>7 years</strong>
        </article>
      </section>

      <section id="work" class="section">
        <div class="section-head reveal" style="--delay: 0.05s">
          <p>Selected Work</p>
          <h2>Recent projects with measurable business outcomes.</h2>
        </div>
        <div class="work-grid">
          <article
            v-for="(work, index) in featuredWorks"
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
          <p>Principles</p>
          <h2>Less noise. More precision.</h2>
          <p>
            My focus is to cut ambiguity from interfaces. Typography, spacing, and interaction all
            align to one goal: helping users decide quickly with confidence.
          </p>
        </article>
        <article class="split-side reveal" style="--delay: 0.18s">
          <ul>
            <li v-for="rule in principles" :key="rule">{{ rule }}</li>
          </ul>
        </article>
      </section>

      <section id="contact" class="contact reveal" style="--delay: 0.22s">
        <p>Open for collaborations</p>
        <h2>Let’s build focused digital products with strong visual discipline.</h2>
        <div class="hero-actions">
          <a class="btn btn-solid" href="mailto:hello@kimminje.dev">Send Email</a>
          <a class="btn btn-ghost" href="https://github.com" target="_blank" rel="noopener"
            >View GitHub</a
          >
        </div>
      </section>
    </main>

    <footer class="footer">
      <p>© {{ currentYear }} Kim Minje</p>
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

  .mail {
    display: none;
  }
}

@media (max-width: 760px) {
  .topbar {
    grid-template-columns: 1fr auto;
  }

  .menu {
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
