<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'

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

const MIN_EDITOR_HEIGHT_PX = 720

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const overlayRef = ref<HTMLDivElement | null>(null)
const draft = ref(props.modelValue)

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const withInlineMarkup = (value: string) => {
  let next = escapeHtml(value)

  next = next.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<span class="md-link">$1</span>')
  next = next.replace(/`([^`]+)`/g, '<span class="md-inline-code">$1</span>')
  next = next.replace(/\*\*([^*]+)\*\*/g, '<strong class="md-strong">$1</strong>')
  next = next.replace(/\*([^*]+)\*/g, '<em class="md-em">$1</em>')
  next = next.replace(/~~([^~]+)~~/g, '<span class="md-strike">$1</span>')

  return next
}

const renderStyledLines = (value: string) => {
  const lines = value.split('\n')
  const rendered: string[] = []
  let insideFence = false

  lines.forEach((line) => {
    const trimmed = line.trim()
    const fenceMatch = trimmed.match(/^```(.*)$/)

    if (fenceMatch) {
      const fenceLanguage = (fenceMatch[1] ?? '').trim()
      const label = fenceLanguage.length > 0 ? `코드 블록 (${escapeHtml(fenceLanguage)})` : '코드 블록'
      rendered.push(`<div class="md-line md-fence">${label}</div>`)
      insideFence = !insideFence
      return
    }

    if (insideFence) {
      rendered.push(
        line.length > 0
          ? `<div class="md-line md-code">${escapeHtml(line)}</div>`
          : '<div class="md-line md-code md-empty"><br /></div>',
      )
      return
    }

    if (line.length === 0) {
      rendered.push('<div class="md-line md-empty"><br /></div>')
      return
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/)

    if (headingMatch) {
      const level = (headingMatch[1] ?? '#').length
      const content = headingMatch[2] ?? ''
      rendered.push(`<div class="md-line md-h${level}">${withInlineMarkup(content)}</div>`)
      return
    }

    const quoteMatch = line.match(/^>\s?(.*)$/)

    if (quoteMatch) {
      const quoteContent = quoteMatch[1] ?? ''
      rendered.push(`<div class="md-line md-quote">${withInlineMarkup(quoteContent)}</div>`)
      return
    }

    const unorderedMatch = line.match(/^[-*+]\s+(.*)$/)

    if (unorderedMatch) {
      const unorderedContent = unorderedMatch[1] ?? ''
      rendered.push(
        `<div class="md-line md-list"><span class="md-list-bullet">•</span><span>${withInlineMarkup(unorderedContent)}</span></div>`,
      )
      return
    }

    const orderedMatch = line.match(/^(\d+)\.\s+(.*)$/)

    if (orderedMatch) {
      const orderedIndex = orderedMatch[1] ?? '1'
      const orderedContent = orderedMatch[2] ?? ''
      rendered.push(
        `<div class="md-line md-list"><span class="md-list-index">${escapeHtml(orderedIndex)}.</span><span>${withInlineMarkup(orderedContent)}</span></div>`,
      )
      return
    }

    rendered.push(`<div class="md-line md-p">${withInlineMarkup(line)}</div>`)
  })

  return rendered.join('')
}

const liveStyledHtml = computed(() => renderStyledLines(draft.value))

const syncOverlayScroll = () => {
  if (!overlayRef.value || !textareaRef.value) {
    return
  }

  overlayRef.value.scrollTop = textareaRef.value.scrollTop
  overlayRef.value.scrollLeft = textareaRef.value.scrollLeft
}

const syncEditorHeight = () => {
  const textarea = textareaRef.value

  if (!textarea) {
    return
  }

  textarea.style.height = '0px'
  const nextHeight = Math.max(textarea.scrollHeight, MIN_EDITOR_HEIGHT_PX)
  textarea.style.height = `${nextHeight}px`
  syncOverlayScroll()
}

const handleEditorScroll = () => {
  syncOverlayScroll()
}

onMounted(() => {
  syncEditorHeight()
})

watch(
  () => props.modelValue,
  (value) => {
    if (value === draft.value) {
      return
    }

    draft.value = value

    void nextTick(() => {
      syncEditorHeight()
    })
  },
)

watch(
  () => draft.value,
  (value) => {
    emit('update:modelValue', value)

    void nextTick(() => {
      syncEditorHeight()
    })
  },
  { immediate: true },
)
</script>

<template>
  <div class="space-y-2">
    <p class="text-[11px] uppercase tracking-[0.1em] text-zinc-500">Markdown Editor</p>

    <section class="relative isolate overflow-hidden rounded-xl border border-[#3c3427] bg-[#120f0b]">
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
        class="relative z-10 min-h-[45rem] w-full resize-none bg-transparent px-5 py-4 text-base text-transparent caret-zinc-200 placeholder:text-transparent focus:outline-none"
        @scroll="handleEditorScroll"
      ></textarea>
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

.md-list {
  display: flex;
  gap: 0.55rem;
}

.md-list-bullet,
.md-list-index {
  color: #b5b5bc;
  flex: 0 0 auto;
}

.md-code {
  border-left: 2px solid #3f3f46;
  padding-left: 0.9rem;
  color: #c4c4d0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

.md-fence {
  margin-top: 0.2rem;
  border: 1px dashed #3f3f46;
  border-radius: 0.5rem;
  padding: 0.35rem 0.55rem;
  color: #8f8f95;
  font-size: 0.8rem;
  letter-spacing: 0.02em;
}

.md-inline-code {
  border: 1px solid #3f3f46;
  border-radius: 0.35rem;
  background: #171717;
  padding: 0.02rem 0.3rem;
  color: #f4f4f5;
}

.md-strong {
  color: #f8f8f9;
  font-weight: 700;
}

.md-em {
  color: #e9e9ee;
  font-style: italic;
}

.md-link {
  color: #d4d4d8;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.md-strike {
  color: #b7b7bf;
  text-decoration: line-through;
}
</style>
