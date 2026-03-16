<script setup lang="ts">
import type { PortfolioCertificatesCopy } from '@/data/portfolio/types'

defineProps<{
  copy: PortfolioCertificatesCopy
  isAppLayout: boolean
}>()
</script>

<template>
  <section id="certificates" :class="isAppLayout ? 'mt-10' : 'mt-12 md:mt-20'">
    <div class="max-w-[56rem]">
      <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">{{ copy.kicker }}</p>
      <h2
        class="mt-3 leading-[1.05] text-zinc-100 [font-family:var(--font-display)]"
        :class="isAppLayout ? 'text-[clamp(1.35rem,5.2vw,1.7rem)]' : 'text-[clamp(1.6rem,3.6vw,2.8rem)]'"
      >
        {{ copy.heading }}
      </h2>
    </div>

    <div
      v-if="copy.certificates.length > 0"
      class="mt-5 grid grid-cols-1 gap-3"
      :class="isAppLayout ? '' : 'md:grid-cols-2 md:justify-items-start xl:grid-cols-3'"
    >
      <article
        v-for="certificate in copy.certificates"
        :key="`${certificate.title}-${certificate.credentialId ?? certificate.issuedAt}`"
        class="overflow-hidden rounded-[1.2rem] border border-[#273346] bg-[linear-gradient(180deg,#111a27_0%,#0d1524_100%)] shadow-[0_14px_30px_rgba(0,0,0,0.2)]"
        :class="isAppLayout ? 'w-full' : 'w-full md:max-w-[20.5rem]'"
      >
        <div class="flex items-start justify-between gap-3 border-b border-[#243247] px-3.5 py-3">
          <div>
            <p class="text-[11px] uppercase tracking-[0.14em] text-[#7f93b2]">
              {{ copy.issuedAtLabel }}
            </p>
            <p class="mt-1 text-[13px] font-medium text-[#dce7ff]">
              {{ certificate.issuedAt }}
            </p>
          </div>
          <span
            v-if="certificate.status"
            class="rounded-full border border-[#465a77] bg-[#132237] px-2 py-0.5 text-[10px] font-medium text-[#b6c6e2]"
          >
            {{ certificate.status }}
          </span>
        </div>

        <div class="border-b border-[#243247] bg-[#0f1726] p-3.5">
          <div
            v-if="certificate.imageSrc"
            class="overflow-hidden rounded-[1rem] border border-[#2b3b52] bg-[#0b1220]"
          >
            <img
              :src="certificate.imageSrc"
              :alt="certificate.imageAlt ?? certificate.title"
              class="aspect-[2/1] w-full object-cover"
              loading="lazy"
            />
          </div>
          <div
            v-else
            class="flex aspect-[2/1] items-center justify-center rounded-[1rem] border border-dashed border-[#385072] bg-[radial-gradient(circle_at_20%_20%,rgba(111,143,206,0.28),transparent_38%),linear-gradient(160deg,#0d1524_0%,#111a27_56%,#15253d_100%)] px-4 text-center"
          >
            <div class="max-w-[11rem]">
              <div
                aria-hidden="true"
                class="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl border border-[#4d6487] bg-[#101827cc] text-[#dce7ff]"
              >
                <svg
                  class="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 6.5C7 5.67157 7.67157 5 8.5 5H15.5C16.3284 5 17 5.67157 17 6.5V11.2C17 12.2609 16.5786 13.2783 15.8284 14.0284L12 17.8569L8.17157 14.0284C7.42143 13.2783 7 12.2609 7 11.2V6.5Z"
                    stroke="currentColor"
                    stroke-width="1.7"
                  />
                  <path
                    d="M10 10.5L11.4 11.9L14.5 8.8"
                    stroke="currentColor"
                    stroke-width="1.7"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M12 18V20"
                    stroke="currentColor"
                    stroke-width="1.7"
                    stroke-linecap="round"
                  />
                </svg>
              </div>
              <p class="mt-2.5 text-sm font-medium text-[#e6efff]">{{ certificate.title }}</p>
            </div>
          </div>
        </div>

        <div class="space-y-3 px-3.5 py-3.5">
          <h3 class="text-base font-semibold leading-6 text-[#e6efff]">
            {{ certificate.title }}
          </h3>

          <dl class="grid gap-2.5 text-sm text-[#b6c6e2]">
            <div class="rounded-xl border border-[#233247] bg-[#101827] px-3 py-2.5">
              <dt class="text-[11px] uppercase tracking-[0.14em] text-[#7f93b2]">
                {{ copy.issuerLabel }}
              </dt>
              <dd class="mt-1 text-[13px] text-[#dce7ff]">{{ certificate.issuer }}</dd>
            </div>
            <div
              v-if="certificate.credentialId"
              class="rounded-xl border border-[#233247] bg-[#101827] px-3 py-2.5"
            >
              <dt class="text-[11px] uppercase tracking-[0.14em] text-[#7f93b2]">
                {{ copy.credentialIdLabel }}
              </dt>
              <dd class="mt-1 text-[13px] text-[#dce7ff]">{{ certificate.credentialId }}</dd>
            </div>
          </dl>

        </div>
      </article>
    </div>

    <article
      v-else
      class="mt-5 rounded-[1.35rem] border border-dashed border-[#31415a] bg-[#101827] px-5 py-6 text-center"
    >
      <h3 class="text-lg font-semibold text-[#e6efff]">{{ copy.emptyTitle }}</h3>
      <p class="mt-2 text-sm leading-6 text-[#97a8c4]">{{ copy.emptyBody }}</p>
    </article>
  </section>
</template>
