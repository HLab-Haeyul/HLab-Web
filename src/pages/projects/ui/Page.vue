<script setup lang="ts">
import PublicPageLayout from '@/widgets/public-layout'
import {
  ProjectArchiveDetailSection,
  ProjectArchiveListSection,
  ProjectArchiveOverviewSection,
} from '@/widgets/project'
import { SceneDivider } from '@/shared/ui'
import { useProjectArchivePage } from '../model/useProjectArchivePage'

const {
  copy,
  projects,
  selectedProjectIndex,
  detailTransitionNonce,
  selectedProject,
  selectedProjectToneStyle,
  getProjectToneStyle,
  resolveExternalLinkBadge,
  selectProject,
} = useProjectArchivePage()
</script>

<template>
  <PublicPageLayout>
    <main class="space-y-6">
      <ProjectArchiveOverviewSection
        :copy="copy"
      />

      <SceneDivider variant="beacon" class="mx-auto -my-2 md:-my-3" />

      <section class="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)] xl:items-start">
        <div class="xl:sticky xl:top-24">
          <ProjectArchiveListSection
            :copy="copy"
            :projects="projects"
            :selected-project-index="selectedProjectIndex"
            :get-project-tone-style="getProjectToneStyle"
            @select-project="selectProject"
          />
        </div>

        <Transition name="detail-focus" mode="out-in">
          <ProjectArchiveDetailSection
            v-if="selectedProject"
            :key="`${selectedProjectIndex}-${detailTransitionNonce}`"
            :copy="copy"
            :selected-project="selectedProject"
            :selected-project-tone-style="selectedProjectToneStyle"
            :resolve-external-link-badge="resolveExternalLinkBadge"
          />
        </Transition>
      </section>
    </main>
  </PublicPageLayout>
</template>

<style scoped>
.detail-focus-enter-active,
.detail-focus-leave-active {
  transition:
    opacity 220ms ease,
    transform 260ms cubic-bezier(0.22, 0.8, 0.2, 1);
}

.detail-focus-enter-from,
.detail-focus-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.992);
}

@media (prefers-reduced-motion: reduce) {
  .detail-focus-enter-active,
  .detail-focus-leave-active {
    transition-duration: 1ms;
  }
}
</style>
