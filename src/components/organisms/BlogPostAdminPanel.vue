<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { BlogCategoryKey } from '@/data/blog/types'
import MarkdownLiveEditor from '@/components/molecules/MarkdownLiveEditor.vue'

type AdminCategoryOption = {
  key: BlogCategoryKey
  label: string
}

type AdminRetrospectiveProjectOption = {
  key: string
  label: string
}

type BlogPostAdminDraft = {
  id: string
  title: string
  excerpt: string
  category: BlogCategoryKey
  tags: string
  retrospectiveProjectKey: string
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
  retrospectiveProjectLabel?: string
  retrospectiveProjectPlaceholder?: string
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
  retrospectiveProjectOptions?: AdminRetrospectiveProjectOption[]
  seedDraft?: BlogPostAdminDraft | null
  seedKey?: string
  showIdField?: boolean
  showExcerptField?: boolean
  showAuthorField?: boolean
  showReadTimeField?: boolean
  showPublishedAtField?: boolean
  showRetrospectiveProjectField?: boolean
  showUpdateButton?: boolean
  showHeroTagField?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showIdField: true,
  showExcerptField: true,
  showAuthorField: true,
  showReadTimeField: true,
  showPublishedAtField: true,
  showRetrospectiveProjectField: true,
  showUpdateButton: true,
  showHeroTagField: true,
  retrospectiveProjectLabel: '연결 프로젝트',
  retrospectiveProjectPlaceholder: '프로젝트 선택',
  retrospectiveProjectOptions: () => [],
})

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
const retrospectiveProjectKey = ref('')
const publishedAt = ref('')
const readTime = ref('')
const heroTag = ref('')
const authorName = ref('')
const markdown = ref('')
const tempDraftMessage = ref('')
const tempDraftSavedAt = ref<string | null>(null)

const TEMP_DRAFT_STORAGE_KEY = 'hlab.blog.admin.temp-draft.v1'

type StoredTempDraft = {
  draft: BlogPostAdminDraft
  savedAt: string
}

const buildDraft = (): BlogPostAdminDraft => ({
  id: id.value,
  title: title.value,
  excerpt: excerpt.value,
  category: category.value,
  tags: tags.value,
  retrospectiveProjectKey: retrospectiveProjectKey.value,
  publishedAt: publishedAt.value,
  readTime: readTime.value,
  heroTag: heroTag.value,
  authorName: authorName.value,
  markdown: markdown.value,
})

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const toStringValue = (value: unknown) => (typeof value === 'string' ? value : '')

const parseStoredTempDraft = (value: unknown): StoredTempDraft | null => {
  if (!isRecord(value) || !isRecord(value.draft)) {
    return null
  }

  const draftCandidate = value.draft
  const categoryCandidate = draftCandidate.category
  const category = props.categoryOptions.some((option) => option.key === categoryCandidate)
    ? (categoryCandidate as BlogCategoryKey)
    : defaultCategory

  const draft: BlogPostAdminDraft = {
    id: toStringValue(draftCandidate.id),
    title: toStringValue(draftCandidate.title),
    excerpt: toStringValue(draftCandidate.excerpt),
    category,
    tags: toStringValue(draftCandidate.tags),
    retrospectiveProjectKey: toStringValue(draftCandidate.retrospectiveProjectKey),
    publishedAt: toStringValue(draftCandidate.publishedAt),
    readTime: toStringValue(draftCandidate.readTime),
    heroTag: toStringValue(draftCandidate.heroTag),
    authorName: toStringValue(draftCandidate.authorName),
    markdown: toStringValue(draftCandidate.markdown),
  }

  return {
    draft,
    savedAt: toStringValue(value.savedAt) || new Date().toISOString(),
  }
}

const readStoredTempDraft = (): StoredTempDraft | null => {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = window.localStorage.getItem(TEMP_DRAFT_STORAGE_KEY)

  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as unknown
    return parseStoredTempDraft(parsed)
  } catch {
    return null
  }
}

const writeStoredTempDraft = (payload: StoredTempDraft) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(TEMP_DRAFT_STORAGE_KEY, JSON.stringify(payload))
}

const removeStoredTempDraft = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(TEMP_DRAFT_STORAGE_KEY)
}

const updateTempSavedAt = () => {
  const stored = readStoredTempDraft()
  tempDraftSavedAt.value = stored?.savedAt ?? null
}

const tempSavedAtLabel = computed(() => {
  if (!tempDraftSavedAt.value) {
    return '저장된 임시 글이 없습니다.'
  }

  const date = new Date(tempDraftSavedAt.value)

  if (Number.isNaN(date.getTime())) {
    return `마지막 임시 저장: ${tempDraftSavedAt.value}`
  }

  return `마지막 임시 저장: ${new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)}`
})

const resetForm = () => {
  id.value = ''
  title.value = ''
  excerpt.value = ''
  category.value = defaultCategory
  tags.value = ''
  retrospectiveProjectKey.value = ''
  publishedAt.value = ''
  readTime.value = ''
  heroTag.value = ''
  authorName.value = ''
  markdown.value = ''
}

const applySeedDraft = (seed: BlogPostAdminDraft | null | undefined) => {
  if (!seed) {
    resetForm()
    return
  }

  id.value = seed.id
  title.value = seed.title
  excerpt.value = seed.excerpt
  category.value = seed.category
  tags.value = seed.tags
  retrospectiveProjectKey.value = seed.retrospectiveProjectKey
  publishedAt.value = seed.publishedAt
  readTime.value = seed.readTime
  heroTag.value = seed.heroTag
  authorName.value = seed.authorName
  markdown.value = seed.markdown
}

watch(
  () => props.seedKey,
  () => {
    applySeedDraft(props.seedDraft)
  },
  { immediate: true },
)

watch(category, (nextCategory) => {
  if (nextCategory !== 'retrospective') {
    retrospectiveProjectKey.value = ''
  }
})

onMounted(() => {
  updateTempSavedAt()
})

const handleSaveTempDraft = () => {
  const savedAt = new Date().toISOString()

  writeStoredTempDraft({
    draft: buildDraft(),
    savedAt,
  })

  tempDraftSavedAt.value = savedAt
  tempDraftMessage.value = '현재 작성 내용을 임시 저장했습니다.'
}

const handleLoadTempDraft = () => {
  const stored = readStoredTempDraft()

  if (!stored) {
    tempDraftMessage.value = '불러올 임시 저장 글이 없습니다.'
    return
  }

  applySeedDraft(stored.draft)
  tempDraftSavedAt.value = stored.savedAt
  tempDraftMessage.value = '임시 저장 글을 불러왔습니다.'
}

const handleClearTempDraft = () => {
  removeStoredTempDraft()
  tempDraftSavedAt.value = null
  tempDraftMessage.value = '임시 저장 글을 삭제했습니다.'
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
  <section class="rounded-[1.2rem] border border-[#2a2a2a] bg-[#101010cc] p-4 sm:p-5">
    <div class="flex items-start justify-between gap-3">
      <div>
        <p class="text-[11px] uppercase tracking-[0.11em] text-zinc-500">PUBLISH EDITOR</p>
        <h3 class="mt-1 text-base font-semibold text-zinc-100">{{ props.panelTitle }}</h3>
        <p class="mt-1 text-xs text-zinc-400">{{ props.panelDescription }}</p>
      </div>
      <button
        type="button"
        class="rounded-lg border border-[#313131] px-3 py-1.5 text-xs text-zinc-200 transition hover:border-[#5b5b5b] hover:text-white disabled:opacity-50"
        :disabled="props.isSubmitting"
        @click="resetForm"
      >
        {{ props.resetLabel }}
      </button>
    </div>

    <div class="mt-4 grid gap-3 md:grid-cols-2">
      <label v-if="props.showIdField" class="space-y-1">
        <span class="text-xs text-zinc-400">{{ props.idLabel }}</span>
        <input
          v-model="id"
          type="text"
          class="w-full rounded-lg border border-[#2f2f2f] bg-[#171717] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-[#5a5a5a] focus:outline-none"
        />
      </label>

      <label class="space-y-1">
        <span class="text-xs text-zinc-400">{{ props.categoryLabel }}</span>
        <select
          v-model="category"
          class="w-full rounded-lg border border-[#2f2f2f] bg-[#171717] px-3 py-2 text-sm text-zinc-200 focus:border-[#5a5a5a] focus:outline-none"
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
          class="w-full rounded-lg border border-[#2f2f2f] bg-[#171717] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-[#5a5a5a] focus:outline-none"
        />
      </label>

      <label v-if="props.showExcerptField" class="space-y-1 md:col-span-2">
        <span class="text-xs text-zinc-400">{{ props.excerptLabel }}</span>
        <textarea
          v-model="excerpt"
          class="min-h-20 w-full resize-y rounded-lg border border-[#2f2f2f] bg-[#171717] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-[#5a5a5a] focus:outline-none"
        ></textarea>
      </label>

      <label class="space-y-1">
        <span class="text-xs text-zinc-400">{{ props.tagsLabel }}</span>
        <input
          v-model="tags"
          type="text"
          :placeholder="props.tagsPlaceholder"
          class="w-full rounded-lg border border-[#2f2f2f] bg-[#171717] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-[#5a5a5a] focus:outline-none"
        />
      </label>

      <label
        v-if="props.showRetrospectiveProjectField && category === 'retrospective' && props.retrospectiveProjectOptions.length > 0"
        class="space-y-1"
      >
        <span class="text-xs text-zinc-400">{{ props.retrospectiveProjectLabel }}</span>
        <select
          v-model="retrospectiveProjectKey"
          class="w-full rounded-lg border border-[#2f2f2f] bg-[#171717] px-3 py-2 text-sm text-zinc-200 focus:border-[#5a5a5a] focus:outline-none"
        >
          <option value="">{{ props.retrospectiveProjectPlaceholder }}</option>
          <option
            v-for="option in props.retrospectiveProjectOptions"
            :key="`retrospective-project-${option.key}`"
            :value="option.key"
          >
            {{ option.label }}
          </option>
        </select>
      </label>

      <label v-if="props.showPublishedAtField" class="space-y-1">
        <span class="text-xs text-zinc-400">{{ props.publishedAtLabel }}</span>
        <input
          v-model="publishedAt"
          type="text"
          class="w-full rounded-lg border border-[#2f2f2f] bg-[#171717] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-[#5a5a5a] focus:outline-none"
        />
      </label>

      <label v-if="props.showReadTimeField" class="space-y-1">
        <span class="text-xs text-zinc-400">{{ props.readTimeLabel }}</span>
        <input
          v-model="readTime"
          type="text"
          class="w-full rounded-lg border border-[#2f2f2f] bg-[#171717] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-[#5a5a5a] focus:outline-none"
        />
      </label>

      <label v-if="props.showHeroTagField" class="space-y-1">
        <span class="text-xs text-zinc-400">{{ props.heroTagLabel }}</span>
        <input
          v-model="heroTag"
          type="text"
          class="w-full rounded-lg border border-[#2f2f2f] bg-[#171717] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-[#5a5a5a] focus:outline-none"
        />
      </label>

      <label v-if="props.showAuthorField" class="space-y-1 md:col-span-2">
        <span class="text-xs text-zinc-400">{{ props.authorLabel }}</span>
        <input
          v-model="authorName"
          type="text"
          class="w-full rounded-lg border border-[#2f2f2f] bg-[#171717] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-[#5a5a5a] focus:outline-none"
        />
      </label>

    </div>

    <div class="mt-3 space-y-1">
      <span class="text-xs text-zinc-400">{{ props.markdownLabel }}</span>
      <MarkdownLiveEditor
        v-model="markdown"
        :placeholder="props.markdownPlaceholder"
      />
    </div>

    <div class="mt-4 rounded-lg border border-[#2f2f2f] bg-[#141414] p-3">
      <p class="text-xs font-medium text-zinc-200">임시 저장</p>
      <p class="mt-1 text-[11px] text-zinc-500">작성 중인 글을 임시 저장하고 나중에 다시 불러올 수 있습니다.</p>
      <div class="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          class="rounded-lg border border-[#313131] px-3 py-1.5 text-xs text-zinc-200 transition hover:border-[#5b5b5b] hover:text-white disabled:opacity-50"
          :disabled="props.isSubmitting"
          @click="handleSaveTempDraft"
        >
          임시 저장
        </button>
        <button
          type="button"
          class="rounded-lg border border-[#313131] px-3 py-1.5 text-xs text-zinc-200 transition hover:border-[#5b5b5b] hover:text-white disabled:opacity-50"
          :disabled="props.isSubmitting"
          @click="handleLoadTempDraft"
        >
          불러오기
        </button>
        <button
          type="button"
          class="rounded-lg border border-[#5a2f2f] px-3 py-1.5 text-xs text-rose-300 transition hover:border-[#7e3d3d] hover:text-rose-200 disabled:opacity-50"
          :disabled="props.isSubmitting"
          @click="handleClearTempDraft"
        >
          임시 저장 삭제
        </button>
      </div>
      <p class="mt-2 text-[11px] text-zinc-500">{{ tempSavedAtLabel }}</p>
      <p v-if="tempDraftMessage" class="mt-1 text-[11px] text-zinc-400">{{ tempDraftMessage }}</p>
    </div>

    <div class="mt-4 flex flex-wrap justify-end gap-2">
      <button
        type="button"
        class="rounded-lg border border-[#313131] px-3 py-1.5 text-xs text-zinc-200 transition hover:border-[#5b5b5b] hover:text-white disabled:opacity-50"
        :disabled="props.isSubmitting"
        @click="handleCreate"
      >
        {{ props.createLabel }}
      </button>
      <button
        v-if="props.showUpdateButton"
        type="button"
        class="rounded-lg border border-[#313131] px-3 py-1.5 text-xs text-zinc-200 transition hover:border-[#5b5b5b] hover:text-white disabled:opacity-50"
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
