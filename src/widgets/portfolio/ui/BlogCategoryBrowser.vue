<script setup lang="ts">
import type { BlogCategoryKey } from '@/data/blog/content'
import type { BlogPost } from '@/data/blog/types'
import BlogSearchInput from '@/components/atoms/BlogSearchInput.vue'
import EmptyStateMessage from '@/components/atoms/EmptyStateMessage.vue'
import BlogSectionHeader from '@/components/atoms/BlogSectionHeader.vue'
import BlogCategoryPillBar from '@/components/molecules/BlogCategoryPillBar.vue'
import BlogProjectDropdown from '@/components/molecules/BlogProjectDropdown.vue'
import BlogPostGridCard from '@/components/molecules/BlogPostGridCard.vue'
import { computed } from 'vue'

type CategoryGroup = {
  key: string
  anchor: string
  title: string
  description: string
  posts: BlogPost[]
}

type WorkOption = {
  title: string
}

type Props = {
  /* category */
  groupedPosts: CategoryGroup[]
  selectedCategory: string
  /* search */
  searchLabel: string
  searchPlaceholder: string
  searchQuery: string
  isSearchActive: boolean
  /* section header */
  categoryLabel: string
  activeSectionTitle: string
  activeSectionDescription: string
  /* retrospective */
  projectSelectorLabel: string
  projectSelectorPlaceholder: string
  projectWorks: WorkOption[]
  selectedProjectIndex: number | null
  /* post list */
  filteredSelectedPosts: BlogPost[]
  canRenderPostList: boolean
  postThumbnailById: Record<string, string>
  emptyStateLabel: string
  viewLabel: string
  /* selected group */
  selectedGroup: CategoryGroup | undefined
  /* functions */
  categoryTitle: (category: BlogCategoryKey) => string
  buildPostPath: (id: string) => string
  getViewCount: (id: string) => number
  getCardAnimationDelay: (index: number) => string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'select-category': [category: string]
  'update:searchQuery': [value: string]
  'change-project': [value: string]
}>()

const searchModel = computed({
  get: () => props.searchQuery,
  set: (value: string) => emit('update:searchQuery', value),
})
</script>

<template>
  <section
    id="blog-categories"
    class="focus-fade-in-delayed rounded-[1.2rem] border border-[#2a2a2a] bg-[#121212dd] p-4 sm:p-5"
  >
    <BlogCategoryPillBar
      :groups="props.groupedPosts"
      :selected-category="props.selectedCategory"
      @select="emit('select-category', $event)"
    />

    <BlogSearchInput
      id="blog-search"
      v-model="searchModel"
      :label="props.searchLabel"
      :placeholder="props.searchPlaceholder"
      input-id="blog-search-input"
      class="mt-4"
    />

    <section
      v-if="props.selectedGroup"
      :id="props.isSearchActive ? 'blog-search-results' : props.selectedGroup.anchor"
      :key="props.isSearchActive ? 'search-results' : `category-${props.selectedGroup.key}`"
      class="mt-4 space-y-4"
    >
      <BlogSectionHeader
        :kicker="props.categoryLabel"
        :title="props.activeSectionTitle"
        :description="props.activeSectionDescription"
      />

      <BlogProjectDropdown
        v-if="props.selectedGroup.key === 'retrospective' && !props.isSearchActive"
        :label="props.projectSelectorLabel"
        :placeholder="props.projectSelectorPlaceholder"
        :works="props.projectWorks"
        :selected-index="props.selectedProjectIndex"
        @change="emit('change-project', $event)"
      />

      <TransitionGroup
        v-if="props.canRenderPostList && props.filteredSelectedPosts.length > 0"
        name="blog-post-focus"
        tag="div"
        class="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(320px,1fr))]"
      >
        <BlogPostGridCard
          v-for="(post, postIndex) in props.filteredSelectedPosts"
          :key="`post-${post.id}`"
          :id="post.id"
          :title="post.title"
          :excerpt="post.excerpt"
          :category="props.categoryTitle(post.category)"
          :published-at="post.publishedAt"
          :read-time="post.readTime"
          :tags="post.tags"
          :thumbnail-src="props.postThumbnailById[post.id]"
          :to="props.buildPostPath(post.id)"
          :view-label="props.viewLabel"
          :view-count="props.getViewCount(post.id)"
          :animation-delay="props.getCardAnimationDelay(postIndex)"
        />
      </TransitionGroup>

      <EmptyStateMessage v-else :message="props.emptyStateLabel" />
    </section>
  </section>
</template>

<style scoped>
.focus-fade-in-delayed {
  animation: focusFadeUp 520ms cubic-bezier(0.22, 0.8, 0.2, 1) both;
  animation-delay: 70ms;
}

.blog-post-focus-enter-active,
.blog-post-focus-leave-active {
  transition:
    opacity 220ms ease,
    transform 260ms cubic-bezier(0.22, 0.8, 0.2, 1);
}

.blog-post-focus-enter-from,
.blog-post-focus-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.993);
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
  .focus-fade-in-delayed {
    animation: none;
  }

  .blog-post-focus-enter-active,
  .blog-post-focus-leave-active {
    transition-duration: 1ms;
  }
}
</style>
