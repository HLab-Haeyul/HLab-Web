<script setup lang="ts">
import type { ProjectArchiveCopy } from '@/entities/project'

defineProps<{
  copy: Pick<ProjectArchiveCopy, 'kicker' | 'heading' | 'lead'>
}>()
</script>

<template>
  <section id="projects-overview" class="border-b border-[var(--line-strong)] pb-6 sm:pb-7">
    <div class="max-w-[54rem]">
      <p class="ui-type-kicker text-[var(--text-soft)]">{{ copy.kicker }}</p>
      <h1 class="ui-type-title-lg mt-3 text-[var(--text-strong)]">
        {{ copy.heading }}
      </h1>
      <p v-if="copy.lead" class="ui-type-body mt-4 max-w-[62ch] text-[var(--text-soft)]">
        {{ copy.lead }}
      </p>
    </div>
  </section>
</template>
