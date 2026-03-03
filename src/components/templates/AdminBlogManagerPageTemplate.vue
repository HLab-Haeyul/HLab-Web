<script setup lang="ts">
import AdminSidebarNav from '@/components/organisms/AdminSidebarNav.vue'
import AdminBlogComposerPanel from '@/components/organisms/AdminBlogComposerPanel.vue'
import AdminBlogManagerHeader from '@/components/organisms/AdminBlogManagerHeader.vue'
import AdminBlogManagerOverviewPanel from '@/components/organisms/AdminBlogManagerOverviewPanel.vue'
import AdminBlogPostListPanel from '@/components/organisms/AdminBlogPostListPanel.vue'
import { useAdminBlogManager } from '@/composables/useAdminBlogManager'

type Props = {
  writeMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  writeMode: false,
})

const {
  writeMode,
  basePath,
  adminPath,
  adminBlogPath,
  adminBlogWritePath,
  copy,
  isLoading,
  isManagingPost,
  errorMessage,
  reload,
  panelDescription,
  pageHeading,
  adminCategoryOptions,
  retrospectiveProjectOptions,
  editQueryId,
  isEditComposerMode,
  showComposerSection,
  isEditTargetPostLoading,
  editTargetPostErrorMessage,
  composerSeedDraft,
  composerSeedKey,
  postThumbnailById,
  openPostFromCard,
  categoryTitle,
  handleCreatePost,
  handleUpdatePost,
  handleDeletePost,
} = useAdminBlogManager({ writeMode: props.writeMode })
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
        <AdminBlogManagerHeader
          :write-mode="writeMode"
          :page-heading="pageHeading"
          :panel-description="panelDescription"
          :admin-blog-write-path="adminBlogWritePath"
          :admin-blog-path="adminBlogPath"
          :admin-path="adminPath"
          :base-path="basePath"
          :is-loading="isLoading"
          :is-managing-post="isManagingPost"
          @reload="reload"
        />

        <AdminBlogManagerOverviewPanel
          v-if="!writeMode"
          :post-count="copy.posts.length"
          :error-message="errorMessage"
        />

        <AdminBlogComposerPanel
          v-if="showComposerSection"
          :write-mode="writeMode"
          :is-edit-composer-mode="isEditComposerMode"
          :edit-query-id="editQueryId"
          :is-edit-target-post-loading="isEditTargetPostLoading"
          :edit-target-post-error-message="editTargetPostErrorMessage"
          :is-managing-post="isManagingPost"
          :admin-category-options="adminCategoryOptions"
          :retrospective-project-options="retrospectiveProjectOptions"
          :composer-seed-draft="composerSeedDraft"
          :composer-seed-key="composerSeedKey"
          @create="handleCreatePost"
          @update="handleUpdatePost"
          @delete="handleDeletePost"
        />

        <AdminBlogPostListPanel
          v-if="!writeMode"
          :posts="copy.posts"
          :post-thumbnail-by-id="postThumbnailById"
          :admin-blog-write-path="adminBlogWritePath"
          :is-managing-post="isManagingPost"
          :category-title="categoryTitle"
          @open-post="openPostFromCard"
          @delete-post="handleDeletePost"
        />
      </div>
    </main>
  </div>
</template>
