<script setup lang="ts">
import { computed, ref } from 'vue'
import { blogPageCopyByLocale, type BlogPost } from '@/data/blog/content'
import { worksByLocale } from '@/data/portfolio/works'
import { useLocale } from '@/composables/useLocale'

const { locale, blogPath } = useLocale()

const projects = computed(() => worksByLocale[locale.value])
const selectedProjectIndex = ref(0)

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

  return blogPageCopyByLocale[locale.value].posts.filter(
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
        troubleshootingHeading: '트러블 슈팅',
        troubleshootingEmpty: '연결된 트러블 슈팅 글이 아직 없습니다.',
        readLabel: '글 보기',
      },
)
</script>

<template>
  <div class="relative isolate mx-auto min-h-screen w-full max-w-[1480px] px-4 pb-14 pt-5 sm:px-8 lg:px-12">
    <div
      aria-hidden="true"
      class="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_-4%,rgba(255,255,255,0.08),transparent_30%),radial-gradient(circle_at_82%_108%,rgba(255,255,255,0.07),transparent_34%)] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.88),rgba(0,0,0,0.42))]"
    ></div>

    <main>
      <section id="projects-overview">
        <p class="text-xs uppercase tracking-[0.12em] text-zinc-500">{{ copy.kicker }}</p>
        <h1 class="mt-3 text-[clamp(1.8rem,5vw,3rem)] leading-[1.03] text-zinc-100 [font-family:var(--font-display)]">
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

      <section id="projects-list" class="mt-10">
        <h2 class="text-2xl font-semibold text-zinc-100">{{ copy.listHeading }}</h2>
        <p class="mt-2 text-sm text-zinc-400">{{ copy.listLead }}</p>

        <div class="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="(project, projectIndex) in projects"
            :key="project.title"
            role="button"
            tabindex="0"
            class="cursor-pointer rounded-2xl border p-4 transition focus:outline-none"
            :class="
              selectedProjectIndex === projectIndex
                ? 'border-blue-500 bg-[#121826]'
                : 'border-[#2a2a2a] bg-[#121212de] hover:border-[#3c3c3c]'
            "
            @click="selectedProjectIndex = projectIndex"
            @keydown.enter.prevent="selectedProjectIndex = projectIndex"
            @keydown.space.prevent="selectedProjectIndex = projectIndex"
          >
            <figure class="overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#101010]">
              <img
                v-if="project.imageSrc"
                :src="project.imageSrc"
                :alt="project.imageAlt ?? project.title"
                class="h-40 w-full object-cover"
                loading="lazy"
              />
              <div
                v-else
                class="flex h-40 w-full items-center justify-center bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.14),transparent_45%),linear-gradient(160deg,#181818,#101010)] px-3 text-center text-sm text-zinc-300"
              >
                {{ project.title }}
              </div>
            </figure>

            <h3 class="mt-4 text-lg font-semibold text-zinc-100">{{ project.title }}</h3>
            <p class="mt-2 text-sm text-zinc-300">{{ project.summary }}</p>
            <p class="mt-3 text-sm text-zinc-200">{{ project.impact }}</p>

            <ul class="mt-3 flex flex-wrap gap-2">
              <li
                v-for="item in project.stack"
                :key="`${project.title}-${item}`"
                class="rounded-full border border-[#2f2f2f] px-2 py-1 text-xs text-zinc-400"
              >
                {{ item }}
              </li>
            </ul>
          </article>
        </div>
      </section>

      <section v-if="selectedProject" id="project-detail" class="mt-10 rounded-2xl border border-[#2a2a2a] bg-[#121212de] p-5">
        <h2 class="text-2xl font-semibold text-zinc-100">{{ copy.detailHeading }}</h2>
        <p class="mt-2 text-sm text-zinc-400">{{ copy.detailLead }}</p>

        <article class="mt-5 rounded-xl border border-[#2a2a2a] bg-[#111111] p-4">
          <h3 class="text-lg font-semibold text-zinc-100">{{ selectedProject.title }}</h3>
          <p class="mt-2 text-sm text-zinc-300">{{ selectedProject.summary }}</p>
          <p class="mt-3 text-sm text-zinc-200">{{ selectedProject.impact }}</p>
          <ul class="mt-3 flex flex-wrap gap-2">
            <li
              v-for="item in selectedProject.stack"
              :key="`${selectedProject.title}-detail-${item}`"
              class="rounded-full border border-[#2f2f2f] px-2 py-1 text-xs text-zinc-400"
            >
              {{ item }}
            </li>
          </ul>
        </article>

        <article class="mt-4 rounded-xl border border-[#2a2a2a] bg-[#111111] p-4">
          <h3 class="text-base font-semibold text-zinc-100">{{ copy.troubleshootingHeading }}</h3>

          <div v-if="troubleshootingPosts.length > 0" class="mt-3 space-y-3">
            <RouterLink
              v-for="post in troubleshootingPosts"
              :key="post.id"
              :to="`${blogPath}/${post.id}`"
              class="block rounded-lg border border-[#2b2b2b] bg-[#141414] p-3 transition hover:border-blue-500 hover:bg-[#172032]"
            >
              <p class="text-sm font-semibold text-zinc-100">{{ post.title }}</p>
              <p class="mt-1 text-xs text-zinc-400">{{ post.excerpt }}</p>
              <p class="mt-2 text-[11px] text-zinc-500">{{ post.publishedAt }}</p>
            </RouterLink>
          </div>

          <p v-else class="mt-3 text-sm text-zinc-500">{{ copy.troubleshootingEmpty }}</p>
        </article>
      </section>
    </main>
  </div>
</template>
