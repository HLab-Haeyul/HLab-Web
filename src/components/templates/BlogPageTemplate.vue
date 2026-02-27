<script setup lang="ts">
import type { BlogCategoryKey, BlogPageCopySet } from '@/data/blog/content'
import type { Ref } from 'vue'
import { useBlogPage } from '@/composables/useBlogPage'
import { useBlogAdmin } from '@/composables/useBlogAdmin'
import BlogPostAdminPanel from '@/components/organisms/BlogPostAdminPanel.vue'
import BlogCategoryBrowser from '@/components/organisms/BlogCategoryBrowser.vue'

const props = defineProps<{
  locale: 'ko' | 'en'
  copy: BlogPageCopySet
  isManagingPost: boolean
  createPost: (input: {
    title: string
    excerpt: string
    category: BlogCategoryKey
    tags: string[]
    markdown: string
  }) => Promise<void>
  updatePost: (
    id: string,
    payload: { title?: string; tags?: string[]; markdown?: string },
  ) => Promise<void>
  removePost: (id: string) => Promise<void>
}>()

import { computed, toRef } from 'vue'
import { useRoute } from 'vue-router'

const localeRef = toRef(props, 'locale') as Readonly<Ref<'ko' | 'en'>>
const copyRef = computed(() => props.copy)
const route = useRoute()

const {
  categoryLabel,
  searchLabel,
  searchPlaceholder,
  viewLabel,
  projectSelectorLabel,
  projectSelectorPlaceholder,
  searchQuery,
  isSearchActive,
  selectedCategory,
  groupedPosts,
  selectedGroup,
  selectCategory,
  selectedProjectIndex,
  projectWorks,
  handleProjectChange,
  filteredSelectedPosts,
  canRenderPostList,
  postThumbnailById,
  emptyStateLabel,
  activeSectionTitle,
  activeSectionDescription,
  categoryTitle,
  buildPostPath,
  getViewCount,
  getCardAnimationDelay,
} = useBlogPage(localeRef, copyRef)

const isManagingPostRef = computed(() => props.isManagingPost)

const {
  isAdminPostMode,
  adminPanelTitle,
  adminPanelDescription,
  adminIdLabel,
  adminTitleLabel,
  adminExcerptLabel,
  adminCategoryLabel,
  adminTagsLabel,
  adminTagsPlaceholder,
  adminRetrospectiveProjectLabel,
  adminRetrospectiveProjectPlaceholder,
  adminPublishedAtLabel,
  adminReadTimeLabel,
  adminHeroTagLabel,
  adminAuthorLabel,
  adminMarkdownLabel,
  adminMarkdownPlaceholder,
  adminCreateLabel,
  adminUpdateLabel,
  adminDeleteLabel,
  adminResetLabel,
  adminCategoryOptions,
  retrospectiveProjectOptions,
  handleCreatePost,
  handleUpdatePost,
  handleDeletePost,
} = useBlogAdmin(
  localeRef,
  copyRef,
  {
    createPost: props.createPost,
    updatePost: props.updatePost,
    removePost: props.removePost,
    isManagingPost: isManagingPostRef,
  },
  { query: route.query as Record<string, unknown> },
)
</script>

<template>
  <div class="mx-auto min-h-screen w-full max-w-[1480px] px-4 pb-20 pt-10 sm:px-8 lg:px-12">
    <main class="space-y-8">
      <header class="focus-fade-in space-y-2">
        <p class="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">{{ copy.kicker }}</p>
        <h1 class="text-3xl font-semibold leading-tight text-zinc-100">{{ copy.heading }}</h1>
        <p class="max-w-[76ch] text-sm leading-7 text-zinc-400">{{ copy.description }}</p>
      </header>

      <BlogPostAdminPanel
        v-if="isAdminPostMode"
        :panel-title="adminPanelTitle"
        :panel-description="adminPanelDescription"
        :id-label="adminIdLabel"
        :title-label="adminTitleLabel"
        :excerpt-label="adminExcerptLabel"
        :category-label="adminCategoryLabel"
        :tags-label="adminTagsLabel"
        :tags-placeholder="adminTagsPlaceholder"
        :retrospective-project-label="adminRetrospectiveProjectLabel"
        :retrospective-project-placeholder="adminRetrospectiveProjectPlaceholder"
        :published-at-label="adminPublishedAtLabel"
        :read-time-label="adminReadTimeLabel"
        :hero-tag-label="adminHeroTagLabel"
        :author-label="adminAuthorLabel"
        :markdown-label="adminMarkdownLabel"
        :markdown-placeholder="adminMarkdownPlaceholder"
        :create-label="adminCreateLabel"
        :update-label="adminUpdateLabel"
        :delete-label="adminDeleteLabel"
        :reset-label="adminResetLabel"
        :is-submitting="isManagingPost"
        :category-options="adminCategoryOptions"
        :retrospective-project-options="retrospectiveProjectOptions"
        :show-id-field="false"
        :show-excerpt-field="false"
        :show-author-field="false"
        :show-published-at-field="false"
        :show-read-time-field="false"
        :show-hero-tag-field="false"
        @create="handleCreatePost"
        @update="handleUpdatePost"
        @delete="handleDeletePost"
      />

      <BlogCategoryBrowser
        :grouped-posts="groupedPosts"
        :selected-category="selectedCategory"
        :search-label="searchLabel"
        :search-placeholder="searchPlaceholder"
        :search-query="searchQuery"
        :is-search-active="isSearchActive"
        :category-label="categoryLabel"
        :active-section-title="activeSectionTitle"
        :active-section-description="activeSectionDescription"
        :project-selector-label="projectSelectorLabel"
        :project-selector-placeholder="projectSelectorPlaceholder"
        :project-works="projectWorks"
        :selected-project-index="selectedProjectIndex"
        :filtered-selected-posts="filteredSelectedPosts"
        :can-render-post-list="canRenderPostList"
        :post-thumbnail-by-id="postThumbnailById"
        :empty-state-label="emptyStateLabel"
        :view-label="viewLabel"
        :selected-group="selectedGroup"
        :category-title="categoryTitle"
        :build-post-path="buildPostPath"
        :get-view-count="getViewCount"
        :get-card-animation-delay="getCardAnimationDelay"
        @select-category="selectCategory($event as BlogCategoryKey)"
        @update:search-query="searchQuery = $event"
        @change-project="handleProjectChange"
      />
    </main>
  </div>
</template>

<style scoped>
.focus-fade-in {
  animation: focusFadeUp 420ms cubic-bezier(0.22, 0.8, 0.2, 1) both;
}

@keyframes focusFadeUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .focus-fade-in {
    animation: none;
  }
}
</style>
