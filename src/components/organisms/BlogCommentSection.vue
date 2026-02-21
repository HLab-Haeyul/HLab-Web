<script setup lang="ts">
import { ref, watch } from 'vue'
import type { BlogComment } from '@/data/blog/types'

type Props = {
  commentHeading: string
  comments: BlogComment[]
  commentTotalCount: number
  commentTotalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  isCommentPageLoading: boolean
  commentPageLoadingLabel: string
  commentPageStatusLabel: string
  commentPrevLabel: string
  commentNextLabel: string
  commentAuthor: string
  commentBody: string
  commentAuthorPlaceholder: string
  commentBodyPlaceholder: string
  commentSubmitLabel: string
  isSubmitting: boolean
  commentEmptyLabel: string
  isAdminMode: boolean
  isCommentActionLoading: boolean
  commentEditLabel: string
  commentDeleteLabel: string
  commentSaveLabel: string
  commentCancelLabel: string
  commentEditPlaceholder: string
  formatCommentDate: (value: string) => string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:commentAuthor': [value: string]
  'update:commentBody': [value: string]
  submit: []
  'go-prev-page': []
  'go-next-page': []
  'edit-comment': [payload: { commentId: string; body: string }]
  'delete-comment': [payload: { commentId: string }]
}>()

const editingCommentId = ref<string | null>(null)
const editBody = ref('')

watch(
  () => props.comments,
  (nextComments) => {
    if (!editingCommentId.value) {
      return
    }

    const target = nextComments.find((comment) => comment.id === editingCommentId.value)

    if (!target) {
      editingCommentId.value = null
      editBody.value = ''
    }
  },
)

const handleStartEdit = (comment: BlogComment) => {
  editingCommentId.value = comment.id
  editBody.value = comment.body
}

const handleCancelEdit = () => {
  editingCommentId.value = null
  editBody.value = ''
}

const handleSubmitEdit = () => {
  if (!editingCommentId.value) {
    return
  }

  emit('edit-comment', {
    commentId: editingCommentId.value,
    body: editBody.value,
  })

  editingCommentId.value = null
  editBody.value = ''
}

const handleDelete = (commentId: string) => {
  emit('delete-comment', {
    commentId,
  })
}
</script>

<template>
  <section id="post-comments" class="mt-10 border-t border-[#2a2a2a] pt-6">
    <h2 class="text-lg font-semibold text-zinc-100">{{ props.commentHeading }} {{ props.commentTotalCount }}</h2>

    <form class="mt-4 space-y-2" @submit.prevent="emit('submit')">
      <input
        :value="props.commentAuthor"
        type="text"
        class="w-full rounded-xl border border-[#2f2f2f] bg-[#171717] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-[#5a5a5a] focus:outline-none"
        :placeholder="props.commentAuthorPlaceholder"
        @input="emit('update:commentAuthor', ($event.target as HTMLInputElement).value)"
      />
      <textarea
        :value="props.commentBody"
        class="min-h-24 w-full resize-y rounded-xl border border-[#2f2f2f] bg-[#171717] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-[#5a5a5a] focus:outline-none"
        :placeholder="props.commentBodyPlaceholder"
        @input="emit('update:commentBody', ($event.target as HTMLTextAreaElement).value)"
      ></textarea>
      <div class="flex justify-end">
        <button
          type="submit"
          class="rounded-lg border border-[#313131] px-3 py-1.5 text-xs text-zinc-200 transition hover:border-[#5b5b5b] hover:text-white disabled:opacity-60"
          :disabled="props.isSubmitting"
        >
          {{ props.commentSubmitLabel }}
        </button>
      </div>
    </form>

    <div class="mt-4 space-y-2">
      <p v-if="props.isCommentPageLoading" class="text-sm text-zinc-400">{{ props.commentPageLoadingLabel }}</p>
      <template v-else>
        <article
          v-for="comment in props.comments"
          :key="comment.id"
          class="rounded-xl border border-[#2d2d2d] bg-[#151515] px-3 py-2.5"
        >
          <div class="flex items-center justify-between gap-2">
            <p class="text-xs font-semibold text-zinc-200">{{ comment.authorName }}</p>
            <p class="text-[11px] text-zinc-500">{{ props.formatCommentDate(comment.createdAt) }}</p>
          </div>

          <template v-if="editingCommentId === comment.id">
            <textarea
              v-model="editBody"
              class="mt-1.5 min-h-20 w-full resize-y rounded-lg border border-[#3a3a3a] bg-[#101010] px-2.5 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-[#5a5a5a] focus:outline-none"
              :placeholder="props.commentEditPlaceholder"
              :disabled="props.isCommentActionLoading"
            ></textarea>
            <div class="mt-2 flex justify-end gap-2">
              <button
                type="button"
                class="rounded-md border border-[#3c3c3c] px-2.5 py-1 text-[11px] text-zinc-300 transition hover:border-[#5b5b5b] hover:text-white disabled:opacity-50"
                :disabled="props.isCommentActionLoading"
                @click="handleCancelEdit"
              >
                {{ props.commentCancelLabel }}
              </button>
              <button
                type="button"
                class="rounded-md border border-[#3c3c3c] px-2.5 py-1 text-[11px] text-zinc-200 transition hover:border-[#5b5b5b] hover:text-white disabled:opacity-50"
                :disabled="props.isCommentActionLoading"
                @click="handleSubmitEdit"
              >
                {{ props.commentSaveLabel }}
              </button>
            </div>
          </template>
          <template v-else>
            <p class="mt-1.5 whitespace-pre-line text-sm text-zinc-300">{{ comment.body }}</p>
            <div v-if="props.isAdminMode" class="mt-2 flex justify-end gap-2">
              <button
                type="button"
                class="rounded-md border border-[#3c3c3c] px-2.5 py-1 text-[11px] text-zinc-300 transition hover:border-[#5b5b5b] hover:text-white disabled:opacity-50"
                :disabled="props.isCommentActionLoading"
                @click="handleStartEdit(comment)"
              >
                {{ props.commentEditLabel }}
              </button>
              <button
                type="button"
                class="rounded-md border border-[#4b2a2a] px-2.5 py-1 text-[11px] text-rose-300 transition hover:border-[#7b3737] hover:text-rose-200 disabled:opacity-50"
                :disabled="props.isCommentActionLoading"
                @click="handleDelete(comment.id)"
              >
                {{ props.commentDeleteLabel }}
              </button>
            </div>
          </template>
        </article>
        <p v-if="props.comments.length === 0" class="text-sm text-zinc-400">{{ props.commentEmptyLabel }}</p>
      </template>
    </div>

    <div v-if="props.commentTotalPages > 1" class="mt-4 flex items-center justify-between gap-3">
      <p class="text-xs text-zinc-500">{{ props.commentPageStatusLabel }}</p>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="rounded-lg border border-[#313131] px-3 py-1.5 text-xs text-zinc-200 transition hover:border-[#5b5b5b] hover:text-white disabled:opacity-50"
          :disabled="props.isCommentPageLoading || !props.hasPreviousPage"
          @click="emit('go-prev-page')"
        >
          {{ props.commentPrevLabel }}
        </button>
        <button
          type="button"
          class="rounded-lg border border-[#313131] px-3 py-1.5 text-xs text-zinc-200 transition hover:border-[#5b5b5b] hover:text-white disabled:opacity-50"
          :disabled="props.isCommentPageLoading || !props.hasNextPage"
          @click="emit('go-next-page')"
        >
          {{ props.commentNextLabel }}
        </button>
      </div>
    </div>
  </section>
</template>
