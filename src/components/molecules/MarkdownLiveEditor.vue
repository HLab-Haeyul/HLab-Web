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
  minHeight?: string
  theme?: 'dark' | string
  usageStatistics?: boolean
  autofocus?: boolean
  events?: {
    change?: () => void
  }
  hooks?: {
    addImageBlobHook?: (blob: Blob | File, callback: (url: string, text?: string) => void) => boolean | void
  }
}) => ToastEditorInstance

type ToastUiGlobal = {
  Editor: ToastEditorConstructor
}

type ToastUiWindow = Window & {
  toastui?: ToastUiGlobal
}

const TOAST_UI_CSS_URL = 'https://uicdn.toast.com/editor/latest/toastui-editor.min.css'
const TOAST_UI_DARK_CSS_URL = 'https://uicdn.toast.com/editor/latest/theme/toastui-editor-dark.min.css'
const TOAST_UI_JS_URL = 'https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js'
const TOAST_UI_CSS_ID = 'toast-ui-editor-css'
const TOAST_UI_DARK_CSS_ID = 'toast-ui-editor-dark-css'
const TOAST_UI_JS_ID = 'toast-ui-editor-js'
const TOAST_UI_OVERRIDE_STYLE_ID = 'toast-ui-editor-overrides'
const TOAST_UI_OVERRIDE_CSS = `
.toastui-editor-toolbar {
  background: #0d1522 !important;
}

.toastui-editor-md-container,
.toastui-editor-md-container * {
  color: #ffffff !important;
  -webkit-text-fill-color: #ffffff !important;
  text-shadow: none !important;
  opacity: 1 !important;
  filter: none !important;
  caret-color: #ffffff !important;
}

.toastui-editor-ww-container,
.toastui-editor-ww-container * {
  color: #ffffff !important;
  -webkit-text-fill-color: #ffffff !important;
}

.toastui-editor-ww-container .ProseMirror img {
  max-width: 100%;
  height: auto;
}

.toastui-editor-md-container .CodeMirror,
.toastui-editor-md-container .CodeMirror *,
.toastui-editor-md-container .CodeMirror span,
.toastui-editor-md-container .CodeMirror pre,
.toastui-editor-md-container .CodeMirror-line,
.toastui-editor-md-container .CodeMirror-line *,
.toastui-editor-md-container .cm-editor,
.toastui-editor-md-container .cm-content,
.toastui-editor-md-container .cm-line,
.toastui-editor-md-container .cm-line * {
  color: #ffffff !important;
  -webkit-text-fill-color: #ffffff !important;
  text-shadow: none !important;
  opacity: 1 !important;
  filter: none !important;
}

.toastui-editor-md-container .CodeMirror .cm-header,
.toastui-editor-md-container .CodeMirror .cm-formatting-header {
  color: #ffffff !important;
  -webkit-text-fill-color: #ffffff !important;
}

.toastui-editor-md-container .CodeMirror-cursor {
  border-left-color: #ffffff !important;
}

.toastui-editor-md-container .CodeMirror-placeholder {
  color: #9ca3af !important;
  -webkit-text-fill-color: #9ca3af !important;
}
`

const editorHostRef = ref<HTMLDivElement | null>(null)
let editorInstance: ToastEditorInstance | null = null
let isSyncingFromEditor = false
let toastUiCssLoadPromise: Promise<void> | null = null

const waitForStylesheetLoad = (link: HTMLLinkElement) =>
  new Promise<void>((resolve, reject) => {
    if ((link as HTMLLinkElement & { sheet?: CSSStyleSheet | null }).sheet) {
      resolve()
      return
    }

    link.addEventListener('load', () => resolve(), { once: true })
    link.addEventListener('error', () => reject(new Error('Toast UI stylesheet load failed')), {
      once: true,
    })
  })

const loadToastUiAssets = async () => {
  if (typeof window === 'undefined') {
    return
  }

  const existingCssLink = document.getElementById(TOAST_UI_CSS_ID) as HTMLLinkElement | null

  if (!existingCssLink) {
    const link = document.createElement('link')
    link.id = TOAST_UI_CSS_ID
    link.rel = 'stylesheet'
    link.href = TOAST_UI_CSS_URL
    document.head.appendChild(link)

    toastUiCssLoadPromise = waitForStylesheetLoad(link)
    await toastUiCssLoadPromise
  } else if (!toastUiCssLoadPromise) {
    toastUiCssLoadPromise = waitForStylesheetLoad(existingCssLink)
    await toastUiCssLoadPromise
  } else {
    await toastUiCssLoadPromise
  }

  const existingDarkCssLink = document.getElementById(TOAST_UI_DARK_CSS_ID) as HTMLLinkElement | null

  if (!existingDarkCssLink) {
    const darkLink = document.createElement('link')
    darkLink.id = TOAST_UI_DARK_CSS_ID
    darkLink.rel = 'stylesheet'
    darkLink.href = TOAST_UI_DARK_CSS_URL
    document.head.appendChild(darkLink)
    await waitForStylesheetLoad(darkLink)
  } else {
    await waitForStylesheetLoad(existingDarkCssLink)
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

const ensureToastUiOverrideStyle = () => {
  if (typeof window === 'undefined') {
    return
  }

  let style = document.getElementById(TOAST_UI_OVERRIDE_STYLE_ID) as HTMLStyleElement | null

  if (!style) {
    style = document.createElement('style')
    style.id = TOAST_UI_OVERRIDE_STYLE_ID
    document.head.appendChild(style)
  }

  style.textContent = TOAST_UI_OVERRIDE_CSS
}

const getToastEditorConstructor = () => {
  if (typeof window === 'undefined') {
    return null
  }

  return (window as ToastUiWindow).toastui?.Editor ?? null
}

const readBlobAsDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result

      if (typeof result === 'string') {
        resolve(result)
        return
      }

      reject(new Error('이미지 읽기에 실패했습니다.'))
    }
    reader.onerror = () => reject(new Error('이미지 읽기에 실패했습니다.'))
    reader.readAsDataURL(blob)
  })

const handleAddImageBlobHook = (
  blob: Blob | File,
  callback: (url: string, text?: string) => void,
) => {
  void readBlobAsDataUrl(blob)
    .then((imageDataUrl) => {
      const imageAlt =
        blob instanceof File && blob.name.trim().length > 0 ? blob.name : 'pasted-image'

      callback(imageDataUrl, imageAlt)
    })
    .catch(() => {
      if (typeof window !== 'undefined') {
        window.alert('이미지 붙여넣기에 실패했습니다.')
      }
    })

  // Returning false prevents default behavior and keeps this hook as the only insert path.
  return false
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
    initialEditType: 'wysiwyg',
    previewStyle: 'tab',
    height: 'auto',
    minHeight: '760px',
    theme: 'dark',
    usageStatistics: false,
    autofocus: false,
    events: {
      change: handleEditorChange,
    },
    hooks: {
      addImageBlobHook: handleAddImageBlobHook,
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
  ensureToastUiOverrideStyle()
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
  border: 1px solid #223249;
  border-radius: 0.75rem;
  background: #08101b;
}

:deep(.toastui-editor-toolbar) {
  border-bottom: 1px solid #223249;
  background: #0d1522;
}

:deep(.toastui-editor-toolbar button) {
  color: #dce7ff;
}

:deep(.toastui-editor-toolbar button:hover) {
  background: #13203a;
}

:deep(.toastui-editor-md-container),
:deep(.toastui-editor-md-preview),
:deep(.toastui-editor-ww-container) {
  background: #08101b;
}

:deep(.toastui-editor-md-container .CodeMirror),
:deep(.toastui-editor-md-container .CodeMirror-lines),
:deep(.toastui-editor-md-container .CodeMirror span),
:deep(.toastui-editor-md-container .CodeMirror pre),
:deep(.toastui-editor-md-container .CodeMirror-line),
:deep(.toastui-editor-md-container .CodeMirror-line *) {
  color: #ffffff !important;
  -webkit-text-fill-color: #ffffff !important;
  opacity: 1 !important;
}

:deep(.toastui-editor-md-container .CodeMirror span[class^='cm-']),
:deep(.toastui-editor-md-container .CodeMirror span[class*=' cm-']) {
  color: #ffffff !important;
  -webkit-text-fill-color: #ffffff !important;
  opacity: 1 !important;
}

:deep(.toastui-editor-md-container .CodeMirror .cm-header) {
  color: #ffffff !important;
}

:deep(.toastui-editor-md-container .toastui-editor-md-preview-style),
:deep(.toastui-editor-contents) {
  font-size: 16px;
  line-height: 1.8;
}

:deep(.toastui-editor-md-container .CodeMirror-cursor) {
  border-left-color: #ffffff !important;
}

:deep(.toastui-editor-md-container .CodeMirror-placeholder) {
  color: #9ca3af !important;
}

:deep(.toastui-editor-md-tab-container) {
  border-bottom: 1px solid #223249;
  background: #0d1522;
}
</style>
