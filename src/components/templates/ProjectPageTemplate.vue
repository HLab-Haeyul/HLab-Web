<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { BlogPost } from '@/data/blog/content'
import { worksByLocale } from '@/data/portfolio/works'
import { useBlogContent } from '@/composables/useBlogContent'
import { useLocale } from '@/composables/useLocale'

const { locale, blogPath, route } = useLocale()
const { copy: blogCopy } = useBlogContent(locale)

const projects = computed(() => worksByLocale[locale.value])
const selectedProjectIndex = ref(0)
const detailTransitionNonce = ref(0)
const routeProjectIndex = computed(() => {
  const raw = route.query.project
  const value = Array.isArray(raw) ? raw[0] : raw

  if (typeof value !== 'string') {
    return null
  }

  const parsed = Number.parseInt(value, 10)

  if (!Number.isFinite(parsed) || parsed < 0) {
    return null
  }

  return parsed
})

const selectedProject = computed(() => {
  const index = selectedProjectIndex.value

  if (index < 0 || index >= projects.value.length) {
    return null
  }

  return projects.value[index]
})

const projectKeywordMap: Record<string, string[]> = {
  hlab: ['hlab', 'docker', 'deploy', 'pipeline', '배포'],
  clue: ['clue', 'portfolio', '포트폴리오', 'planning', 'v1'],
  sizz: ['sizz', 'news', '뉴스'],
}

const normalizeProjectKey = (value: string) => value.trim().toLocaleLowerCase().replace(/\s+/g, '')
const normalizeTagToken = (value: string) => value.trim().replace(/^#/, '')
const normalizeExternalLinkToken = (value: string) => value.toLocaleLowerCase().trim()

const resolveExternalLinkBadge = (name: string, url: string) => {
  const normalizedName = normalizeExternalLinkToken(name)
  const normalizedUrl = normalizeExternalLinkToken(url)

  if (normalizedName.includes('notion') || normalizedUrl.includes('notion.so')) {
    return 'NOTION'
  }

  if (
    normalizedName.includes('git') ||
    normalizedName.includes('github') ||
    normalizedUrl.includes('github.com')
  ) {
    return 'GIT'
  }

  return 'LINK'
}

const isTroubleshootingLinkedToProject = (post: BlogPost, projectTitle: string) => {
  const key = normalizeProjectKey(projectTitle)
  const normalizedTags = post.tags.map((tag) => normalizeProjectKey(normalizeTagToken(tag)))

  if (normalizedTags.some((tag) => tag === key)) {
    return true
  }

  const hints = projectKeywordMap[key] ?? []
  const keywords = [...new Set([projectTitle.toLocaleLowerCase(), ...hints])]
  const source = `${post.title} ${post.excerpt} ${post.tags.join(' ')}`.toLocaleLowerCase()

  return keywords.some((keyword) => source.includes(keyword.toLocaleLowerCase()))
}

const troubleshootingPosts = computed(() => {
  const project = selectedProject.value

  if (!project) {
    return []
  }

  return blogCopy.value.posts.filter(
    (post) => post.category === 'retrospective' && isTroubleshootingLinkedToProject(post, project.title),
  )
})

const copy = computed(() =>
  locale.value === 'en'
    ? {
        kicker: 'PROJECT ARCHIVE',
        heading: 'All Projects',
        lead: 'Select a project to view its details and troubleshooting posts.',
        countLabel: 'Total Projects',
        listHeading: 'Select Project',
        listLead: 'Click a card to open project details.',
        detailHeading: 'Project Details',
        detailLead: 'Overview, impact, stack, and linked troubleshooting posts.',
        linksHeading: 'Collaboration Links',
        linksLead: 'Click a box to open the link in a new tab.',
        troubleshootingHeading: 'Troubleshooting',
        troubleshootingEmpty: 'No troubleshooting posts linked to this project yet.',
        readLabel: 'Read Post',
      }
    : {
        kicker: 'PROJECT ARCHIVE',
        heading: '프로젝트 전체 보기',
        lead: '프로젝트를 선택하면 상세 정보와 트러블 슈팅 글을 볼 수 있습니다.',
        countLabel: '전체 프로젝트 수',
        listHeading: '프로젝트 선택',
        listLead: '카드를 클릭해서 프로젝트 상세를 확인하세요.',
        detailHeading: '프로젝트 상세',
        detailLead: '개요, 성과, 기술 스택, 연결된 트러블 슈팅 글을 제공합니다.',
        linksHeading: '협업 링크',
        linksLead: '박스를 클릭하면 새 탭으로 이동합니다.',
        troubleshootingHeading: '트러블 슈팅',
        troubleshootingEmpty: '연결된 트러블 슈팅 글이 아직 없습니다.',
        readLabel: '글 보기',
      },
)

const selectProject = async (index: number) => {
  const changed = selectedProjectIndex.value !== index
  selectedProjectIndex.value = index

  if (!changed) {
    return
  }

  detailTransitionNonce.value += 1

  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
    await nextTick()
    document.getElementById('project-detail')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }
}

watch(
  [routeProjectIndex, projects],
  ([routeIndex, currentProjects]) => {
    if (currentProjects.length === 0) {
      selectedProjectIndex.value = 0
      return
    }

    if (routeIndex === null) {
      if (selectedProjectIndex.value >= currentProjects.length) {
        selectedProjectIndex.value = 0
      }
      return
    }

    selectedProjectIndex.value = Math.min(routeIndex, currentProjects.length - 1)
  },
  { immediate: true },
)
</script>

<template>
  <div class="relative isolate mx-auto min-h-screen w-full max-w-[1260px] px-4 pb-14 pt-5 sm:px-8 lg:px-12">
    <div
      aria-hidden="true"
      class="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_-4%,rgba(255,255,255,0.08),transparent_30%),radial-gradient(circle_at_82%_108%,rgba(255,255,255,0.07),transparent_34%)] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.88),rgba(0,0,0,0.42))]"
    ></div>

    <main>
      <section id="projects-overview">
        <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">{{ copy.kicker }}</p>
        <h1 class="mt-3 text-[clamp(1.6rem,4.4vw,2.5rem)] leading-[1.05] text-zinc-100 [font-family:var(--font-display)]">
          {{ copy.heading }}
        </h1>
        <p class="mt-4 max-w-[72ch] text-zinc-300">{{ copy.lead }}</p>

        <div class="mt-6 inline-flex rounded-xl border border-[#2a2a2a] bg-[#131313d8] px-4 py-3">
          <p class="text-sm text-zinc-300">
            {{ copy.countLabel }}
            <strong class="ml-2 text-zinc-100">{{ projects.length }}</strong>
          </p>
        </div>
      </section>

      <section id="projects-list" class="mt-8">
        <h2 class="text-xl font-semibold text-zinc-100">{{ copy.listHeading }}</h2>
        <p class="mt-2 text-sm text-zinc-400">{{ copy.listLead }}</p>

        <div class="mt-4 grid grid-cols-1 justify-items-start gap-2.5 md:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="(project, projectIndex) in projects"
            :key="project.title"
            role="button"
            tabindex="0"
            class="project-card-enter w-full max-w-[320px] cursor-pointer rounded-xl border p-2.5 transition duration-300 focus:outline-none"
            :style="{ animationDelay: `${projectIndex * 45}ms` }"
            :class="
              selectedProjectIndex === projectIndex
                ? 'project-card-selected border-[#6f8fce] bg-[#14243d] shadow-[0_0_0_1px_rgba(111,143,206,0.45),0_14px_28px_rgba(8,14,24,0.48)]'
                : 'border-[#2a2a2a] bg-[#121212de] hover:border-[#3c4a61] hover:-translate-y-[2px]'
            "
            @click="selectProject(projectIndex)"
            @keydown.enter.prevent="selectProject(projectIndex)"
            @keydown.space.prevent="selectProject(projectIndex)"
          >
            <figure class="overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#101010]">
              <img
                v-if="project.imageSrc"
                :src="project.imageSrc"
                :alt="project.imageAlt ?? project.title"
                class="h-28 w-full object-cover"
                loading="lazy"
              />
              <div
                v-else
                class="flex h-28 w-full items-center justify-center bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.14),transparent_45%),linear-gradient(160deg,#181818,#101010)] px-3 text-center text-sm text-zinc-300"
              >
                {{ project.title }}
              </div>
            </figure>

            <h3 class="mt-2.5 text-sm font-semibold text-zinc-100">{{ project.title }}</h3>
            <p class="mt-1 text-xs text-zinc-300">{{ project.summary }}</p>
            <p class="mt-2 text-xs text-zinc-200">{{ project.impact }}</p>

            <ul class="mt-1.5 flex flex-wrap gap-1.5">
              <li
                v-for="item in project.stack"
                :key="`${project.title}-${item}`"
                class="rounded-full border border-[#2f2f2f] px-2 py-0.5 text-[11px] text-zinc-400"
              >
                {{ item }}
              </li>
            </ul>
          </article>
        </div>
      </section>

      <Transition name="detail-focus" mode="out-in">
        <section
          v-if="selectedProject"
          id="project-detail"
          :key="`${selectedProjectIndex}-${detailTransitionNonce}`"
          class="mt-8 max-w-[860px] rounded-xl border border-[#2a2a2a] bg-[#121212de] p-3.5"
        >
          <h2 class="text-lg font-semibold text-zinc-100">{{ copy.detailHeading }}</h2>
          <p class="mt-1.5 text-sm text-zinc-400">{{ copy.detailLead }}</p>

          <article class="mt-3 rounded-xl border border-[#2a2a2a] bg-[#111111] p-2.5">
            <figure class="mb-2.5 overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#101010]">
              <img
                v-if="selectedProject.imageSrc"
                :src="selectedProject.imageSrc"
                :alt="selectedProject.imageAlt ?? selectedProject.title"
                class="h-32 w-full object-cover"
                loading="lazy"
              />
              <div
                v-else
                class="flex h-32 w-full items-center justify-center bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.14),transparent_45%),linear-gradient(160deg,#181818,#101010)] px-3 text-center text-sm text-zinc-300"
              >
                  {{ selectedProject.title }}
                </div>
              </figure>

            <h3 class="text-sm font-semibold text-zinc-100">{{ selectedProject.title }}</h3>
            <p class="mt-1 text-xs text-zinc-300">{{ selectedProject.summary }}</p>
            <p class="mt-1.5 text-xs text-zinc-200">{{ selectedProject.impact }}</p>
            <ul class="mt-1.5 flex flex-wrap gap-1.5">
              <li
                v-for="item in selectedProject.stack"
                :key="`${selectedProject.title}-detail-${item}`"
                class="rounded-full border border-[#2f2f2f] px-2 py-0.5 text-[11px] text-zinc-400"
              >
                {{ item }}
              </li>
            </ul>

            <div v-if="selectedProject.links && selectedProject.links.length > 0" class="mt-3">
              <p class="text-[11px] uppercase tracking-[0.08em] text-zinc-500">{{ copy.linksHeading }}</p>
              <p class="mt-1 text-[11px] text-zinc-500">{{ copy.linksLead }}</p>
              <div class="mt-2 grid gap-2 sm:grid-cols-2">
                <a
                  v-for="link in selectedProject.links"
                  :key="`${selectedProject.title}-${link.name}-${link.url}`"
                  :href="link.url"
                  target="_blank"
                  rel="noreferrer"
                  class="group rounded-lg border border-[#2f2f2f] bg-[#141414] p-3 transition hover:border-[#6f8fce] hover:bg-[#17263f]"
                >
                  <div class="flex items-start justify-between gap-2">
                    <span
                      class="rounded-md border border-[#343434] bg-[#1a1a1a] px-1.5 py-0.5 text-[10px] font-medium tracking-[0.08em] text-zinc-300"
                    >
                      {{ resolveExternalLinkBadge(link.name, link.url) }}
                    </span>
                    <span class="text-xs text-zinc-500 transition group-hover:text-zinc-300">↗</span>
                  </div>
                  <p class="mt-2 text-sm font-medium text-zinc-100">{{ link.name }}</p>
                  <p class="mt-1 truncate text-[11px] text-zinc-400">{{ link.url }}</p>
                </a>
              </div>
            </div>
          </article>

          <article class="mt-2.5 rounded-xl border border-[#2a2a2a] bg-[#111111] p-2.5">
            <h3 class="text-sm font-semibold text-zinc-100">{{ copy.troubleshootingHeading }}</h3>

            <TransitionGroup v-if="troubleshootingPosts.length > 0" name="post-stagger" tag="div" class="mt-2 space-y-2">
              <RouterLink
                v-for="post in troubleshootingPosts"
                :key="post.id"
                :to="`${blogPath}/${post.id}`"
                class="block rounded-lg border border-[#2b2b2b] bg-[#141414] p-2.5 transition hover:border-[#6f8fce] hover:bg-[#17263f]"
              >
                <p class="text-sm font-semibold text-zinc-100">{{ post.title }}</p>
                <p class="mt-1 text-xs text-zinc-400">{{ post.excerpt }}</p>
                <p class="mt-2 text-[11px] text-zinc-500">{{ post.publishedAt }}</p>
              </RouterLink>
            </TransitionGroup>

            <p v-else class="mt-3 text-sm text-zinc-500">{{ copy.troubleshootingEmpty }}</p>
          </article>
        </section>
      </Transition>
    </main>
  </div>
</template>

<style scoped>
.project-card-enter {
  animation: projectCardEnter 460ms cubic-bezier(0.2, 0.82, 0.2, 1) both;
}

.project-card-selected {
  animation: selectedPulse 950ms ease-out 1;
}

.detail-focus-enter-active,
.detail-focus-leave-active {
  transition: opacity 220ms ease, transform 260ms cubic-bezier(0.22, 0.8, 0.2, 1);
}

.detail-focus-enter-from,
.detail-focus-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.992);
}

.post-stagger-enter-active {
  transition: opacity 280ms ease, transform 320ms cubic-bezier(0.22, 0.8, 0.2, 1);
}

.post-stagger-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

@keyframes projectCardEnter {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes selectedPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(111, 143, 206, 0.42);
  }
  100% {
    box-shadow: 0 0 0 12px rgba(111, 143, 206, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-card-enter,
  .project-card-selected {
    animation: none;
  }

  .detail-focus-enter-active,
  .detail-focus-leave-active,
  .post-stagger-enter-active {
    transition-duration: 1ms;
  }
}
</style>
