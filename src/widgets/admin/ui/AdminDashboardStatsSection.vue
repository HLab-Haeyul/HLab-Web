<script setup lang="ts">
import AdminStatCard from './AdminStatCard.vue'

defineProps<{
  sectionId: string
  label: string
  stats: Array<{
    label: string
    value: string
    note: string
  }>
}>()
</script>

<template>
  <section :id="sectionId" class="space-y-3">
    <p class="text-xs uppercase tracking-[0.11em] text-zinc-500">{{ label }}</p>
    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard
        v-for="stat in stats"
        :key="`stat-${stat.label}`"
        :label="stat.label"
        :value="stat.value"
        :note="stat.note"
      />
    </div>
  </section>
</template>
