<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { stackDetailByLocale } from '../features/portfolio/stackDetail'
import type { Locale } from '../features/portfolio/types'

const route = useRoute()
const locale = computed<Locale>(() => (route.path.startsWith('/en') ? 'en' : 'ko'))
const stackDetail = computed(() => stackDetailByLocale[locale.value])
const homePath = computed(() => (locale.value === 'en' ? '/en' : '/ko'))
const languageSwapPath = computed(() => (locale.value === 'en' ? '/ko/stack' : '/en/stack'))

const usedOnceCount = computed(
  () => stackDetail.value.items.filter((item) => item.capability.usedOnce).length,
)
const projectCount = computed(
  () => stackDetail.value.items.filter((item) => item.capability.projectExperience).length,
)
const readyCount = computed(
  () => stackDetail.value.items.filter((item) => item.capability.productionReady).length,
)

const yesNoClass = (value: boolean) =>
  value
    ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-300'
    : 'border-zinc-700 bg-zinc-900 text-zinc-400'
</script>

<template>
  <div class="relative isolate mx-auto min-h-screen w-full max-w-[1220px] px-4 pb-14 pt-5 sm:px-8 lg:px-12">
    <div
      aria-hidden="true"
      class="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_-4%,rgba(255,255,255,0.08),transparent_30%),radial-gradient(circle_at_82%_108%,rgba(255,255,255,0.07),transparent_34%)] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.88),rgba(0,0,0,0.42))]"
    ></div>

    <header class="sticky top-4 z-20 mb-10 rounded-2xl border border-[#2a2a2a] bg-[#121212d1] px-4 py-3 backdrop-blur">
      <div class="flex items-center justify-between gap-3">
        <RouterLink
          class="inline-flex items-center rounded-full border border-[#2a2a2a] px-3 py-1.5 text-xs tracking-[0.08em] text-zinc-200 transition hover:border-[#3a3a3a] hover:text-white"
          :to="homePath"
        >
          {{ stackDetail.backCta }}
        </RouterLink>

        <p class="text-xs font-bold tracking-[0.14em] text-zinc-100">KIMMINJAE</p>

        <RouterLink
          class="inline-flex min-w-10 items-center justify-center rounded-full border border-[#2a2a2a] px-3 py-1.5 text-xs tracking-[0.08em] text-zinc-300 transition hover:text-white"
          :to="languageSwapPath"
        >
          {{ locale === 'ko' ? 'EN' : 'KO' }}
        </RouterLink>
      </div>
    </header>

    <main>
      <section>
        <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">{{ stackDetail.kicker }}</p>
        <h1 class="mt-3 text-[clamp(1.8rem,5vw,3rem)] leading-[1.03] text-zinc-100 [font-family:var(--font-display)]">
          {{ stackDetail.heading }}
        </h1>
        <p class="mt-4 max-w-[72ch] text-zinc-300">{{ stackDetail.description }}</p>
      </section>

      <section class="mt-8 grid grid-cols-1 gap-3 md:grid-cols-3">
        <article class="rounded-2xl border border-[#2a2a2a] bg-[#141414] p-4">
          <p class="text-sm text-zinc-500">{{ stackDetail.summaryUsedOnce }}</p>
          <p class="mt-2 text-2xl text-white">{{ usedOnceCount }} / {{ stackDetail.items.length }}</p>
        </article>
        <article class="rounded-2xl border border-[#2a2a2a] bg-[#141414] p-4">
          <p class="text-sm text-zinc-500">{{ stackDetail.summaryProject }}</p>
          <p class="mt-2 text-2xl text-white">{{ projectCount }} / {{ stackDetail.items.length }}</p>
        </article>
        <article class="rounded-2xl border border-[#2a2a2a] bg-[#141414] p-4">
          <p class="text-sm text-zinc-500">{{ stackDetail.summaryReady }}</p>
          <p class="mt-2 text-2xl text-white">{{ readyCount }} / {{ stackDetail.items.length }}</p>
        </article>
      </section>

      <section class="mt-8 overflow-x-auto rounded-2xl border border-[#2a2a2a] bg-[#131313]">
        <table class="min-w-[980px] w-full border-collapse">
          <thead class="bg-[#151515]">
            <tr class="text-left text-xs uppercase tracking-[0.09em] text-zinc-500">
              <th class="px-4 py-3">{{ stackDetail.columnSkill }}</th>
              <th class="px-4 py-3">{{ stackDetail.columnCategory }}</th>
              <th class="px-4 py-3">{{ stackDetail.columnProficiency }}</th>
              <th class="px-4 py-3">{{ stackDetail.columnUsedOnce }}</th>
              <th class="px-4 py-3">{{ stackDetail.columnProject }}</th>
              <th class="px-4 py-3">{{ stackDetail.columnReady }}</th>
              <th class="px-4 py-3">{{ stackDetail.columnNote }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in stackDetail.items"
              :key="item.label"
              class="border-t border-[#232323] align-top text-sm text-zinc-200"
            >
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <img
                    v-if="item.imageSrc"
                    :src="item.imageSrc"
                    :alt="item.imageAlt ?? item.label"
                    class="h-5 w-5 object-contain"
                    loading="lazy"
                  />
                  <span v-else class="text-base leading-none">{{ item.icon ?? '•' }}</span>
                  <span>{{ item.label }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-zinc-300">{{ item.category }}</td>
              <td class="px-4 py-3 text-zinc-100">{{ item.proficiency }}</td>
              <td class="px-4 py-3">
                <span class="inline-flex rounded-full border px-2.5 py-1 text-xs" :class="yesNoClass(item.capability.usedOnce)">
                  {{ item.capability.usedOnce ? stackDetail.yesLabel : stackDetail.noLabel }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span class="inline-flex rounded-full border px-2.5 py-1 text-xs" :class="yesNoClass(item.capability.projectExperience)">
                  {{ item.capability.projectExperience ? stackDetail.yesLabel : stackDetail.noLabel }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span class="inline-flex rounded-full border px-2.5 py-1 text-xs" :class="yesNoClass(item.capability.productionReady)">
                  {{ item.capability.productionReady ? stackDetail.yesLabel : stackDetail.noLabel }}
                </span>
              </td>
              <td class="px-4 py-3 text-zinc-400">{{ item.note }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>
