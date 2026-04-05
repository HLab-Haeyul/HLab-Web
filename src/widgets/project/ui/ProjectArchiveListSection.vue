<script setup lang="ts">
import { ProjectArchiveListItem } from '@/entities/project'
import type {
  ProjectArchiveCopy,
  ProjectArchiveProject,
  ProjectToneStyle,
} from '@/entities/project'

defineProps<{
  copy: Pick<ProjectArchiveCopy, 'listHeading' | 'listLead' | 'selectedLabel'>
  projects: ProjectArchiveProject[]
  selectedProjectIndex: number
  getProjectToneStyle: (projectTitle: string) => ProjectToneStyle
}>()

const emit = defineEmits<{
  selectProject: [index: number]
}>()

const handleSelectProject = (index: number) => {
  emit('selectProject', index)
}
</script>

<template>
  <aside
    id="projects-list"
    class="border-t border-[var(--line-strong)] pt-4 xl:sticky xl:top-24 xl:self-start"
  >
    <p class="text-sm font-semibold text-[var(--text-strong)]">{{ copy.listHeading }}</p>
    <p v-if="copy.listLead" class="mt-1.5 text-sm leading-6 text-[var(--text-soft)]">
      {{ copy.listLead }}
    </p>

    <div class="mt-4 space-y-2.5">
      <ProjectArchiveListItem
        v-for="(project, projectIndex) in projects"
        :key="project.title"
        :project="project"
        :project-index="projectIndex"
        :is-selected="selectedProjectIndex === projectIndex"
        :selected-label="copy.selectedLabel"
        :tone-style="getProjectToneStyle(project.title)"
        @select="handleSelectProject(projectIndex)"
      />
    </div>
  </aside>
</template>
