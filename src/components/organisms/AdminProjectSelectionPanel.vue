<script setup lang="ts">
import AdminProjectListCard from '@/components/molecules/AdminProjectListCard.vue'
import type { AdminProjectRecord } from '@/types/adminProject'

type Props = {
  projects: AdminProjectRecord[]
  selectedProjectId: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'open-project': [id: string]
  'edit-project': [id: string]
  'delete-project': [id: string]
}>()
</script>

<template>
  <section class="rounded-[1.2rem] border border-[#2a2a2a] bg-[#121212dd] p-4 sm:p-5">
    <h2 class="text-base font-semibold text-zinc-100 sm:text-lg">프로젝트 선택</h2>
    <p class="mt-1 text-xs text-zinc-500">사진과 요약을 보고 프로젝트를 선택하세요.</p>

    <div class="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      <AdminProjectListCard
        v-for="project in props.projects"
        :key="project.id"
        :project="project"
        :selected="props.selectedProjectId === project.id"
        @open="emit('open-project', $event)"
        @edit="emit('edit-project', $event)"
        @delete="emit('delete-project', $event)"
      />
    </div>
  </section>
</template>
