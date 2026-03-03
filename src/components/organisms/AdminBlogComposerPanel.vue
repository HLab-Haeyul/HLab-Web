<script setup lang="ts">
import BlogPostAdminPanel from '@/components/organisms/BlogPostAdminPanel.vue'
import type {
  AdminBlogCategoryOption,
  AdminBlogRetrospectiveProjectOption,
  BlogPostAdminDraft,
} from '@/types/adminBlog'

type Props = {
  writeMode: boolean
  isEditComposerMode: boolean
  editQueryId: string | null
  isEditTargetPostLoading: boolean
  editTargetPostErrorMessage: string | null
  isManagingPost: boolean
  adminCategoryOptions: AdminBlogCategoryOption[]
  retrospectiveProjectOptions: AdminBlogRetrospectiveProjectOption[]
  composerSeedDraft: BlogPostAdminDraft
  composerSeedKey: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  create: [payload: BlogPostAdminDraft]
  update: [payload: BlogPostAdminDraft]
  delete: [payload: { id: string }]
}>()

const composerSectionId = 'admin-blog-compose'
</script>

<template>
  <section
    :id="composerSectionId"
    :class="
      props.writeMode
        ? 'w-full'
        : 'w-full rounded-[1.4rem] border border-[#2a2a2a] bg-[#101010cc] p-5 sm:p-7'
    "
  >
    <p v-if="!props.writeMode && props.isEditComposerMode" class="mb-3 text-xs text-zinc-500">
      수정 모드입니다. 대상 글 ID: <span class="font-mono text-zinc-300">{{ props.editQueryId }}</span>
    </p>
    <p
      v-if="!props.writeMode && props.isEditComposerMode && props.isEditTargetPostLoading"
      class="mb-3 rounded-lg border border-[#2f2f2f] bg-[#141414] px-3 py-2 text-xs text-zinc-400"
    >
      기존 글 본문을 불러오는 중입니다.
    </p>
    <p
      v-if="!props.writeMode && props.isEditComposerMode && props.editTargetPostErrorMessage"
      class="mb-3 rounded-lg border border-[#47361b] bg-[#2a1f11] px-3 py-2 text-xs text-amber-300"
    >
      {{ props.editTargetPostErrorMessage }}
    </p>
    <BlogPostAdminPanel
      panel-title="게시글 관리자"
      panel-description="ID를 기준으로 게시글 생성/수정/삭제를 수행합니다."
      id-label="게시글 ID"
      title-label="제목"
      excerpt-label="요약"
      category-label="카테고리"
      tags-label="태그"
      tags-placeholder="vue,typescript,회고"
      retrospective-project-label="연결 프로젝트"
      retrospective-project-placeholder="프로젝트 선택"
      published-at-label="발행일"
      read-time-label="읽기 시간"
      hero-tag-label="히어로 태그"
      author-label="작성자"
      markdown-label="마크다운 본문"
      markdown-placeholder="마크다운 본문을 입력하세요..."
      create-label="작성 완료"
      update-label="게시글 수정"
      delete-label="게시글 삭제"
      reset-label="초기화"
      :is-submitting="props.isManagingPost"
      :category-options="props.adminCategoryOptions"
      :retrospective-project-options="props.retrospectiveProjectOptions"
      :show-id-field="false"
      :show-excerpt-field="false"
      :show-author-field="false"
      :show-published-at-field="false"
      :show-read-time-field="false"
      :show-hero-tag-field="false"
      :show-create-button="props.writeMode"
      :show-update-button="!props.writeMode && props.isEditComposerMode"
      :show-delete-button="!props.writeMode"
      :minimal-boxes="props.writeMode"
      :seed-draft="props.composerSeedDraft"
      :seed-key="props.composerSeedKey"
      @create="emit('create', $event)"
      @update="emit('update', $event)"
      @delete="emit('delete', $event)"
    />
  </section>
</template>
