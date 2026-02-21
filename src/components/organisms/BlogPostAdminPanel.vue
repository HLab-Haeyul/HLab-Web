<script setup lang="ts">
import { ref } from 'vue'
import type { BlogCategoryKey } from '@/data/blog/types'

type AdminCategoryOption = {
  key: BlogCategoryKey
  label: string
}

type BlogPostAdminDraft = {
  id: string
  title: string
  excerpt: string
  category: BlogCategoryKey
  tags: string
  publishedAt: string
  readTime: string
  heroTag: string
  authorName: string
  markdown: string
}

type Props = {
  panelTitle: string
  panelDescription: string
  idLabel: string
  titleLabel: string
  excerptLabel: string
  categoryLabel: string
  tagsLabel: string
  tagsPlaceholder: string
  publishedAtLabel: string
  readTimeLabel: string
  heroTagLabel: string
  authorLabel: string
  markdownLabel: string
  markdownPlaceholder: string
  createLabel: string
  updateLabel: string
  deleteLabel: string
  resetLabel: string
  isSubmitting: boolean
  categoryOptions: AdminCategoryOption[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  create: [payload: BlogPostAdminDraft]
  update: [payload: BlogPostAdminDraft]
  delete: [payload: { id: string }]
}>()

const defaultCategory = (props.categoryOptions[0]?.key ?? 'tech') as BlogCategoryKey

const id = ref('')
const title = ref('')
const excerpt = ref('')
const category = ref<BlogCategoryKey>(defaultCategory)
const tags = ref('')
const publishedAt = ref('')
const readTime = ref('')
const heroTag = ref('')
const authorName = ref('')
const markdown = ref('')

const buildDraft = (): BlogPostAdminDraft => ({
  id: id.value,
  title: title.value,
  excerpt: excerpt.value,
  category: category.value,
  tags: tags.value,
  publishedAt: publishedAt.value,
  readTime: readTime.value,
  heroTag: heroTag.value,
  authorName: authorName.value,
  markdown: markdown.value,
})

const resetForm = () => {
  id.value = ''
  title.value = ''
  excerpt.value = ''
  category.value = defaultCategory
  tags.value = ''
  publishedAt.value = ''
  readTime.value = ''
  heroTag.value = ''
  authorName.value = ''
  markdown.value = ''
}

const handleCreate = () => {
  emit('create', buildDraft())
}

const handleUpdate = () => {
  emit('update', buildDraft())
}

const handleDelete = () => {
  emit('delete', {
    id: id.value,
  })
}
</script>

<template>
  <section class="rounded-[1.2rem] border border-[#3a3122] bg-[#1b1710e6] p-4 sm:p-5">
    <div class="flex items-start justify-between gap-3">
      <div>
        <p class="text-[11px] uppercase tracking-[0.11em] text-amber-400">ADMIN</p>
        <h3 class="mt-1 text-base font-semibold text-zinc-100">{{ props.panelTitle }}</h3>
        <p class="mt-1 text-xs text-zinc-400">{{ props.panelDescription }}</p>
      </div>
      <button
        type="button"
        class="rounded-lg border border-[#4b3b28] px-3 py-1.5 text-xs text-zinc-200 transition hover:border-[#6a5439] hover:text-white disabled:opacity-50"
        :disabled="props.isSubmitting"
        @click="resetForm"
      >
        {{ props.resetLabel }}
      </button>
    </div>

    <div class="mt-4 grid gap-3 md:grid-cols-2">
      <label class="space-y-1">
        <span class="text-xs text-zinc-400">{{ props.idLabel }}</span>
        <input
          v-model="id"
          type="text"
          class="w-full rounded-lg border border-[#3c3427] bg-[#120f0b] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-[#6a5439] focus:outline-none"
        />
      </label>

      <label class="space-y-1">
        <span class="text-xs text-zinc-400">{{ props.categoryLabel }}</span>
        <select
          v-model="category"
          class="w-full rounded-lg border border-[#3c3427] bg-[#120f0b] px-3 py-2 text-sm text-zinc-200 focus:border-[#6a5439] focus:outline-none"
        >
          <option v-for="option in props.categoryOptions" :key="option.key" :value="option.key">
            {{ option.label }}
          </option>
        </select>
      </label>

      <label class="space-y-1 md:col-span-2">
        <span class="text-xs text-zinc-400">{{ props.titleLabel }}</span>
        <input
          v-model="title"
          type="text"
          class="w-full rounded-lg border border-[#3c3427] bg-[#120f0b] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-[#6a5439] focus:outline-none"
        />
      </label>

      <label class="space-y-1 md:col-span-2">
        <span class="text-xs text-zinc-400">{{ props.excerptLabel }}</span>
        <textarea
          v-model="excerpt"
          class="min-h-20 w-full resize-y rounded-lg border border-[#3c3427] bg-[#120f0b] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-[#6a5439] focus:outline-none"
        ></textarea>
      </label>

      <label class="space-y-1">
        <span class="text-xs text-zinc-400">{{ props.tagsLabel }}</span>
        <input
          v-model="tags"
          type="text"
          :placeholder="props.tagsPlaceholder"
          class="w-full rounded-lg border border-[#3c3427] bg-[#120f0b] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-[#6a5439] focus:outline-none"
        />
      </label>

      <label class="space-y-1">
        <span class="text-xs text-zinc-400">{{ props.publishedAtLabel }}</span>
        <input
          v-model="publishedAt"
          type="text"
          class="w-full rounded-lg border border-[#3c3427] bg-[#120f0b] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-[#6a5439] focus:outline-none"
        />
      </label>

      <label class="space-y-1">
        <span class="text-xs text-zinc-400">{{ props.readTimeLabel }}</span>
        <input
          v-model="readTime"
          type="text"
          class="w-full rounded-lg border border-[#3c3427] bg-[#120f0b] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-[#6a5439] focus:outline-none"
        />
      </label>

      <label class="space-y-1">
        <span class="text-xs text-zinc-400">{{ props.heroTagLabel }}</span>
        <input
          v-model="heroTag"
          type="text"
          class="w-full rounded-lg border border-[#3c3427] bg-[#120f0b] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-[#6a5439] focus:outline-none"
        />
      </label>

      <label class="space-y-1 md:col-span-2">
        <span class="text-xs text-zinc-400">{{ props.authorLabel }}</span>
        <input
          v-model="authorName"
          type="text"
          class="w-full rounded-lg border border-[#3c3427] bg-[#120f0b] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-[#6a5439] focus:outline-none"
        />
      </label>

      <label class="space-y-1 md:col-span-2">
        <span class="text-xs text-zinc-400">{{ props.markdownLabel }}</span>
        <textarea
          v-model="markdown"
          :placeholder="props.markdownPlaceholder"
          class="min-h-44 w-full resize-y rounded-lg border border-[#3c3427] bg-[#120f0b] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-[#6a5439] focus:outline-none"
        ></textarea>
      </label>
    </div>

    <div class="mt-4 flex flex-wrap justify-end gap-2">
      <button
        type="button"
        class="rounded-lg border border-[#4b3b28] px-3 py-1.5 text-xs text-zinc-200 transition hover:border-[#6a5439] hover:text-white disabled:opacity-50"
        :disabled="props.isSubmitting"
        @click="handleCreate"
      >
        {{ props.createLabel }}
      </button>
      <button
        type="button"
        class="rounded-lg border border-[#4b3b28] px-3 py-1.5 text-xs text-zinc-200 transition hover:border-[#6a5439] hover:text-white disabled:opacity-50"
        :disabled="props.isSubmitting"
        @click="handleUpdate"
      >
        {{ props.updateLabel }}
      </button>
      <button
        type="button"
        class="rounded-lg border border-[#5a2f2f] px-3 py-1.5 text-xs text-rose-300 transition hover:border-[#7e3d3d] hover:text-rose-200 disabled:opacity-50"
        :disabled="props.isSubmitting"
        @click="handleDelete"
      >
        {{ props.deleteLabel }}
      </button>
    </div>
  </section>
</template>
