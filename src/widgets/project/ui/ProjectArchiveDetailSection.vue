<script setup lang="ts">
import { computed } from 'vue'
import { ProjectArchiveExternalLinkCard, ProjectArchiveMetaCard } from '@/entities/project'
import type { ProjectArchiveCopy, ProjectArchiveProject, ProjectToneStyle } from '@/entities/project'

const props = defineProps<{
  copy: Pick<
    ProjectArchiveCopy,
    | 'detailHeading'
    | 'detailLead'
    | 'summaryLabel'
    | 'impactLabel'
    | 'stackLabel'
    | 'linksHeading'
    | 'linksLead'
    | 'linksEmpty'
  >
  selectedProject: ProjectArchiveProject
  selectedProjectToneStyle?: ProjectToneStyle
  resolveExternalLinkBadge: (name: string, url: string) => string
}>()

const projectLinks = computed(() => props.selectedProject.links ?? [])
</script>

<template>
  <section id="project-detail" class="project-detail-shell" :style="selectedProjectToneStyle">
    <div class="relative z-10">
      <div class="grid gap-4 xl:grid-cols-[minmax(300px,0.94fr)_minmax(0,1.06fr)]">
        <figure class="project-detail-media">
          <img
            v-if="selectedProject.imageSrc"
            :src="selectedProject.imageSrc"
            :alt="selectedProject.imageAlt ?? selectedProject.title"
            class="h-full w-full object-cover"
            loading="lazy"
          />
          <div v-else class="project-detail-placeholder">
            {{ selectedProject.title }}
          </div>
        </figure>

        <div class="flex min-w-0 flex-col justify-between">
          <div>
            <p class="project-section-label">{{ copy.detailHeading }}</p>
            <h2 class="ui-type-title-md mt-3 text-[var(--text-strong)]">
              {{ selectedProject.title }}
            </h2>
            <p class="ui-type-body mt-3 max-w-[58ch] text-[var(--text-soft)]">
              {{ copy.detailLead }}
            </p>
          </div>

          <div class="mt-5 grid gap-3 md:grid-cols-2">
            <ProjectArchiveMetaCard :label="copy.summaryLabel" :value="selectedProject.summary" />
            <ProjectArchiveMetaCard :label="copy.impactLabel" :value="selectedProject.impact" />
          </div>

          <div class="mt-5">
            <p class="project-section-label">{{ copy.stackLabel }}</p>
            <ul class="mt-3 flex flex-wrap gap-2">
              <li
                v-for="item in selectedProject.stack"
                :key="`${selectedProject.title}-detail-${item}`"
                class="project-stack-pill"
              >
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="mt-5">
        <article class="project-section-card">
          <h3 class="text-base font-semibold text-[var(--text-strong)]">{{ copy.linksHeading }}</h3>
          <p class="mt-1.5 text-sm leading-6 text-[var(--text-soft)]">{{ copy.linksLead }}</p>

          <div
            v-if="projectLinks.length > 0"
            class="project-link-list mt-4 grid gap-3 sm:grid-cols-2"
          >
            <ProjectArchiveExternalLinkCard
              v-for="link in projectLinks"
              :key="`${selectedProject.title}-${link.name}-${link.url}`"
              :link="link"
              :badge="resolveExternalLinkBadge(link.name, link.url)"
            />
          </div>

          <p v-else class="mt-4 text-sm text-[var(--text-muted)]">{{ copy.linksEmpty }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.project-detail-shell {
  position: relative;
  overflow: visible;
  border-top: 1px solid var(--line-strong);
  background: transparent;
  padding: 1.1rem 0 0;
  box-shadow: none;
}

.project-detail-shell::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 10rem;
  pointer-events: none;
  background:
    radial-gradient(circle at 18% 8%, var(--project-accent-soft), transparent 42%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent);
}

.project-detail-media {
  min-height: 18rem;
  overflow: hidden;
  border-radius: 1.5rem;
  background: linear-gradient(160deg, var(--project-surface), #141414);
}

.project-detail-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 1rem;
  text-align: center;
  color: var(--text-strong);
  background:
    radial-gradient(circle at 18% 18%, var(--project-accent-soft), transparent 46%),
    linear-gradient(160deg, var(--project-surface), #141414);
}

.project-section-label {
  font-size: var(--type-label-xs);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.project-stack-pill {
  padding: 0;
  font-size: var(--type-label-xs);
  color: var(--text-soft);
}

.project-section-card {
  border-top: 1px solid var(--line-strong);
  padding: 1.1rem 0 0;
}

@media (max-width: 639px) {
  .project-detail-shell {
    padding: 0.95rem;
  }

  .project-detail-media {
    min-height: 14rem;
  }
}

</style>
