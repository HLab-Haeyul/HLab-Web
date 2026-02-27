<script setup lang="ts">
import AdminSidebarNav from '@/components/organisms/AdminSidebarNav.vue'
import AdminProjectEditorPanel from '@/components/organisms/AdminProjectEditorPanel.vue'
import AdminProjectManagerIntroPanel from '@/components/organisms/AdminProjectManagerIntroPanel.vue'
import AdminProjectSelectionPanel from '@/components/organisms/AdminProjectSelectionPanel.vue'
import { useAdminProjectManager } from '@/composables/useAdminProjectManager'

const {
  basePath,
  adminPath,
  projects,
  selectedProjectId,
  selectedProject,
  editorDraft,
  activeEditorPanel,
  renderedTroubleshooting,
  createNewProject,
  openProjectManagerFromCard,
  openProjectEditorFromCard,
  deleteProjectFromCard,
  addCollaborationLink,
  removeCollaborationLink,
  saveSelectedProject,
  handleSelectProjectImage,
} = useAdminProjectManager()
</script>

<template>
  <div class="relative isolate mx-auto min-h-screen w-full max-w-[1480px] px-4 pb-14 pt-5 sm:px-8 lg:px-12">
    <div
      aria-hidden="true"
      class="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_14%_-6%,rgba(245,158,11,0.16),transparent_34%),radial-gradient(circle_at_85%_115%,rgba(59,130,246,0.12),transparent_36%)] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.92),rgba(0,0,0,0.4))]"
    ></div>

    <main class="grid gap-5 xl:grid-cols-[230px_minmax(0,1fr)] xl:items-start">
      <div class="xl:sticky xl:top-24">
        <AdminSidebarNav />
      </div>

      <div class="space-y-5">
        <AdminProjectManagerIntroPanel
          :project-count="projects.length"
          :admin-path="adminPath"
          :base-path="basePath"
          @create-project="createNewProject"
        />

        <AdminProjectSelectionPanel
          :projects="projects"
          :selected-project-id="selectedProjectId"
          @open-project="openProjectManagerFromCard"
          @edit-project="openProjectEditorFromCard"
          @delete-project="deleteProjectFromCard"
        />

        <AdminProjectEditorPanel
          :selected-project="selectedProject"
          :rendered-troubleshooting="renderedTroubleshooting"
          v-model:active-editor-panel="activeEditorPanel"
          v-model:title="editorDraft.title"
          v-model:summary="editorDraft.summary"
          v-model:impact="editorDraft.impact"
          v-model:team-role="editorDraft.teamRole"
          v-model:image-src="editorDraft.imageSrc"
          v-model:image-alt="editorDraft.imageAlt"
          v-model:troubleshooting="editorDraft.troubleshooting"
          v-model:collaboration-site-name="editorDraft.collaborationSiteName"
          v-model:collaboration-site-url="editorDraft.collaborationSiteUrl"
          v-model:collaboration-links="editorDraft.collaborationLinks"
          @save="saveSelectedProject"
          @add-collaboration-link="addCollaborationLink"
          @remove-collaboration-link="removeCollaborationLink"
          @select-project-image="handleSelectProjectImage"
        />
      </div>
    </main>
  </div>
</template>
