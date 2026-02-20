<script setup lang="ts">
import type { BlogComment } from '@/data/blog/types'

type Props = {
  commentHeading: string
  comments: BlogComment[]
  commentAuthor: string
  commentBody: string
  commentAuthorPlaceholder: string
  commentBodyPlaceholder: string
  commentSubmitLabel: string
  isSubmitting: boolean
  commentEmptyLabel: string
  formatCommentDate: (value: string) => string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:commentAuthor': [value: string]
  'update:commentBody': [value: string]
  submit: []
}>()
</script>

<template>
  <section id="post-comments" class="mt-10 border-t border-[#2a2a2a] pt-6">
    <h2 class="text-lg font-semibold text-zinc-100">{{ props.commentHeading }} {{ props.comments.length }}</h2>

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
      <article
        v-for="comment in props.comments"
        :key="comment.id"
        class="rounded-xl border border-[#2d2d2d] bg-[#151515] px-3 py-2.5"
      >
        <div class="flex items-center justify-between gap-2">
          <p class="text-xs font-semibold text-zinc-200">{{ comment.authorName }}</p>
          <p class="text-[11px] text-zinc-500">{{ props.formatCommentDate(comment.createdAt) }}</p>
        </div>
        <p class="mt-1.5 whitespace-pre-line text-sm text-zinc-300">{{ comment.body }}</p>
      </article>
      <p v-if="props.comments.length === 0" class="text-sm text-zinc-400">{{ props.commentEmptyLabel }}</p>
    </div>
  </section>
</template>
