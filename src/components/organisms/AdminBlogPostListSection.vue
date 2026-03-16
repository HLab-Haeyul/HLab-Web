<script setup lang="ts">
import AdminBlogPostCard from '@/components/molecules/AdminBlogPostCard.vue'
import type { AdminBlogPostCardItem } from '@/types/adminBlog'

type Props = {
  items: AdminBlogPostCardItem[]
  isManagingPost: boolean
  adminBlogWritePath: string
  sectionTitle?: string
  description?: string
  selectionHint?: string
  createLabel?: string
  emptyLabel?: string
  openHint?: string
  deleteLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  sectionTitle: '섹션 3. 게시글 목록',
  description: '기존 글을 선택하거나 카드에서 바로 삭제할 수 있습니다.',
  selectionHint: '박스를 선택하면 댓글 관리 화면으로 이동합니다.',
  createLabel: '새 글 작성',
  emptyLabel: '게시글이 없습니다.',
  openHint: '댓글 관리 화면으로 이동',
  deleteLabel: '글 삭제',
})

const emit = defineEmits<{
  open: [id: string]
  delete: [id: string]
}>()
</script>

<template>
  <section
    id="admin-blog-list"
    class="rounded-[1.2rem] border border-[#2a2a2a] bg-[#121212dd] p-4 sm:p-5"
  >
    <h2 class="text-base font-semibold text-zinc-100 sm:text-lg">{{ props.sectionTitle }}</h2>
    <div class="mt-2 flex flex-wrap items-center justify-between gap-2">
      <p class="text-sm text-zinc-400">{{ props.description }}</p>
      <div class="flex items-center gap-3">
        <p class="text-xs text-zinc-500">{{ props.selectionHint }}</p>
        <RouterLink
          :to="props.adminBlogWritePath"
          class="inline-flex items-center rounded-md border border-blue-500 bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:border-blue-400 hover:bg-blue-500"
        >
          {{ props.createLabel }}
        </RouterLink>
      </div>
    </div>

    <div v-if="props.items.length > 0" class="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      <AdminBlogPostCard
        v-for="item in props.items"
        :key="item.id"
        :item="item"
        :delete-disabled="props.isManagingPost"
        :open-hint="props.openHint"
        :delete-label="props.deleteLabel"
        @open="emit('open', $event)"
        @delete="emit('delete', $event)"
      />
    </div>

    <div
      v-else
      class="mt-3 rounded-lg border border-[#2a2a2a] bg-[#0f0f0f] px-3 py-4 text-center text-xs text-zinc-500"
    >
      {{ props.emptyLabel }}
    </div>
  </section>
</template>
