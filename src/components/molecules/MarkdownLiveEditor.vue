<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

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

type ToastEditorInstance = {
  getMarkdown: () => string
  setMarkdown: (markdown: string, cursorToEnd?: boolean) => void
  destroy: () => void
}

type ToastEditorConstructor = new (options: {
  el: HTMLElement
  initialValue?: string
  placeholder?: string
  initialEditType?: 'markdown' | 'wysiwyg'
  previewStyle?: 'tab' | 'vertical'
  height?: string
  usageStatistics?: boolean
  autofocus?: boolean
  events?: {
    change?: () => void
  }
}) => ToastEditorInstance

type ToastUiGlobal = {
  Editor: ToastEditorConstructor
}

type ToastUiWindow = Window & {
  toastui?: ToastUiGlobal
}

const TOAST_UI_CSS_URL = 'https://uicdn.toast.com/editor/latest/toastui-editor.min.css'
const TOAST_UI_JS_URL = 'https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js'
const TOAST_UI_CSS_ID = 'toast-ui-editor-css'
const TOAST_UI_JS_ID = 'toast-ui-editor-js'

const editorHostRef = ref<HTMLDivElement | null>(null)
let editorInstance: ToastEditorInstance | null = null
let isSyncingFromEditor = false

const loadToastUiAssets = async () => {
  if (typeof window === 'undefined') {
    return
  }

  if (!document.getElementById(TOAST_UI_CSS_ID)) {
    const link = document.createElement('link')
    link.id = TOAST_UI_CSS_ID
    link.rel = 'stylesheet'
    link.href = TOAST_UI_CSS_URL
    document.head.appendChild(link)
  }

  if ((window as ToastUiWindow).toastui?.Editor) {
    return
  }

  const existingScript = document.getElementById(TOAST_UI_JS_ID) as HTMLScriptElement | null

  if (existingScript) {
    await new Promise<void>((resolve, reject) => {
      existingScript.addEventListener('load', () => resolve(), { once: true })
      existingScript.addEventListener('error', () => reject(new Error('Toast UI script load failed')), {
        once: true,
      })
    })
    return
  }

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.id = TOAST_UI_JS_ID
    script.src = TOAST_UI_JS_URL
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Toast UI script load failed'))
    document.head.appendChild(script)
  })
}

const getToastEditorConstructor = () => {
  if (typeof window === 'undefined') {
    return null
  }

  return (window as ToastUiWindow).toastui?.Editor ?? null
}

const handleEditorChange = () => {
  if (!editorInstance) {
    return
  }

  const markdown = editorInstance.getMarkdown()

  if (markdown === props.modelValue) {
    return
  }

  isSyncingFromEditor = true
  emit('update:modelValue', markdown)
  isSyncingFromEditor = false
}

const createEditor = (initialValue: string, placeholder: string) => {
  if (!editorHostRef.value) {
    return
  }

  const EditorCtor = getToastEditorConstructor()

  if (!EditorCtor) {
    return
  }

  editorInstance = new EditorCtor({
    el: editorHostRef.value,
    initialValue,
    placeholder,
    initialEditType: 'markdown',
    previewStyle: 'tab',
    height: '760px',
    usageStatistics: false,
    autofocus: false,
    events: {
      change: handleEditorChange,
    },
  })
}

const destroyEditor = () => {
  if (!editorInstance) {
    return
  }

  editorInstance.destroy()
  editorInstance = null
}

onMounted(async () => {
  await loadToastUiAssets()
  createEditor(props.modelValue, props.placeholder)
})

onBeforeUnmount(() => {
  destroyEditor()
})

watch(
  () => props.modelValue,
  (value) => {
    if (!editorInstance || isSyncingFromEditor) {
      return
    }

    const current = editorInstance.getMarkdown()

    if (current === value) {
      return
    }

    editorInstance.setMarkdown(value, false)
  },
)

watch(
  () => props.placeholder,
  (nextPlaceholder, previousPlaceholder) => {
    if (!editorInstance || nextPlaceholder === previousPlaceholder) {
      return
    }

    const current = editorInstance.getMarkdown()
    destroyEditor()
    createEditor(current, nextPlaceholder)
  },
)
</script>

<template>
  <div class="space-y-2">
    <p class="text-[11px] uppercase tracking-[0.1em] text-zinc-500">Markdown Editor</p>
    <div ref="editorHostRef"></div>
  </div>
</template>

<style scoped>
:deep(.toastui-editor-defaultUI) {
  overflow: hidden;
  border: 1px solid #3c3427;
  border-radius: 0.75rem;
  background: #120f0b;
}

:deep(.toastui-editor-toolbar) {
  border-bottom: 1px solid #332c22;
  background: #15120e;
}

:deep(.toastui-editor-toolbar button) {
  color: #d4d4d8;
}

:deep(.toastui-editor-toolbar button:hover) {
  background: #231d16;
}

:deep(.toastui-editor-md-container),
:deep(.toastui-editor-md-preview),
:deep(.toastui-editor-ww-container) {
  background: #120f0b;
}

:deep(.toastui-editor-md-container .toastui-editor),
:deep(.toastui-editor-md-container .toastui-editor *),
:deep(.toastui-editor-md-container .CodeMirror),
:deep(.toastui-editor-md-container .CodeMirror pre),
:deep(.toastui-editor-md-container .cm-editor),
:deep(.toastui-editor-md-container .cm-content),
:deep(.toastui-editor-md-container .cm-line),
:deep(.toastui-editor-ww-container .ProseMirror),
:deep(.toastui-editor-ww-container .ProseMirror *) {
  color: #e5e7eb !important;
}

:deep(.toastui-editor-md-container .toastui-editor-md-preview-style),
:deep(.toastui-editor-contents) {
  color: #e5e7eb;
  font-size: 16px;
  line-height: 1.8;
}

:deep(.toastui-editor-md-tab-container) {
  border-bottom: 1px solid #332c22;
  background: #15120e;
}
</style>
