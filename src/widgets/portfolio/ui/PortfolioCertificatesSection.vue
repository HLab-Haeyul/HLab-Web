<script setup lang="ts">
import { computed } from 'vue'
import type { CertificateItem, PortfolioCertificatesCopy } from '@/entities/portfolio'

const props = defineProps<{
  copy: PortfolioCertificatesCopy
  isAppLayout: boolean
}>()

const visibleCertificates = computed(() =>
  props.copy.certificates.filter((certificate) => Boolean(certificate.title.trim())),
)

const getCertificateMeta = (certificate: CertificateItem) =>
  [
    { label: props.copy.issuerLabel, value: certificate.issuer.trim() },
    { label: props.copy.issuedAtLabel, value: certificate.issuedAt.trim() },
    { label: props.copy.credentialIdLabel, value: certificate.credentialId?.trim() ?? '' },
  ].filter((entry) => Boolean(entry.value))
</script>

<template>
  <section id="certificates" :class="props.isAppLayout ? 'mt-10' : 'mt-12 md:mt-20'">
    <div class="max-w-[56rem]">
      <p class="ui-type-kicker text-zinc-500">{{ props.copy.kicker }}</p>
      <h2
        class="mt-3 text-zinc-100"
        :class="props.isAppLayout ? 'ui-type-title-sm-compact' : 'ui-type-title-md'"
      >
        {{ props.copy.heading }}
      </h2>
      <p v-if="props.copy.body" class="mt-3 max-w-[42rem] text-sm leading-6 text-zinc-400">
        {{ props.copy.body }}
      </p>
    </div>

    <div
      v-if="visibleCertificates.length > 0"
      class="certificate-rail"
      :class="props.isAppLayout ? 'certificate-rail-app' : 'certificate-rail-desktop'"
    >
      <template
        v-for="(certificate, index) in visibleCertificates"
        :key="`${certificate.title}-${certificate.credentialId ?? index}`"
      >
        <figure
          v-if="certificate.imageSrc?.trim()"
          class="certificate-frame"
          :class="props.isAppLayout ? 'certificate-frame-app' : 'certificate-frame-desktop'"
          :aria-label="certificate.title"
        >
          <img
            :src="certificate.imageSrc"
            :alt="certificate.imageAlt ?? certificate.title"
            class="certificate-image"
            loading="lazy"
            draggable="false"
          />
        </figure>

        <article
          v-else
          class="certificate-frame certificate-text-card"
          :class="props.isAppLayout ? 'certificate-frame-app' : 'certificate-frame-desktop'"
          :aria-label="certificate.title"
        >
          <p v-if="certificate.status" class="certificate-status">{{ certificate.status }}</p>
          <h3 class="certificate-title">{{ certificate.title }}</h3>
          <p v-if="certificate.description" class="certificate-description">
            {{ certificate.description }}
          </p>

          <dl v-if="getCertificateMeta(certificate).length > 0" class="certificate-meta">
            <div
              v-for="entry in getCertificateMeta(certificate)"
              :key="`${certificate.title}-${entry.label}`"
              class="certificate-meta-row"
            >
              <dt>{{ entry.label }}</dt>
              <dd>{{ entry.value }}</dd>
            </div>
          </dl>

          <ul v-if="certificate.tags.length > 0" class="certificate-tag-list">
            <li
              v-for="tag in certificate.tags"
              :key="`${certificate.title}-${tag}`"
              class="certificate-tag"
            >
              {{ tag }}
            </li>
          </ul>
        </article>
      </template>
    </div>

    <article v-else class="certificate-empty-state">
      <h3 class="text-lg font-semibold text-[var(--text-strong)]">{{ props.copy.emptyTitle }}</h3>
      <p class="mt-2 text-sm leading-6 text-[var(--text-faint)]">{{ props.copy.emptyBody }}</p>
    </article>
  </section>
</template>

<style scoped>
.certificate-rail {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x proximity;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.certificate-rail::-webkit-scrollbar {
  display: none;
}

.certificate-rail-app {
  gap: 0.85rem;
  margin-top: 1rem;
  padding: 0.2rem 0 0.3rem;
}

.certificate-rail-desktop {
  gap: 1rem;
  margin-top: 1.25rem;
  padding: 0.25rem 0 0.4rem;
}

.certificate-frame {
  flex: 0 0 auto;
  scroll-snap-align: start;
}

.certificate-frame-app {
  width: min(21.5rem, calc(100vw - 2.5rem));
}

.certificate-frame-desktop {
  width: min(32rem, calc(100vw - 5rem));
}

.certificate-image {
  display: block;
  width: 100%;
  height: auto;
  background: transparent;
  user-select: none;
  -webkit-user-drag: none;
}

.certificate-text-card {
  min-height: 14rem;
  padding: 1.35rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.4rem;
  background:
    radial-gradient(circle at top right, rgba(86, 146, 255, 0.18), transparent 34%),
    linear-gradient(160deg, rgba(16, 21, 31, 0.96), rgba(9, 13, 20, 0.98));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 20px 40px rgba(0, 0, 0, 0.16);
}

.certificate-status {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  border: 1px solid rgba(143, 185, 255, 0.3);
  background: rgba(67, 106, 180, 0.18);
  color: #d8e6ff;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.certificate-title {
  margin-top: 0.9rem;
  color: #f5f7fb;
  font-size: 1.15rem;
  font-weight: 600;
  line-height: 1.45;
}

.certificate-description {
  margin-top: 0.7rem;
  color: rgba(226, 232, 240, 0.72);
  font-size: 0.92rem;
  line-height: 1.65;
}

.certificate-meta {
  margin-top: 1rem;
  display: grid;
  gap: 0.65rem;
}

.certificate-meta-row {
  display: grid;
  gap: 0.18rem;
}

.certificate-meta-row dt {
  color: rgba(148, 163, 184, 0.82);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.certificate-meta-row dd {
  margin: 0;
  color: #f5f7fb;
  font-size: 0.95rem;
  line-height: 1.5;
}

.certificate-tag-list {
  margin-top: 1rem;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.certificate-tag {
  padding: 0.4rem 0.7rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(241, 245, 249, 0.82);
  font-size: 0.8rem;
}

.certificate-empty-state {
  margin-top: 1.25rem;
  padding: 1.6rem 1.25rem;
  border: 1px dashed var(--line-muted);
  border-radius: 1.25rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.02);
}

@media (min-width: 768px) {
  .certificate-frame-desktop {
    width: min(34rem, calc(100vw - 7rem));
  }

  .certificate-image {
    height: auto;
  }
}
</style>
