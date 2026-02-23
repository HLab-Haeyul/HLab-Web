<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { markdownToHtml } from '@/utils/markdown'

type Props = {
  modelValue: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '마크다운을 입력하세요...',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const overlayRef = ref<HTMLDivElement | null>(null)
const draft = ref(props.modelValue)
const previewHtml = ref('')
const isPreviewMode = ref(false)
const parser = ref<(value: string) => string>((value) => markdownToHtml(value))
const parserName = ref<'marked' | 'fallback'>('fallback')
const importFromUrl = new Function('url', 'return import(url)') as (url: string) => Promise<unknown>

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const withInlineMarkup = (value: string) => {
  let next = escapeHtml(value)

  next = next.replace(/`([^`]+)`/g, '<span class="md-inline-code">`$1`</span>')
  next = next.replace(/\*\*([^*]+)\*\*/g, '<span class="md-inline-strong">**$1**</span>')

  return next
}

const toStyledLineHtml = (line: string) => {
  if (line.length === 0) {
    return '<div class="md-line md-empty"><br /></div>'
  }

  const headingMatch = line.match(/^(#{1,6})\s+(.*)$/)

  if (headingMatch) {
    const hashes = headingMatch[1] ?? ''
    const content = headingMatch[2] ?? ''
    const level = hashes.length

    return [
      `<div class="md-line md-h${level}">`,
      `<span class="md-token">${escapeHtml(hashes)} </span>`,
      `<span class="md-content">${withInlineMarkup(content)}</span>`,
      '</div>',
    ].join('')
  }

  const quoteMatch = line.match(/^(>\s?)(.*)$/)

  if (quoteMatch) {
    const quoteToken = quoteMatch[1] ?? ''
    const quoteContent = quoteMatch[2] ?? ''

    return [
      '<div class="md-line md-quote">',
      `<span class="md-token">${escapeHtml(quoteToken)}</span>`,
      `<span class="md-content">${withInlineMarkup(quoteContent)}</span>`,
      '</div>',
    ].join('')
  }

  const unorderedMatch = line.match(/^([-*+]\s+)(.*)$/)

  if (unorderedMatch) {
    const unorderedToken = unorderedMatch[1] ?? ''
    const unorderedContent = unorderedMatch[2] ?? ''

    return [
      '<div class="md-line md-list">',
      `<span class="md-token">${escapeHtml(unorderedToken)}</span>`,
      `<span class="md-content">${withInlineMarkup(unorderedContent)}</span>`,
      '</div>',
    ].join('')
  }

  const orderedMatch = line.match(/^(\d+\.\s+)(.*)$/)

  if (orderedMatch) {
    const orderedToken = orderedMatch[1] ?? ''
    const orderedContent = orderedMatch[2] ?? ''

    return [
      '<div class="md-line md-list">',
      `<span class="md-token">${escapeHtml(orderedToken)}</span>`,
      `<span class="md-content">${withInlineMarkup(orderedContent)}</span>`,
      '</div>',
    ].join('')
  }

  const fenceMatch = line.match(/^(```.*)$/)

  if (fenceMatch) {
    const fenceToken = fenceMatch[1] ?? ''
    return `<div class="md-line md-fence"><span class="md-token">${escapeHtml(fenceToken)}</span></div>`
  }

  return `<div class="md-line md-p">${withInlineMarkup(line)}</div>`
}

const liveStyledHtml = computed(() =>
  draft.value.split('\n').map((line) => toStyledLineHtml(line)).join(''),
)

const renderPreview = () => {
  previewHtml.value = parser.value(draft.value || '')
}

const toggleMode = () => {
  isPreviewMode.value = !isPreviewMode.value
}

const handleEditorScroll = () => {
  if (!overlayRef.value || !textareaRef.value) {
    return
  }

  overlayRef.value.scrollTop = textareaRef.value.scrollTop
  overlayRef.value.scrollLeft = textareaRef.value.scrollLeft
}

const loadMarkedParser = async () => {
  if (typeof window === 'undefined') {
    return
  }

  try {
    const module = (await importFromUrl('https://esm.sh/marked@12.0.2')) as {
      marked?: { parse: (value: string, options?: Record<string, unknown>) => string }
    }

    if (!module?.marked?.parse) {
      return
    }

    parser.value = (value: string) =>
      String(
        module.marked?.parse(value, {
          breaks: true,
          gfm: true,
        }),
      )
    parserName.value = 'marked'
    renderPreview()
  } catch {
    parserName.value = 'fallback'
  }
}

onMounted(async () => {
  renderPreview()
  await loadMarkedParser()
})

watch(
  () => props.modelValue,
  (value) => {
    if (value === draft.value) {
      return
    }

    draft.value = value
  },
)

watch(
  () => draft.value,
  (value) => {
    emit('update:modelValue', value)
    renderPreview()
  },
  { immediate: true },
)
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center justify-between gap-2">
      <p class="text-[11px] uppercase tracking-[0.1em] text-zinc-500">
        Live Markdown
        <span class="ml-1 text-zinc-600">({{ parserName }})</span>
      </p>
      <button
        type="button"
        class="rounded-md border border-[#3a3731] px-2.5 py-1 text-[11px] text-zinc-300 transition hover:border-[#5f5544] hover:text-white"
        @click="toggleMode"
      >
        {{ isPreviewMode ? '편집 모드' : '미리보기 모드' }}
      </button>
    </div>

    <section class="relative isolate min-h-[22rem] overflow-hidden rounded-xl border border-[#3c3427] bg-[#120f0b]">
      <div
        v-if="isPreviewMode"
        class="markdown-preview min-h-[22rem] px-5 py-4 text-base text-zinc-200"
      >
        <p v-if="!draft.trim()" class="text-zinc-500">{{ props.placeholder }}</p>
        <div v-else v-html="previewHtml"></div>
      </div>

      <template v-else>
        <div
          ref="overlayRef"
          class="pointer-events-none absolute inset-0 overflow-auto px-5 py-4 text-base"
          aria-hidden="true"
        >
          <p v-if="!draft.trim()" class="text-zinc-500">{{ props.placeholder }}</p>
          <div v-else class="md-live" v-html="liveStyledHtml"></div>
        </div>

        <textarea
          ref="textareaRef"
          v-model="draft"
          :placeholder="props.placeholder"
          class="relative z-10 min-h-[22rem] w-full resize-y bg-transparent px-5 py-4 text-base text-transparent caret-zinc-200 placeholder:text-transparent focus:outline-none"
          @scroll="handleEditorScroll"
        ></textarea>
      </template>
    </section>
  </div>
</template>

<style scoped>
.md-live {
  color: #e4e4e7;
}

.md-line {
  white-space: pre-wrap;
  line-height: 1.82;
  color: #e4e4e7;
}

.md-line + .md-line {
  margin-top: 0.3rem;
}

.md-empty {
  min-height: 1.62em;
}

.md-token {
  color: #8f8f95;
}

.md-content {
  color: #e4e4e7;
}

.md-h1 {
  margin-top: 0.55rem;
  font-size: 1.58rem;
  font-weight: 700;
  line-height: 1.34;
}

.md-h2 {
  margin-top: 0.48rem;
  font-size: 1.38rem;
  font-weight: 700;
  line-height: 1.36;
}

.md-h3 {
  margin-top: 0.42rem;
  font-size: 1.22rem;
  font-weight: 650;
  line-height: 1.4;
}

.md-h4,
.md-h5,
.md-h6 {
  margin-top: 0.28rem;
  font-size: 1rem;
  font-weight: 650;
}

.md-quote {
  border-left: 2px solid #52525b;
  padding-left: 0.95rem;
  color: #d4d4d8;
}

.md-list .md-token {
  color: #b5b5bc;
}

.md-inline-code {
  border: 1px solid #3f3f46;
  border-radius: 0.35rem;
  background: #171717;
  padding: 0.02rem 0.3rem;
  color: #f4f4f5;
}

.md-inline-strong {
  color: #fafafa;
  font-weight: 700;
}

.markdown-preview :deep(h1),
.markdown-preview :deep(h2),
.markdown-preview :deep(h3),
.markdown-preview :deep(h4),
.markdown-preview :deep(h5),
.markdown-preview :deep(h6) {
  margin: 1rem 0 0.45rem;
  color: #f4f4f5;
  line-height: 1.25;
}

.markdown-preview :deep(h1) {
  font-size: 1.35rem;
}

.markdown-preview :deep(h2) {
  font-size: 1.2rem;
}

.markdown-preview :deep(h3) {
  font-size: 1.05rem;
}

.markdown-preview :deep(p) {
  margin: 0 0 0.75rem;
  color: #e4e4e7;
}

.markdown-preview :deep(ul),
.markdown-preview :deep(ol) {
  margin: 0 0 0.75rem;
  padding-left: 1.2rem;
}

.markdown-preview :deep(li) {
  margin: 0.2rem 0;
}

.markdown-preview :deep(code) {
  border: 1px solid #3f3f46;
  border-radius: 0.35rem;
  background: #171717;
  padding: 0.08rem 0.35rem;
  font-size: 0.9em;
  color: #f4f4f5;
}

.markdown-preview :deep(pre) {
  margin: 0 0 0.9rem;
  overflow-x: auto;
  border: 1px solid #3f3f46;
  border-radius: 0.65rem;
  background: #0f1012;
  padding: 0.75rem;
}

.markdown-preview :deep(pre code) {
  border: 0;
  padding: 0;
  background: transparent;
  color: #d4d4d8;
}

.markdown-preview :deep(a) {
  color: #d4d4d8;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.markdown-preview :deep(blockquote) {
  margin: 0 0 0.8rem;
  border-left: 2px solid #52525b;
  padding-left: 0.8rem;
  color: #d4d4d8;
}
</style>
