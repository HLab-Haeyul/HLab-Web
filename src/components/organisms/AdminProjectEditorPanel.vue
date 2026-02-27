<script setup lang="ts">
import { computed } from 'vue'
import MarkdownLiveEditor from '@/components/molecules/MarkdownLiveEditor.vue'
import type {
  AdminProjectEditorPanel,
  AdminProjectRecord,
  CollaborationLink,
} from '@/types/adminProject'

type Props = {
  selectedProject: AdminProjectRecord | null
  renderedTroubleshooting: string
}

const props = defineProps<Props>()

const activeEditorPanel = defineModel<AdminProjectEditorPanel>('activeEditorPanel', { required: true })
const title = defineModel<string>('title', { required: true })
const summary = defineModel<string>('summary', { required: true })
const impact = defineModel<string>('impact', { required: true })
const teamRole = defineModel<string>('teamRole', { required: true })
const imageSrc = defineModel<string>('imageSrc', { required: true })
const imageAlt = defineModel<string>('imageAlt', { required: true })
const troubleshooting = defineModel<string>('troubleshooting', { required: true })
const collaborationSiteName = defineModel<string>('collaborationSiteName', { required: true })
const collaborationSiteUrl = defineModel<string>('collaborationSiteUrl', { required: true })
const collaborationLinks = defineModel<CollaborationLink[]>('collaborationLinks', { required: true })

const emit = defineEmits<{
  save: []
  'add-collaboration-link': []
  'remove-collaboration-link': [index: number]
  'select-project-image': [event: Event]
}>()

const previewImageAlt = computed(() => imageAlt.value || `${title.value || '프로젝트'} 이미지`)

const setPanel = (panel: AdminProjectEditorPanel) => {
  activeEditorPanel.value = panel
}
</script>

<template>
  <section
    v-if="props.selectedProject"
    class="rounded-[1.2rem] border border-[#2a2a2a] bg-[#121212dd] p-4 sm:p-5"
  >
    <h2 class="text-base font-semibold text-zinc-100 sm:text-lg">선택 프로젝트 상세 편집</h2>
    <p class="mt-1 text-xs text-zinc-500">기본은 조회 화면이며, 버튼을 눌러 편집 모드로 전환합니다.</p>

    <div class="mt-4 flex flex-wrap gap-2">
      <button
        type="button"
        class="inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-medium transition"
        :class="
          activeEditorPanel === null
            ? 'border-blue-500 bg-blue-600 text-white'
            : 'border-[#3a3731] text-zinc-200 hover:border-[#5f5544] hover:text-white'
        "
        @click="setPanel(null)"
      >
        전체 보기
      </button>
      <button
        type="button"
        class="inline-flex items-center rounded-md border border-blue-500 bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:border-blue-400 hover:bg-blue-500"
        @click="setPanel('troubleshooting')"
      >
        트러블슈팅 작성하기
      </button>
      <button
        type="button"
        class="inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-medium transition"
        :class="
          activeEditorPanel === 'settings'
            ? 'border-blue-500 bg-blue-600 text-white'
            : 'border-[#3a3731] text-zinc-200 hover:border-[#5f5544] hover:text-white'
        "
        @click="setPanel('settings')"
      >
        프로젝트 설정
      </button>
    </div>

    <div v-if="activeEditorPanel === null" class="mt-4 space-y-4">
      <article class="rounded-xl border border-[#2f2f2f] bg-[#111111] p-4">
        <h3 class="text-sm font-semibold text-zinc-100">프로젝트 정보</h3>
        <p class="mt-3 text-xs text-zinc-500">제목</p>
        <p class="mt-1 text-sm text-zinc-100">{{ props.selectedProject.title }}</p>
        <p class="mt-3 text-xs text-zinc-500">요약</p>
        <p class="mt-1 text-sm text-zinc-300">{{ props.selectedProject.summary }}</p>
        <p class="mt-3 text-xs text-zinc-500">성과</p>
        <p class="mt-1 text-sm text-zinc-300">{{ props.selectedProject.impact }}</p>
        <p class="mt-3 text-xs text-zinc-500">팀에서 역할</p>
        <p class="mt-1 text-sm text-zinc-300">{{ props.selectedProject.teamRole || '미입력' }}</p>

        <div v-if="props.selectedProject.collaborationLinks.length > 0" class="mt-4 flex flex-wrap gap-2">
          <a
            v-for="(link, linkIndex) in props.selectedProject.collaborationLinks"
            :key="`read-link-${link.name}-${link.url}-${linkIndex}`"
            :href="link.url"
            target="_blank"
            rel="noreferrer"
            class="inline-flex items-center rounded-md border border-[#3a3731] px-3 py-1.5 text-xs text-zinc-200 transition hover:border-[#5f5544] hover:text-white"
          >
            {{ link.name }} 열기
          </a>
        </div>
      </article>

      <article class="rounded-xl border border-[#2f2f2f] bg-[#111111] p-4">
        <h3 class="text-sm font-semibold text-zinc-100">트러블슈팅 전체 보기</h3>
        <div
          v-if="props.renderedTroubleshooting"
          class="markdown-body mt-3 text-sm leading-7 text-zinc-200"
          v-html="props.renderedTroubleshooting"
        ></div>
        <p v-else class="mt-3 text-xs text-zinc-500">아직 작성된 트러블슈팅 글이 없습니다.</p>
      </article>
    </div>

    <div
      v-else-if="activeEditorPanel === 'settings'"
      class="mt-4 rounded-2xl border border-[#2f2f2f] bg-[#0f0f10] p-4 sm:p-5"
    >
      <header class="flex flex-col gap-2 border-b border-[#272727] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-[11px] uppercase tracking-[0.08em] text-zinc-500">프로젝트 설정</p>
          <h3 class="mt-1 text-lg font-semibold text-zinc-100">프로젝트 설정</h3>
          <p class="mt-1 text-xs text-zinc-400">일반 설정 페이지처럼 항목별로 나눠서 수정할 수 있습니다.</p>
        </div>
        <button
          type="button"
          class="inline-flex w-fit items-center rounded-md border border-blue-500 bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:border-blue-400 hover:bg-blue-500"
          @click="emit('save')"
        >
          변경사항 저장
        </button>
      </header>

      <div class="mt-4 grid gap-4 xl:grid-cols-[210px_minmax(0,1fr)]">
        <aside class="rounded-xl border border-[#262626] bg-[#141414] p-3">
          <p class="text-[11px] uppercase tracking-[0.08em] text-zinc-500">설정 메뉴</p>
          <nav class="mt-2 space-y-1">
            <a
              href="#project-settings-basic"
              class="block rounded-md border border-transparent px-2.5 py-1.5 text-xs text-zinc-300 transition hover:border-[#3a3731] hover:bg-[#1b1b1b] hover:text-white"
            >
              기본 정보
            </a>
            <a
              href="#project-settings-role-impact"
              class="block rounded-md border border-transparent px-2.5 py-1.5 text-xs text-zinc-300 transition hover:border-[#3a3731] hover:bg-[#1b1b1b] hover:text-white"
            >
              역할 / 성과
            </a>
            <a
              href="#project-settings-links"
              class="block rounded-md border border-transparent px-2.5 py-1.5 text-xs text-zinc-300 transition hover:border-[#3a3731] hover:bg-[#1b1b1b] hover:text-white"
            >
              협업 URL
            </a>
            <a
              href="#project-settings-media"
              class="block rounded-md border border-transparent px-2.5 py-1.5 text-xs text-zinc-300 transition hover:border-[#3a3731] hover:bg-[#1b1b1b] hover:text-white"
            >
              이미지
            </a>
          </nav>
        </aside>

        <div class="space-y-4">
          <section id="project-settings-basic" class="rounded-xl border border-[#272727] bg-[#141415] p-4">
            <h4 class="text-sm font-semibold text-zinc-100">기본 정보</h4>
            <p class="mt-1 text-xs text-zinc-500">프로젝트를 대표하는 핵심 정보를 입력합니다.</p>
            <div class="mt-3 grid gap-3 md:grid-cols-2">
              <label class="space-y-1 text-xs text-zinc-400">
                <span>제목 *</span>
                <input
                  v-model="title"
                  type="text"
                  class="w-full rounded-lg border border-[#2f2f2f] bg-[#171717] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-[#5a5a5a] focus:outline-none"
                  placeholder="프로젝트 제목"
                />
              </label>
              <label class="space-y-1 text-xs text-zinc-400">
                <span>요약 *</span>
                <input
                  v-model="summary"
                  type="text"
                  class="w-full rounded-lg border border-[#2f2f2f] bg-[#171717] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-[#5a5a5a] focus:outline-none"
                  placeholder="프로젝트 요약"
                />
              </label>
            </div>
          </section>

          <section id="project-settings-role-impact" class="rounded-xl border border-[#272727] bg-[#141415] p-4">
            <h4 class="text-sm font-semibold text-zinc-100">역할 / 성과</h4>
            <p class="mt-1 text-xs text-zinc-500">팀 내 역할과 임팩트를 입력합니다.</p>
            <div class="mt-3 grid gap-3">
              <label class="space-y-1 text-xs text-zinc-400">
                <span>임팩트 *</span>
                <input
                  v-model="impact"
                  type="text"
                  class="w-full rounded-lg border border-[#2f2f2f] bg-[#171717] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-[#5a5a5a] focus:outline-none"
                  placeholder="성과/지표"
                />
              </label>
              <label class="space-y-1 text-xs text-zinc-400">
                <span>팀에서 역할</span>
                <input
                  v-model="teamRole"
                  type="text"
                  class="w-full rounded-lg border border-[#2f2f2f] bg-[#171717] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-[#5a5a5a] focus:outline-none"
                  placeholder="예: 백엔드 리드, 프론트엔드 개발, PM"
                />
              </label>
            </div>
          </section>

          <section id="project-settings-links" class="rounded-xl border border-[#272727] bg-[#141415] p-4">
            <h4 class="text-sm font-semibold text-zinc-100">협업 URL</h4>
            <p class="mt-1 text-xs text-zinc-500">협업 도구 링크를 사이트 이름과 함께 관리합니다.</p>
            <div class="mt-3 grid gap-2">
              <input
                v-model="collaborationSiteName"
                type="text"
                class="w-full rounded-lg border border-[#2f2f2f] bg-[#171717] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-[#5a5a5a] focus:outline-none"
                placeholder="사이트 이름 (예: Github)"
              />
              <input
                v-model="collaborationSiteUrl"
                type="url"
                class="w-full rounded-lg border border-[#2f2f2f] bg-[#171717] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-[#5a5a5a] focus:outline-none"
                placeholder="사이트 주소 (https://...)"
              />
              <button
                type="button"
                class="inline-flex w-fit items-center rounded-md border border-blue-500 bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:border-blue-400 hover:bg-blue-500"
                @click="emit('add-collaboration-link')"
              >
                협업 URL 추가
              </button>
            </div>

            <div v-if="collaborationLinks.length > 0" class="mt-3 space-y-2">
              <article
                v-for="(link, linkIndex) in collaborationLinks"
                :key="`${link.name}-${link.url}-${linkIndex}`"
                class="rounded-lg border border-[#2f2f2f] bg-[#171717] px-3 py-2"
              >
                <p class="text-xs font-semibold text-zinc-200">{{ link.name }}</p>
                <p class="mt-1 break-all text-[11px] text-zinc-400">{{ link.url }}</p>
                <button
                  type="button"
                  class="mt-2 rounded-md border border-[#7e3d3d] bg-[#2a1414] px-2 py-1 text-[11px] text-rose-300 transition hover:border-[#a34a4a] hover:bg-[#341818] hover:text-rose-200"
                  @click="emit('remove-collaboration-link', linkIndex)"
                >
                  삭제
                </button>
              </article>
            </div>
            <p v-else class="mt-2 text-[11px] text-zinc-500">저장된 협업 URL이 없습니다.</p>
          </section>

          <section id="project-settings-media" class="rounded-xl border border-[#272727] bg-[#141415] p-4">
            <h4 class="text-sm font-semibold text-zinc-100">이미지</h4>
            <p class="mt-1 text-xs text-zinc-500">프로젝트 대표 이미지를 업로드합니다.</p>
            <div class="mt-3 space-y-2">
              <input
                type="file"
                accept="image/*"
                class="block w-full rounded-lg border border-[#2f2f2f] bg-[#171717] px-3 py-2 text-sm text-zinc-200 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-700 file:px-2 file:py-1 file:text-xs file:text-zinc-100"
                @change="emit('select-project-image', $event)"
              />
              <p class="text-[11px] text-zinc-500">로컬 이미지 파일을 선택하면 즉시 미리보기에 반영됩니다.</p>
            </div>
          </section>
        </div>
      </div>
    </div>

    <div v-else class="mt-4 space-y-1">
      <span class="text-xs text-zinc-400">트러블슈팅 글 쓰기</span>
      <MarkdownLiveEditor
        v-model="troubleshooting"
        placeholder="프로젝트 트러블슈팅 내용을 작성하세요."
      />
    </div>

    <div v-if="imageSrc" class="mt-4 w-full max-w-md overflow-hidden rounded-lg border border-[#2f2f2f] bg-[#161616]">
      <img :src="imageSrc" :alt="previewImageAlt" class="h-36 w-full object-cover" />
    </div>

    <div class="mt-4 flex flex-wrap gap-2">
      <button
        v-if="activeEditorPanel !== 'settings'"
        type="button"
        class="inline-flex items-center rounded-md border border-blue-500 bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:border-blue-400 hover:bg-blue-500"
        @click="emit('save')"
      >
        프로젝트 저장
      </button>
      <a
        v-for="(link, linkIndex) in props.selectedProject.collaborationLinks"
        :key="`open-link-${link.name}-${link.url}-${linkIndex}`"
        :href="link.url"
        target="_blank"
        rel="noreferrer"
        class="inline-flex items-center rounded-md border border-[#3a3731] px-3 py-1.5 text-xs text-zinc-200 transition hover:border-[#5f5544] hover:text-white"
      >
        {{ link.name }} 열기
      </a>
    </div>
  </section>
</template>

<style scoped>
.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4),
.markdown-body :deep(h5),
.markdown-body :deep(h6) {
  margin: 1.2rem 0 0.6rem;
  color: #f4f4f5;
  line-height: 1.35;
}

.markdown-body :deep(p) {
  margin: 0 0 0.95rem;
  color: #e4e4e7;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin: 0 0 1rem;
  padding-left: 1.25rem;
}

.markdown-body :deep(li) {
  margin: 0.35rem 0;
}
</style>
