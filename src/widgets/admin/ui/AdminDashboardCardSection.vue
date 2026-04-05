<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import AdminActionCard from './AdminActionCard.vue'

const props = withDefaults(
  defineProps<{
    sectionId: string
    label: string
    cards: Array<{
      id: string
      title: string
      description: string
      status: string
      to?: RouteLocationRaw
    }>
    variant?: 'ready' | 'planned'
  }>(),
  {
    variant: 'ready',
  },
)

const gridClass =
  props.variant === 'planned'
    ? 'grid gap-3 md:grid-cols-2 xl:grid-cols-3'
    : 'grid gap-3 md:grid-cols-2'
</script>

<template>
  <section :id="sectionId" class="space-y-3">
    <p class="text-xs uppercase tracking-[0.11em] text-zinc-500">{{ label }}</p>
    <div :class="gridClass">
      <AdminActionCard
        v-for="card in props.cards"
        :id="card.id"
        :key="card.id"
        :title="card.title"
        :description="card.description"
        :status="card.status"
        :to="card.to"
        :variant="props.variant"
      />
    </div>
  </section>
</template>
