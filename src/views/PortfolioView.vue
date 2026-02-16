<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { portfolioCopyByLocale } from '../features/portfolio/copy'
import type { Locale } from '../features/portfolio/types'

const route = useRoute()
const locale = computed<Locale>(() => (route.path.startsWith('/en') ? 'en' : 'ko'))
const copy = computed(() => portfolioCopyByLocale[locale.value])
const currentYear = new Date().getFullYear()
</script>

<template>
  <div class="relative isolate mx-auto w-full max-w-[1220px] px-4 pb-14 pt-5 sm:px-8 lg:px-12">
    <div
      aria-hidden="true"
      class="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_-4%,rgba(255,255,255,0.08),transparent_30%),radial-gradient(circle_at_82%_108%,rgba(255,255,255,0.07),transparent_34%)] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.88),rgba(0,0,0,0.42))]"
    ></div>

    <header
      class="sticky top-4 z-20 mb-10 grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-2xl border border-[#2a2a2a] bg-[#121212d1] px-4 py-3 backdrop-blur md:mb-16"
    >
      <a class="text-xs font-bold tracking-[0.14em] text-zinc-100" href="#">KIMMINJAE</a>

      <nav class="hidden items-center justify-center gap-5 md:flex" aria-label="Primary">
        <a class="text-sm text-zinc-400 transition hover:text-zinc-100" href="#work">
          {{ copy.navWork }}
        </a>
        <a class="text-sm text-zinc-400 transition hover:text-zinc-100" href="#principles">
          {{ copy.navPrinciples }}
        </a>
        <a class="text-sm text-zinc-400 transition hover:text-zinc-100" href="#contact">
          {{ copy.navContact }}
        </a>
      </nav>

      <div class="flex items-center gap-2">
        <a class="hidden text-sm text-zinc-400 transition hover:text-zinc-100 lg:block" href="mailto:hello@kimminje.dev">
          hello@kimminje.dev
        </a>
        <div class="inline-flex rounded-full border border-[#2a2a2a] p-0.5">
          <RouterLink
            class="min-w-9 rounded-full px-2 py-1 text-center text-[11px] tracking-[0.08em] transition"
            :class="locale === 'ko' ? 'bg-white text-zinc-950' : 'text-zinc-400 hover:text-zinc-100'"
            to="/ko"
          >
            KO
          </RouterLink>
          <RouterLink
            class="min-w-9 rounded-full px-2 py-1 text-center text-[11px] tracking-[0.08em] transition"
            :class="locale === 'en' ? 'bg-white text-zinc-950' : 'text-zinc-400 hover:text-zinc-100'"
            to="/en"
          >
            EN
          </RouterLink>
        </div>
      </div>
    </header>

    <main>
      <section class="pt-2">
        <p class="text-xs uppercase tracking-[0.13em] text-zinc-500">{{ copy.eyebrow }}</p>
        <h1
          class="mt-3 max-w-[17ch] text-[clamp(2.3rem,6vw,5.2rem)] leading-[0.97] tracking-[-0.02em] text-white [font-family:var(--font-display)]"
        >
          {{ copy.heroTitle }}
        </h1>
        <p class="mt-5 max-w-[62ch] text-base text-zinc-300">{{ copy.heroLead }}</p>
        <div class="mt-6 flex flex-wrap gap-3">
          <a
            class="inline-flex min-w-40 items-center justify-center rounded-full bg-white px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:-translate-y-0.5"
            href="#work"
          >
            {{ copy.primaryCta }}
          </a>
          <a
            class="inline-flex min-w-40 items-center justify-center rounded-full border border-[#2a2a2a] px-4 py-3 text-sm font-semibold text-zinc-100 transition hover:-translate-y-0.5"
            href="#contact"
          >
            {{ copy.secondaryCta }}
          </a>
        </div>
      </section>

      <section class="mt-8 grid grid-cols-1 gap-3 md:mt-12 md:grid-cols-3">
        <article
          v-for="item in copy.metrics"
          :key="item.label"
          class="rounded-2xl border border-[#2a2a2a] bg-[#141414] p-4"
        >
          <p class="text-sm text-zinc-500">{{ item.label }}</p>
          <strong class="mt-2 block text-2xl text-white">{{ item.value }}</strong>
        </article>
      </section>

      <section id="work" class="mt-12 md:mt-20">
        <div>
          <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">{{ copy.workKicker }}</p>
          <h2
            class="mt-3 max-w-[26ch] text-[clamp(1.6rem,3.6vw,2.8rem)] leading-[1.05] text-zinc-100 [font-family:var(--font-display)]"
          >
            {{ copy.workHeading }}
          </h2>
        </div>
        <div class="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="work in copy.works"
            :key="work.title"
            class="flex flex-col gap-3 rounded-2xl border border-[#2a2a2a] bg-gradient-to-br from-[#151515] to-[#121212] p-4 transition hover:-translate-y-1 hover:border-[#393939]"
          >
            <h3 class="text-lg text-white">{{ work.title }}</h3>
            <p class="text-[15px] text-zinc-300">{{ work.summary }}</p>
            <strong class="text-sm text-zinc-200">{{ work.impact }}</strong>
            <ul class="mt-1 flex flex-wrap gap-2">
              <li
                v-for="item in work.stack"
                :key="`${work.title}-${item}`"
                class="rounded-full border border-[#2f2f2f] px-2 py-1 text-xs text-zinc-500"
              >
                {{ item }}
              </li>
            </ul>
          </article>
        </div>
      </section>

      <section id="principles" class="mt-12 grid grid-cols-1 gap-3 md:mt-20 lg:grid-cols-[1.2fr_0.8fr]">
        <article class="rounded-2xl border border-[#2a2a2a] bg-[#141414] p-4">
          <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">{{ copy.principlesKicker }}</p>
          <h2 class="mt-3 text-[clamp(1.5rem,3.1vw,2.3rem)] text-zinc-100 [font-family:var(--font-display)]">
            {{ copy.principlesHeading }}
          </h2>
          <p class="mt-4 max-w-[58ch] text-zinc-300">{{ copy.principlesBody }}</p>
        </article>
        <article class="rounded-2xl border border-[#2a2a2a] bg-[#141414] p-4">
          <ul class="grid gap-3">
            <li
              v-for="rule in copy.principles"
              :key="rule"
              class="border-l-2 border-[#2c2c2c] pl-3 text-[15px] text-zinc-200"
            >
              {{ rule }}
            </li>
          </ul>
        </article>
      </section>

      <section
        id="contact"
        class="mt-12 rounded-2xl border border-[#303030] bg-gradient-to-br from-[#141414] to-[#101010] p-5 md:mt-20"
      >
        <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">{{ copy.contactKicker }}</p>
        <h2
          class="mt-3 max-w-[26ch] text-[clamp(1.5rem,3.1vw,2.3rem)] leading-[1.08] text-zinc-100 [font-family:var(--font-display)]"
        >
          {{ copy.contactHeading }}
        </h2>
        <div class="mt-6 flex flex-wrap gap-3">
          <a
            class="inline-flex min-w-40 items-center justify-center rounded-full bg-white px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:-translate-y-0.5"
            href="mailto:hello@kimminje.dev"
          >
            {{ copy.emailCta }}
          </a>
          <a
            class="inline-flex min-w-40 items-center justify-center rounded-full border border-[#2a2a2a] px-4 py-3 text-sm font-semibold text-zinc-100 transition hover:-translate-y-0.5"
            href="https://github.com"
            target="_blank"
            rel="noopener"
          >
            {{ copy.githubCta }}
          </a>
        </div>
      </section>
    </main>

    <footer class="mt-5 text-center">
      <p class="text-sm text-zinc-500">© {{ currentYear }} {{ copy.footerName }}</p>
    </footer>
  </div>
</template>
