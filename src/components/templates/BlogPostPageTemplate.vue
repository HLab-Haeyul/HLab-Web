<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBlogEngagement } from '@/composables/useBlogEngagement'
import { useBlogPostContent } from '@/composables/useBlogPostContent'
import { useLocale } from '@/composables/useLocale'
import { getEstimatedViewCount } from '@/utils/blogViews'
import { extractMarkdownHeadings, markdownToHtml } from '@/utils/markdown'
import BlogPostStatusBar from '@/components/molecules/BlogPostStatusBar.vue'
import BlogTocPanel from '@/components/molecules/BlogTocPanel.vue'
import BlogCommentSection from '@/components/organisms/BlogCommentSection.vue'
import BlogPostHeroSection from '@/components/organisms/BlogPostHeroSection.vue'
import BlogPostMediaSection from '@/components/organisms/BlogPostMediaSection.vue'

type Props = {
  forceAdminCommentMode?: boolean
  backPath?: string
  backLabelOverride?: string
  editPostPath?: string
  editPostLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  forceAdminCommentMode: false,
  backPath: undefined,
  backLabelOverride: undefined,
  editPostPath: undefined,
  editPostLabel: '글 수정하기',
})

const { locale, route, blogPath } = useLocale()

const id = computed(() => {
  const raw = route.params.id
  const value = Array.isArray(raw) ? raw[0] : raw

  if (typeof value !== 'string') {
    return ''
  }

  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
})

const {
  post,
  dataSource,
  isLoading: isPostLoading,
  errorMessage,
  reload,
} = useBlogPostContent(locale, id)
const {
  likes,
  liked,
  comments,
  totalCommentCount,
  commentPage,
  totalCommentPages,
  hasPreviousCommentPage,
  hasNextCommentPage,
  dataSource: engagementDataSource,
  isLoading: isEngagementLoading,
  isCommentPageLoading,
  isSubmitting,
  isCommentActionLoading,
  errorMessage: engagementError,
  toggleLike,
  addComment,
  updateComment,
  removeComment,
  goToPreviousCommentPage,
  goToNextCommentPage,
  reload: reloadEngagement,
} = useBlogEngagement(locale, id)

const commentAuthor = ref('')
const commentBody = ref('')

const backLabel = computed(
  () => props.backLabelOverride ?? (locale.value === 'en' ? 'Back to blog' : '블로그 목록으로'),
)
const backPath = computed(() => props.backPath ?? blogPath.value)
const statusLabel = computed(() =>
  dataSource.value === 'api'
    ? locale.value === 'en'
      ? 'API Connected'
      : 'API 연결됨'
    : locale.value === 'en'
      ? 'Fallback Data'
      : 'Fallback 데이터',
)
const engagementStatusLabel = computed(() =>
  engagementDataSource.value === 'api'
    ? locale.value === 'en'
      ? 'Engagement Synced'
      : '인터랙션 동기화됨'
    : locale.value === 'en'
      ? 'Engagement Fallback'
      : '인터랙션 fallback',
)
const loadingLabel = computed(() => (locale.value === 'en' ? 'Loading...' : '불러오는 중...'))
const retryLabel = computed(() => (locale.value === 'en' ? 'Reload' : '다시 불러오기'))
const notFoundTitle = computed(() =>
  locale.value === 'en' ? 'Post not found' : '글을 찾을 수 없습니다',
)
const notFoundDescription = computed(() =>
  locale.value === 'en'
    ? 'This article is missing or unavailable right now.'
    : '요청한 글이 없거나 현재 사용할 수 없습니다.',
)
const likeLabel = computed(() => (locale.value === 'en' ? 'Like' : '좋아요'))
const viewLabel = computed(() => (locale.value === 'en' ? 'Views' : '조회수'))
const commentHeading = computed(() => (locale.value === 'en' ? 'Comments' : '댓글'))
const commentPageLoadingLabel = computed(() =>
  locale.value === 'en' ? 'Loading comments...' : '댓글을 불러오는 중...',
)
const commentPrevLabel = computed(() => (locale.value === 'en' ? 'Previous' : '이전'))
const commentNextLabel = computed(() => (locale.value === 'en' ? 'Next' : '다음'))
const commentPageStatusLabel = computed(() =>
  locale.value === 'en'
    ? `Page ${commentPage.value} / ${totalCommentPages.value}`
    : `${commentPage.value} / ${totalCommentPages.value} 페이지`,
)
const commentEditLabel = computed(() => (locale.value === 'en' ? 'Edit' : '수정'))
const commentDeleteLabel = computed(() => (locale.value === 'en' ? 'Delete' : '삭제'))
const commentSaveLabel = computed(() => (locale.value === 'en' ? 'Save' : '저장'))
const commentCancelLabel = computed(() => (locale.value === 'en' ? 'Cancel' : '취소'))
const commentEditPlaceholder = computed(() =>
  locale.value === 'en' ? 'Edit comment' : '댓글 내용을 수정하세요',
)
const tocHeadingLabel = computed(() => (locale.value === 'en' ? 'On this page' : '이 페이지 목차'))
const mediaHeading = computed(() => (locale.value === 'en' ? 'Media' : '미디어'))
const mediaImageFallbackAlt = computed(() =>
  locale.value === 'en' ? 'Post image' : '게시글 이미지',
)
const mediaVideoFallbackTitle = computed(() =>
  locale.value === 'en' ? 'Post video' : '게시글 동영상',
)
const commentEmptyLabel = computed(() =>
  locale.value === 'en' ? 'No comments yet. Be the first to write one.' : '아직 댓글이 없습니다. 첫 댓글을 남겨보세요.',
)
const commentAuthorPlaceholder = computed(() =>
  locale.value === 'en' ? 'Your name (optional)' : '이름 (선택)',
)
const commentBodyPlaceholder = computed(() =>
  locale.value === 'en' ? 'Write a comment' : '댓글을 작성하세요',
)
const commentSubmitLabel = computed(() =>
  isSubmitting.value
    ? locale.value === 'en'
      ? 'Posting...'
      : '등록 중...'
    : locale.value === 'en'
      ? 'Post Comment'
      : '댓글 등록',
)
const likeAriaLabel = computed(() =>
  liked.value
    ? locale.value === 'en'
      ? 'Unlike this post'
      : '좋아요 취소'
    : locale.value === 'en'
      ? 'Like this post'
      : '좋아요',
)
const isAdminCommentMode = computed(() => {
  const envFlag = (import.meta.env.VITE_BLOG_COMMENT_ADMIN_ENABLED as string | undefined)?.trim()
  const queryValue = Array.isArray(route.query.admin) ? route.query.admin[0] : route.query.admin

  return props.forceAdminCommentMode || envFlag === 'true' || queryValue === '1'
})
const renderedMarkdown = computed(() => (post.value ? markdownToHtml(post.value.markdown) : ''))
const headingTocItems = computed(() =>
  post.value ? extractMarkdownHeadings(post.value.markdown, [1, 2, 3]) : [],
)
const viewCount = computed(() => (post.value ? getEstimatedViewCount(post.value.id) : 0))

const buildHeadingLink = (id: string) => ({
  path: route.path,
  query: route.query,
  hash: `#${id}`,
})

const sanitizeMediaUrl = (raw?: string | null) => {
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

const postImages = computed(() => {
  const currentPost = post.value

  if (!currentPost?.images || currentPost.images.length === 0) {
    return []
  }

  return currentPost.images
    .map((image, index) => {
      const src = sanitizeMediaUrl(image.src)

      if (!src) {
        return null
      }

      return {
        key: `${currentPost.id}-image-${index}`,
        src,
        alt: image.alt?.trim() || `${mediaImageFallbackAlt.value} ${index + 1}`,
        caption: image.caption?.trim() || '',
      }
    })
    .filter((item): item is { key: string; src: string; alt: string; caption: string } => item !== null)
})

const postVideos = computed(() => {
  const currentPost = post.value

  if (!currentPost?.videos || currentPost.videos.length === 0) {
    return []
  }

  return currentPost.videos
    .map((video, index) => {
      const src = sanitizeMediaUrl(video.src)

      if (!src) {
        return null
      }

      const poster = sanitizeMediaUrl(video.poster)
      const title = video.title?.trim() || `${mediaVideoFallbackTitle.value} ${index + 1}`

      return {
        key: `${currentPost.id}-video-${index}`,
        src,
        title,
        poster,
        autoplay: video.autoplay ?? false,
        muted: video.muted ?? false,
        loop: video.loop ?? false,
      }
    })
    .filter(
      (
        item,
      ): item is {
        key: string
        src: string
        title: string
        poster: string | null
        autoplay: boolean
        muted: boolean
        loop: boolean
      } => item !== null,
    )
})

const hasPostMedia = computed(() => postImages.value.length > 0 || postVideos.value.length > 0)

const formatCommentDate = (value: string) => {
  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return parsed.toLocaleString(locale.value === 'en' ? 'en-US' : 'ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const handleReload = () => {
  reload()
  reloadEngagement()
}

const handleSubmitComment = async () => {
  const nextBody = commentBody.value.trim()

  if (!nextBody) {
    return
  }

  await addComment(commentAuthor.value, nextBody)
  commentBody.value = ''
}

const handlePreviousCommentPage = () => {
  goToPreviousCommentPage()
}

const handleNextCommentPage = () => {
  goToNextCommentPage()
}

const handleEditComment = async ({ commentId, body }: { commentId: string; body: string }) => {
  await updateComment(commentId, body)
}

const handleDeleteComment = async ({ commentId }: { commentId: string }) => {
  const confirmLabel =
    locale.value === 'en'
      ? 'Do you want to delete this comment?'
      : '이 댓글을 삭제하시겠습니까?'

  if (typeof window !== 'undefined' && !window.confirm(confirmLabel)) {
    return
  }

  await removeComment(commentId)
}
</script>

<template>
  <div class="relative isolate mx-auto min-h-screen w-full max-w-[1240px] px-4 pb-14 pt-5 sm:px-8 lg:px-12">
    <div
      aria-hidden="true"
      class="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_-4%,rgba(255,255,255,0.08),transparent_30%),radial-gradient(circle_at_82%_108%,rgba(255,255,255,0.07),transparent_34%)] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.88),rgba(0,0,0,0.42))]"
    ></div>

    <main class="space-y-4">
      <div v-if="props.editPostPath" class="flex justify-end">
        <RouterLink
          :to="props.editPostPath"
          class="inline-flex items-center rounded-lg border border-[#4d3b1f] bg-[#2c2418] px-3 py-1.5 text-xs text-amber-200 transition hover:border-[#765a2b] hover:text-amber-100"
        >
          {{ props.editPostLabel }}
        </RouterLink>
      </div>

      <BlogPostStatusBar
        :blog-path="backPath"
        :back-label="backLabel"
        :status-label="statusLabel"
        :engagement-status-label="engagementStatusLabel"
        :is-loading="isPostLoading || isEngagementLoading"
        :loading-label="loadingLabel"
        :retry-label="retryLabel"
        @reload="handleReload"
      />

      <p v-if="errorMessage" class="rounded-xl border border-[#47361b] bg-[#2a1f11] px-3 py-2 text-xs text-amber-300">
        {{ errorMessage }}
      </p>

      <p
        v-if="engagementError"
        class="rounded-xl border border-[#47361b] bg-[#2a1f11] px-3 py-2 text-xs text-amber-300"
      >
        {{ engagementError }}
      </p>

      <div v-if="post" class="xl:grid xl:grid-cols-[minmax(0,1fr)_260px] xl:items-start xl:gap-7">
        <article
          id="post-overview"
          class="rounded-[1.4rem] border border-[#2a2a2a] bg-[#101010cc] p-5 sm:p-7"
        >
          <BlogPostHeroSection
            :post="post"
            :view-label="viewLabel"
            :view-count="viewCount"
            :liked="liked"
            :likes="likes"
            :like-label="likeLabel"
            :like-aria-label="likeAriaLabel"
            :comment-heading="commentHeading"
            :comment-count="totalCommentCount"
            @toggle-like="toggleLike"
          />

          <BlogPostMediaSection
            v-if="hasPostMedia"
            :media-heading="mediaHeading"
            :images="postImages"
            :videos="postVideos"
          />

          <div
            id="post-content"
            class="markdown-body mt-8 text-[16px] leading-[2.05] text-zinc-200 sm:text-[17px]"
            v-html="renderedMarkdown"
          ></div>

          <BlogCommentSection
            :comment-heading="commentHeading"
            :comments="comments"
            :comment-total-count="totalCommentCount"
            :comment-total-pages="totalCommentPages"
            :has-previous-page="hasPreviousCommentPage"
            :has-next-page="hasNextCommentPage"
            :is-comment-page-loading="isCommentPageLoading"
            :comment-page-loading-label="commentPageLoadingLabel"
            :comment-page-status-label="commentPageStatusLabel"
            :comment-prev-label="commentPrevLabel"
            :comment-next-label="commentNextLabel"
            :is-admin-mode="isAdminCommentMode"
            :is-comment-action-loading="isCommentActionLoading"
            :comment-edit-label="commentEditLabel"
            :comment-delete-label="commentDeleteLabel"
            :comment-save-label="commentSaveLabel"
            :comment-cancel-label="commentCancelLabel"
            :comment-edit-placeholder="commentEditPlaceholder"
            :comment-author="commentAuthor"
            :comment-body="commentBody"
            :comment-author-placeholder="commentAuthorPlaceholder"
            :comment-body-placeholder="commentBodyPlaceholder"
            :comment-submit-label="commentSubmitLabel"
            :is-submitting="isSubmitting"
            :comment-empty-label="commentEmptyLabel"
            :format-comment-date="formatCommentDate"
            @update:comment-author="commentAuthor = $event"
            @update:comment-body="commentBody = $event"
            @submit="handleSubmitComment"
            @go-prev-page="handlePreviousCommentPage"
            @go-next-page="handleNextCommentPage"
            @edit-comment="handleEditComment"
            @delete-comment="handleDeleteComment"
          />
        </article>

        <aside v-if="headingTocItems.length > 0" class="hidden xl:block xl:sticky xl:top-24">
          <BlogTocPanel
            :toc-heading-label="tocHeadingLabel"
            :items="headingTocItems"
            :build-heading-link="buildHeadingLink"
          />
        </aside>
      </div>

      <section
        v-else
        class="rounded-[1.4rem] border border-[#2a2a2a] bg-[#101010cc] p-8 text-center sm:p-10"
      >
        <h1 class="text-2xl font-semibold text-zinc-100">{{ notFoundTitle }}</h1>
        <p class="mt-2 text-sm text-zinc-400">{{ notFoundDescription }}</p>
      </section>
    </main>
  </div>
</template>

<style scoped>
.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4),
.markdown-body :deep(h5),
.markdown-body :deep(h6) {
  scroll-margin-top: 6.5rem;
  margin: 1.6rem 0 0.75rem;
  color: #f4f4f5;
  line-height: 1.34;
}

.markdown-body :deep(h1) {
  font-size: 1.75rem;
}

.markdown-body :deep(h2) {
  font-size: 1.48rem;
}

.markdown-body :deep(h3) {
  font-size: 1.26rem;
}

.markdown-body :deep(p) {
  margin: 0 0 1.25rem;
  color: #e4e4e7;
  line-height: 1.95;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin: 0 0 1.2rem;
  padding-left: 1.45rem;
  line-height: 1.88;
}

.markdown-body :deep(li) {
  margin: 0.42rem 0;
}

.markdown-body :deep(a) {
  color: #d4d4d8;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.markdown-body :deep(code) {
  border: 1px solid #3f3f46;
  border-radius: 0.35rem;
  background: #171717;
  padding: 0.08rem 0.35rem;
  font-size: 0.9em;
  color: #f4f4f5;
}

.markdown-body :deep(pre) {
  position: relative;
  margin: 0 0 1.2rem;
  overflow-x: auto;
  border: 1px solid #3f3f46;
  border-radius: 0.8rem;
  background: #0f1012;
  padding: 1rem;
}

.markdown-body :deep(pre code) {
  border: 0;
  padding: 0;
  background: transparent;
  color: #d4d4d8;
}

.markdown-body :deep(pre[data-language]) {
  padding-top: 1.8rem;
}

.markdown-body :deep(pre[data-language]::before) {
  content: attr(data-language);
  position: absolute;
  left: 0.7rem;
  top: 0.45rem;
  border: 1px solid #3f3f46;
  border-radius: 0.35rem;
  background: #1a1b1e;
  padding: 0.1rem 0.38rem;
  font-size: 0.66rem;
  line-height: 1;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #a1a1aa;
}

.markdown-body :deep(.code-token.keyword) {
  color: #8b9dff;
}

.markdown-body :deep(.code-token.string) {
  color: #9ece6a;
}

.markdown-body :deep(.code-token.comment) {
  color: #6b7280;
  font-style: italic;
}

.markdown-body :deep(blockquote) {
  margin: 0 0 1.2rem;
  border-left: 3px solid #52525b;
  padding-left: 1rem;
  color: #d4d4d8;
  line-height: 1.9;
}
</style>
