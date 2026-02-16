<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { stackDetailByLocale } from '../features/portfolio/stackDetail'
import type { Locale } from '../features/portfolio/types'

const route = useRoute()
const locale = computed<Locale>(() => (route.path.startsWith('/en') ? 'en' : 'ko'))
const stackDetail = computed(() => stackDetailByLocale[locale.value])

const projectUsedCount = computed(
  () => stackDetail.value.items.filter((item) => item.capability.projectUsed).length,
)
const practicalUsedCount = computed(
  () => stackDetail.value.items.filter((item) => item.capability.practicalUsed).length,
)
const internalsExploredCount = computed(
  () => stackDetail.value.items.filter((item) => item.capability.internalsExplored).length,
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

    <main>
      <section id="stack-overview">
        <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">{{ stackDetail.kicker }}</p>
        <h1 class="mt-3 text-[clamp(1.8rem,5vw,3rem)] leading-[1.03] text-zinc-100 [font-family:var(--font-display)]">
          {{ stackDetail.heading }}
        </h1>
        <p class="mt-4 max-w-[72ch] text-zinc-300">{{ stackDetail.description }}</p>
      </section>

      <section id="stack-summary" class="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
        <article class="rounded-2xl border border-[#2a2a2a] bg-[#141414] p-4">
          <p class="text-sm text-zinc-500">{{ stackDetail.summaryProjectUsed }}</p>
          <p class="mt-2 text-2xl text-white">{{ projectUsedCount }} / {{ stackDetail.items.length }}</p>
        </article>
        <article class="rounded-2xl border border-[#2a2a2a] bg-[#141414] p-4">
          <p class="text-sm text-zinc-500">{{ stackDetail.summaryPracticalUsed }}</p>
          <p class="mt-2 text-2xl text-white">{{ practicalUsedCount }} / {{ stackDetail.items.length }}</p>
        </article>
        <article class="col-span-2 rounded-2xl border border-[#2a2a2a] bg-[#141414] p-4 md:col-span-1">
          <p class="text-sm text-zinc-500">{{ stackDetail.summaryInternals }}</p>
          <p class="mt-2 text-2xl text-white">{{ internalsExploredCount }} / {{ stackDetail.items.length }}</p>
        </article>
      </section>

      <section id="stack-matrix" class="mt-8">
        <div class="space-y-3 md:hidden">
          <article
            v-for="item in stackDetail.items"
            :key="`mobile-${item.label}`"
            class="rounded-2xl border border-[#2a2a2a] bg-[#131313] p-4"
          >
            <div class="flex items-center justify-between gap-3">
              <div class="flex min-w-0 items-center gap-2">
                <img
                  v-if="item.imageSrc"
                  :src="item.imageSrc"
                  :alt="item.imageAlt ?? item.label"
                  class="h-5 w-5 object-contain"
                  loading="lazy"
                />
                <span v-else class="text-base leading-none">{{ item.icon ?? '•' }}</span>
                <strong class="truncate text-zinc-100">{{ item.label }}</strong>
              </div>
              <span class="shrink-0 rounded-full border border-[#323232] px-2.5 py-1 text-xs text-zinc-300">
                {{ item.proficiency }}
              </span>
            </div>

            <p class="mt-2 text-xs text-zinc-500">{{ item.category }}</p>
            <p class="mt-3 text-sm text-zinc-300">{{ item.note }}</p>

            <dl class="mt-4 grid grid-cols-1 gap-2">
              <div class="rounded-xl border border-[#242424] bg-[#111111] p-2.5">
                <dt class="text-[11px] text-zinc-500">{{ stackDetail.columnProjectUsed }}</dt>
                <dd class="mt-1">
                  <span class="inline-flex rounded-full border px-2.5 py-1 text-xs" :class="yesNoClass(item.capability.projectUsed)">
                    {{ item.capability.projectUsed ? stackDetail.yesLabel : stackDetail.noLabel }}
                  </span>
                </dd>
              </div>
              <div class="rounded-xl border border-[#242424] bg-[#111111] p-2.5">
                <dt class="text-[11px] text-zinc-500">{{ stackDetail.columnPracticalUsed }}</dt>
                <dd class="mt-1">
                  <span class="inline-flex rounded-full border px-2.5 py-1 text-xs" :class="yesNoClass(item.capability.practicalUsed)">
                    {{ item.capability.practicalUsed ? stackDetail.yesLabel : stackDetail.noLabel }}
                  </span>
                </dd>
              </div>
              <div class="rounded-xl border border-[#242424] bg-[#111111] p-2.5">
                <dt class="text-[11px] text-zinc-500">{{ stackDetail.columnInternals }}</dt>
                <dd class="mt-1">
                  <span class="inline-flex rounded-full border px-2.5 py-1 text-xs" :class="yesNoClass(item.capability.internalsExplored)">
                    {{ item.capability.internalsExplored ? stackDetail.yesLabel : stackDetail.noLabel }}
                  </span>
                </dd>
              </div>
            </dl>
          </article>
        </div>

        <div class="hidden overflow-x-auto rounded-2xl border border-[#2a2a2a] bg-[#131313] md:block">
          <table class="min-w-[980px] w-full border-collapse">
            <thead class="bg-[#151515]">
              <tr class="text-left text-xs uppercase tracking-[0.09em] text-zinc-500">
                <th class="px-4 py-3">{{ stackDetail.columnSkill }}</th>
                <th class="px-4 py-3">{{ stackDetail.columnCategory }}</th>
                <th class="px-4 py-3">{{ stackDetail.columnProficiency }}</th>
                <th class="px-4 py-3">{{ stackDetail.columnProjectUsed }}</th>
                <th class="px-4 py-3">{{ stackDetail.columnPracticalUsed }}</th>
                <th class="px-4 py-3">{{ stackDetail.columnInternals }}</th>
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
                  <span class="inline-flex rounded-full border px-2.5 py-1 text-xs" :class="yesNoClass(item.capability.projectUsed)">
                    {{ item.capability.projectUsed ? stackDetail.yesLabel : stackDetail.noLabel }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span class="inline-flex rounded-full border px-2.5 py-1 text-xs" :class="yesNoClass(item.capability.practicalUsed)">
                    {{ item.capability.practicalUsed ? stackDetail.yesLabel : stackDetail.noLabel }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span class="inline-flex rounded-full border px-2.5 py-1 text-xs" :class="yesNoClass(item.capability.internalsExplored)">
                    {{ item.capability.internalsExplored ? stackDetail.yesLabel : stackDetail.noLabel }}
                  </span>
                </td>
                <td class="px-4 py-3 text-zinc-400">{{ item.note }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>
