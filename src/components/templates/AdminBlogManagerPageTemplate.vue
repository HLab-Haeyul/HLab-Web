<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { BLOG_CATEGORY_KEYS, getFallbackBlogPostDetail, type BlogCategoryKey } from '@/data/blog/content'
import { worksByLocale } from '@/data/portfolio/works'
import { useBlogContent } from '@/composables/useBlogContent'
import { useBlogPostContent } from '@/composables/useBlogPostContent'
import { useLocale } from '@/composables/useLocale'
import { fetchBlogPostDetail } from '@/services/blogApi'
import { isBlogApiEnabled } from '@/services/blogApiConfig'
import BlogPostAdminPanel from '@/components/organisms/BlogPostAdminPanel.vue'
import AdminSidebarNav from '@/components/organisms/AdminSidebarNav.vue'

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
  writeMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  writeMode: false,
})

const { locale, basePath, adminPath, adminBlogPath, adminBlogWritePath } = useLocale()
const route = useRoute()
const router = useRouter()
const { copy, isLoading, isManagingPost, errorMessage, reload, createPostWithStatus, updatePost, removePost } =
  useBlogContent(locale)

const panelDescription = computed(() =>
  props.writeMode
    ? '새 게시글을 작성하는 전용 페이지입니다.'
    : isLoading.value
      ? '게시글 목록을 동기화하는 중입니다.'
      : '관리자 경로(/admin/blog)에서 게시글 작성, 수정, 삭제를 수행합니다.',
)

const pageHeading = computed(() => (props.writeMode ? '블로그 글 작성' : '블로그 글 관리'))

const adminCategoryOptions = computed(() =>
  BLOG_CATEGORY_KEYS.map((key) => ({
    key,
    label: copy.value.categories[key].title,
  })),
)

const normalizeProjectKey = (value: string) => value.trim().toLocaleLowerCase().replace(/\s+/g, '')
const normalizeTagToken = (value: string) => value.trim().replace(/^#+/, '').toLocaleLowerCase()

const retrospectiveProjectOptions = computed(() => {
  const uniqueByKey = new Map<string, string>()

  worksByLocale[locale.value].forEach((work) => {
    const key = normalizeProjectKey(work.title)

    if (!key || uniqueByKey.has(key)) {
      return
    }

    uniqueByKey.set(key, work.title)
  })

  return [...uniqueByKey.entries()].map(([key, label]) => ({ key, label }))
})

const retrospectiveProjectKeySet = computed(
  () => new Set(retrospectiveProjectOptions.value.map((option) => option.key)),
)

const resolveRetrospectiveProjectKey = (tags: string[]) => {
  for (const tag of tags) {
    const normalizedTag = normalizeTagToken(tag)

    if (retrospectiveProjectKeySet.value.has(normalizedTag)) {
      return normalizedTag
    }
  }

  return ''
}

const composeAdminTags = (
  value: string,
  category: BlogCategoryKey,
  retrospectiveProjectKey: string,
) => {
  const unique = new Set<string>()

  value
    .split(/[,\s]+/)
    .map((token) => normalizeTagToken(token))
    .filter((token) => token.length > 0)
    .forEach((token) => unique.add(token))

  if (category === 'retrospective') {
    const normalizedProjectKey = normalizeProjectKey(retrospectiveProjectKey)

    if (normalizedProjectKey.length > 0) {
      unique.add(normalizedProjectKey)
    }
  }

  return [...unique]
}

const isBlank = (value: string) => value.trim().length === 0
const buildAutoExcerpt = (draft: BlogPostAdminDraft) => {
  const explicitExcerpt = draft.excerpt.trim()

  if (explicitExcerpt.length > 0) {
    return explicitExcerpt
  }

  const markdownPlainText = draft.markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/[*_~>#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (markdownPlainText.length > 0) {
    return markdownPlainText.slice(0, 140)
  }

  return draft.title.trim()
}

const handleCreatePost = async (draft: BlogPostAdminDraft) => {
  if (isBlank(draft.title) || isBlank(draft.markdown)) {
    if (typeof window !== 'undefined') {
      window.alert('필수 항목을 입력해주세요: title, markdown.')
    }

    return
  }

  if (draft.category === 'retrospective' && isBlank(draft.retrospectiveProjectKey)) {
    if (typeof window !== 'undefined') {
      window.alert('회고 글은 연결 프로젝트를 선택해주세요.')
    }

    return
  }

  const nextTags = composeAdminTags(draft.tags, draft.category, draft.retrospectiveProjectKey)

  const result = await createPostWithStatus({
    title: draft.title.trim(),
    excerpt: buildAutoExcerpt(draft),
    category: draft.category,
    tags: nextTags,
    markdown: draft.markdown.trim(),
  })

  if (typeof window === 'undefined') {
    return
  }

  if (result.source === 'fallback' && result.ok) {
    window.alert('API가 비활성화되어 로컬 데이터에 임시 저장했습니다.')

    if (props.writeMode) {
      await router.push(adminBlogPath.value)
    }

    return
  }

  if (result.ok && result.status === 200) {
    window.alert('게시글 작성이 성공했습니다. (200)')

    if (props.writeMode) {
      await router.push(adminBlogPath.value)
    }

    return
  }

  window.alert(`게시글 작성에 실패했습니다. (status: ${result.status ?? 'unknown'})`)
}

const handleUpdatePost = async (draft: BlogPostAdminDraft) => {
  const id = draft.id.trim()

  if (!id) {
    if (typeof window !== 'undefined') {
      window.alert('게시글 ID가 필요합니다.')
    }

    return
  }

  if (draft.category === 'retrospective' && isBlank(draft.retrospectiveProjectKey)) {
    if (typeof window !== 'undefined') {
      window.alert('회고 글은 연결 프로젝트를 선택해주세요.')
    }

    return
  }

  const nextTags = composeAdminTags(draft.tags, draft.category, draft.retrospectiveProjectKey)
  const shouldUpdateTags =
    draft.tags.trim().length > 0 ||
    (draft.category === 'retrospective' && draft.retrospectiveProjectKey.trim().length > 0)

  const payload = {
    title: draft.title.trim() || undefined,
    tags: shouldUpdateTags ? nextTags : undefined,
    markdown: draft.markdown.trim() || undefined,
  }

  const hasAtLeastOneField = Object.values(payload).some((value) => typeof value !== 'undefined')

  if (!hasAtLeastOneField) {
    if (typeof window !== 'undefined') {
      window.alert('수정할 항목을 입력해주세요.')
    }

    return
  }

  await updatePost(id, payload)
}

const handleDeletePost = async ({ id }: { id: string }) => {
  const targetId = id.trim()

  if (!targetId) {
    return
  }

  const confirmLabel = `게시글 \"${targetId}\" 을(를) 삭제하시겠습니까?`

  if (typeof window !== 'undefined' && !window.confirm(confirmLabel)) {
    return
  }

  await removePost(targetId)
}

const composerSectionId = 'admin-blog-compose'

const editQueryId = computed(() => {
  const candidate = Array.isArray(route.query.edit) ? route.query.edit[0] : route.query.edit

  if (typeof candidate !== 'string') {
    return null
  }

  const trimmed = candidate.trim()
  return trimmed.length > 0 ? trimmed : null
})

const editTargetPostId = computed(() => editQueryId.value ?? '')
const {
  post: editTargetPostDetail,
  isLoading: isEditTargetPostLoading,
  errorMessage: editTargetPostErrorMessage,
} = useBlogPostContent(locale, editTargetPostId)

const editTargetPost = computed(() => {
  if (!editQueryId.value) {
    return null
  }

  return copy.value.posts.find((post) => post.id === editQueryId.value) ?? null
})

const isEditComposerMode = computed(() => Boolean(editQueryId.value))
const showComposerSection = computed(() => props.writeMode || isEditComposerMode.value)

const emptyDraft = (): BlogPostAdminDraft => ({
  id: '',
  title: '',
  excerpt: '',
  category: (BLOG_CATEGORY_KEYS[0] ?? 'tech') as BlogCategoryKey,
  tags: '',
  retrospectiveProjectKey: '',
  publishedAt: '',
  readTime: '',
  heroTag: '',
  authorName: '',
  markdown: '',
})

const normalizeTagInput = (tags: string[]) =>
  tags
    .map((tag) => tag.replace(/^#+/, '').trim())
    .filter((tag) => tag.length > 0)
    .join(', ')

const composerSeedDraft = computed<BlogPostAdminDraft>(() => {
  if (!isEditComposerMode.value) {
    return emptyDraft()
  }

  const detail = editTargetPostDetail.value
  const listPost = editTargetPost.value

  if (!detail && !listPost) {
    return {
      ...emptyDraft(),
      id: editQueryId.value ?? '',
    }
  }

  return {
    id: detail?.id ?? listPost?.id ?? editQueryId.value ?? '',
    title: detail?.title ?? listPost?.title ?? '',
    excerpt: detail?.excerpt ?? listPost?.excerpt ?? '',
    category: detail?.category ?? listPost?.category ?? ((BLOG_CATEGORY_KEYS[0] ?? 'tech') as BlogCategoryKey),
    tags: normalizeTagInput(detail?.tags ?? listPost?.tags ?? []),
    retrospectiveProjectKey: resolveRetrospectiveProjectKey(detail?.tags ?? listPost?.tags ?? []),
    publishedAt: detail?.publishedAt ?? listPost?.publishedAt ?? '',
    readTime: detail?.readTime ?? listPost?.readTime ?? '',
    heroTag: detail?.heroTag ?? '',
    authorName: detail?.authorName ?? '',
    markdown: detail?.markdown ?? '',
  }
})

const composerSeedKey = computed(() =>
  isEditComposerMode.value
    ? `edit:${editQueryId.value}:${editTargetPostDetail.value?.id ?? 'loading'}:${editTargetPostDetail.value?.markdown.length ?? 0}`
    : 'create:new',
)

const postThumbnailById = ref<Record<string, string>>({})
let thumbnailLoadToken = 0

const sanitizeImageUrl = (raw?: string | null) => {
  if (typeof raw !== 'string') {
    return null
  }

  const value = raw.trim()

  if (!value) {
    return null
  }

  if (value.startsWith('/')) {
    return value
  }

  try {
    const parsed = new URL(value)

    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString()
    }
  } catch {
    return null
  }

  return null
}

const resolveFallbackThumbnail = (postId: string) => {
  const detail = getFallbackBlogPostDetail(locale.value, postId)

  if (!detail?.images || detail.images.length === 0) {
    return null
  }

  for (const image of detail.images) {
    const src = sanitizeImageUrl(image.src)

    if (src) {
      return src
    }
  }

  return null
}

const loadPostThumbnails = async () => {
  const requestToken = ++thumbnailLoadToken
  const postIds = copy.value.posts.map((post) => post.id)
  const nextThumbnailById: Record<string, string> = {}

  postIds.forEach((postId) => {
    const fallbackThumbnail = resolveFallbackThumbnail(postId)

    if (fallbackThumbnail) {
      nextThumbnailById[postId] = fallbackThumbnail
    }
  })

  if (isBlogApiEnabled() && postIds.length > 0) {
    const thumbnailResults = await Promise.all(
      postIds.map(async (postId) => {
        try {
          const detail = await fetchBlogPostDetail(locale.value, postId)

          if (!detail?.images || detail.images.length === 0) {
            return [postId, null] as const
          }

          for (const image of detail.images) {
            const src = sanitizeImageUrl(image.src)

            if (src) {
              return [postId, src] as const
            }
          }

          return [postId, null] as const
        } catch {
          return [postId, null] as const
        }
      }),
    )

    if (requestToken !== thumbnailLoadToken) {
      return
    }

    thumbnailResults.forEach(([postId, thumbnailSrc]) => {
      if (thumbnailSrc) {
        nextThumbnailById[postId] = thumbnailSrc
      }
    })
  }

  if (requestToken !== thumbnailLoadToken) {
    return
  }

  postThumbnailById.value = nextThumbnailById
}

watch(
  [() => locale.value, () => copy.value.posts.map((post) => post.id).join('|')],
  () => {
    void loadPostThumbnails()
  },
  { immediate: true },
)

const openPostPath = (id: string) => `${adminBlogPath.value}/${id}`
const categoryTitle = (category: BlogCategoryKey) => copy.value.categories[category].title
</script>

<template>
  <div class="relative isolate mx-auto min-h-screen w-full max-w-[1220px] px-4 pb-14 pt-5 sm:px-8 lg:px-12">
    <div
      aria-hidden="true"
      class="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_14%_-6%,rgba(245,158,11,0.16),transparent_34%),radial-gradient(circle_at_85%_115%,rgba(59,130,246,0.12),transparent_36%)] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.92),rgba(0,0,0,0.4))]"
    ></div>

    <main class="grid gap-5 xl:grid-cols-[230px_minmax(0,1fr)] xl:items-start">
      <div class="xl:sticky xl:top-24">
        <AdminSidebarNav />
      </div>

      <div class="space-y-5">
        <section class="rounded-[1.6rem] border border-[#2b2a28] bg-[#101010d6] p-5 sm:p-7">
          <p class="text-[11px] uppercase tracking-[0.12em] text-amber-400">
            {{ props.writeMode ? 'ADMIN / BLOG WRITE' : 'ADMIN / BLOG' }}
          </p>
          <h1 class="mt-2 text-2xl font-semibold text-zinc-100 sm:text-3xl">{{ pageHeading }}</h1>
          <p class="mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">{{ panelDescription }}</p>

          <div class="mt-4 flex flex-wrap gap-2">
            <RouterLink
              v-if="!props.writeMode"
              :to="adminBlogWritePath"
              class="inline-flex items-center rounded-lg border border-[#5f5544] bg-[#211b12] px-3 py-1.5 text-xs text-amber-200 transition hover:border-[#8f784d] hover:text-amber-100"
            >
              글 작성하기
            </RouterLink>
            <RouterLink
              v-else
              :to="adminBlogPath"
              class="inline-flex items-center rounded-lg border border-[#3a3731] px-3 py-1.5 text-xs text-zinc-200 transition hover:border-[#5f5544] hover:text-white"
            >
              글 관리로
            </RouterLink>
            <RouterLink
              :to="adminPath"
              class="inline-flex items-center rounded-lg border border-[#3a3731] px-3 py-1.5 text-xs text-zinc-200 transition hover:border-[#5f5544] hover:text-white"
            >
              관리자 메인
            </RouterLink>
            <RouterLink
              :to="basePath"
              class="inline-flex items-center rounded-lg border border-[#3a3731] px-3 py-1.5 text-xs text-zinc-200 transition hover:border-[#5f5544] hover:text-white"
            >
              메인으로
            </RouterLink>
            <button
              type="button"
              class="inline-flex items-center rounded-lg border border-[#3a3731] px-3 py-1.5 text-xs text-zinc-200 transition hover:border-[#5f5544] hover:text-white disabled:opacity-50"
              :disabled="isLoading || isManagingPost"
              @click="reload"
            >
              새로고침
            </button>
          </div>
        </section>

        <section
          v-if="!props.writeMode"
          id="admin-blog-overview"
          class="rounded-[1.2rem] border border-[#2a2a2a] bg-[#121212dd] p-4 sm:p-5"
        >
          <p class="mt-1 text-xs text-zinc-500">동기화 상태와 현재 게시글 수를 확인합니다.</p>

          <div class="mt-3 grid gap-3 sm:grid-cols-2">
            <article class="rounded-2xl border border-[#2a2a2a] bg-[#111111] p-4">
              <p class="text-xs uppercase tracking-[0.08em] text-zinc-500">게시글 수</p>
              <p class="mt-2 text-xl font-semibold text-zinc-100">{{ copy.posts.length }}</p>
              <p class="mt-1 text-xs text-zinc-400">현재 로케일 기준 목록</p>
            </article>
          </div>

          <p
            v-if="errorMessage"
            class="mt-3 rounded-xl border border-[#47361b] bg-[#2a1f11] px-3 py-2 text-xs text-amber-300"
          >
            {{ errorMessage }}
          </p>
        </section>

        <section
          v-if="showComposerSection"
          :id="composerSectionId"
          :class="
            props.writeMode
              ? 'mx-auto max-w-[1180px]'
              : 'mx-auto max-w-[1180px] rounded-[1.4rem] border border-[#2a2a2a] bg-[#101010cc] p-5 sm:p-7'
          "
        >
          <p v-if="!props.writeMode && isEditComposerMode" class="mb-3 text-xs text-zinc-500">
            수정 모드입니다. 대상 글 ID: <span class="font-mono text-zinc-300">{{ editQueryId }}</span>
          </p>
          <p
            v-if="!props.writeMode && isEditComposerMode && isEditTargetPostLoading"
            class="mb-3 rounded-lg border border-[#2f2f2f] bg-[#141414] px-3 py-2 text-xs text-zinc-400"
          >
            기존 글 본문을 불러오는 중입니다.
          </p>
          <p
            v-if="!props.writeMode && isEditComposerMode && editTargetPostErrorMessage"
            class="mb-3 rounded-lg border border-[#47361b] bg-[#2a1f11] px-3 py-2 text-xs text-amber-300"
          >
            {{ editTargetPostErrorMessage }}
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
            :is-submitting="isManagingPost"
            :category-options="adminCategoryOptions"
            :retrospective-project-options="retrospectiveProjectOptions"
            :show-id-field="false"
            :show-excerpt-field="false"
            :show-author-field="false"
            :show-published-at-field="false"
            :show-read-time-field="false"
            :show-hero-tag-field="false"
            :show-create-button="props.writeMode"
            :show-update-button="!props.writeMode && isEditComposerMode"
            :show-delete-button="!props.writeMode"
            :minimal-boxes="props.writeMode"
            :seed-draft="composerSeedDraft"
            :seed-key="composerSeedKey"
            @create="handleCreatePost"
            @update="handleUpdatePost"
            @delete="handleDeletePost"
          />
        </section>

        <section
          v-if="!props.writeMode"
          id="admin-blog-list"
          class="rounded-[1.2rem] border border-[#2a2a2a] bg-[#121212dd] p-4 sm:p-5"
        >
        <h2 class="text-base font-semibold text-zinc-100 sm:text-lg">섹션 3. 게시글 목록</h2>
        <div class="mt-2 flex flex-wrap items-center justify-between gap-2">
          <p class="text-sm text-zinc-400">기존 글을 선택하거나 카드에서 바로 삭제할 수 있습니다.</p>
          <div class="flex items-center gap-3">
            <p class="text-xs text-zinc-500">박스를 선택하면 댓글 관리 화면으로 이동합니다.</p>
            <RouterLink
              :to="adminBlogWritePath"
              class="inline-flex items-center rounded-md border border-blue-500 bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:border-blue-400 hover:bg-blue-500"
            >
              새 글 작성
            </RouterLink>
          </div>
        </div>

        <div v-if="copy.posts.length > 0" class="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="post in copy.posts"
            :key="post.id"
            class="group rounded-xl border border-[#2d2d2d] bg-[#111111] p-4 transition hover:border-[#5f5544] hover:bg-[#161513]"
          >
            <div
              v-if="postThumbnailById[post.id]"
              class="mb-3 overflow-hidden rounded-lg border border-[#2f2f2f] bg-[#161616]"
            >
              <img
                :src="postThumbnailById[post.id]"
                :alt="`${post.title} 썸네일`"
                class="h-36 w-full object-cover"
                loading="lazy"
              />
            </div>
            <p class="font-mono text-[11px] text-zinc-500">{{ post.id }}</p>
            <h3 class="mt-2 line-clamp-2 text-sm font-semibold text-zinc-100">{{ post.title }}</h3>
            <p class="mt-1 line-clamp-2 text-xs text-zinc-400">{{ post.excerpt }}</p>
            <div class="mt-3 flex items-center justify-between gap-2 text-xs">
              <span class="rounded-full border border-[#343434] px-2 py-0.5 text-zinc-300">
                {{ categoryTitle(post.category) }}
              </span>
              <span class="text-zinc-500">{{ post.publishedAt }}</span>
            </div>
            <div class="mt-3 flex items-center justify-between gap-2">
              <RouterLink
                :to="openPostPath(post.id)"
                class="text-xs text-amber-300 transition hover:text-amber-200"
              >
                댓글 관리 화면으로 이동
              </RouterLink>
              <button
                type="button"
                class="rounded-md border border-[#5a2f2f] px-2.5 py-1 text-[11px] text-rose-300 transition hover:border-[#7e3d3d] hover:text-rose-200 disabled:opacity-50"
                :disabled="isManagingPost"
                @click="handleDeletePost({ id: post.id })"
              >
                글 삭제
              </button>
            </div>
          </article>
        </div>

        <div v-else class="mt-3 rounded-lg border border-[#2a2a2a] bg-[#0f0f0f] px-3 py-4 text-center text-xs text-zinc-500">
          게시글이 없습니다.
        </div>
        </section>
      </div>
    </main>
  </div>
</template>
