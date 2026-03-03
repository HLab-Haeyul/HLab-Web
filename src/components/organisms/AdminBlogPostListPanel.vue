<script setup lang="ts">
import type { BlogCategoryKey } from '@/data/blog/content'
import type { BlogPost } from '@/data/blog/types'
import AdminBlogPostListCard from '@/components/molecules/AdminBlogPostListCard.vue'

type Props = {
  posts: BlogPost[]
  postThumbnailById: Record<string, string>
  adminBlogWritePath: string
  isManagingPost: boolean
  categoryTitle: (category: BlogCategoryKey) => string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'open-post': [id: string]
  'delete-post': [id: string]
}>()
</script>

<template>
  <section
    id="admin-blog-list"
    class="rounded-[1.2rem] border border-[#2a2a2a] bg-[#121212dd] p-4 sm:p-5"
  >
    <h2 class="text-base font-semibold text-zinc-100 sm:text-lg">섹션 3. 게시글 목록</h2>
    <div class="mt-2 flex flex-wrap items-center justify-between gap-2">
      <p class="text-sm text-zinc-400">기존 글을 선택하거나 카드에서 바로 삭제할 수 있습니다.</p>
      <div class="flex items-center gap-3">
        <p class="text-xs text-zinc-500">박스를 선택하면 댓글 관리 화면으로 이동합니다.</p>
        <RouterLink
          :to="props.adminBlogWritePath"
          class="inline-flex items-center rounded-md border border-blue-500 bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:border-blue-400 hover:bg-blue-500"
        >
          새 글 작성
        </RouterLink>
      </div>
    </div>

    <div v-if="props.posts.length > 0" class="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      <AdminBlogPostListCard
        v-for="post in props.posts"
        :key="post.id"
        :post="post"
        :thumbnail-src="props.postThumbnailById[post.id]"
        :category-label="props.categoryTitle(post.category)"
        :is-managing-post="props.isManagingPost"
        @open="emit('open-post', $event)"
        @delete="emit('delete-post', $event)"
      />
    </div>

    <div v-else class="mt-3 rounded-lg border border-[#2a2a2a] bg-[#0f0f0f] px-3 py-4 text-center text-xs text-zinc-500">
      게시글이 없습니다.
    </div>
  </section>
</template>
