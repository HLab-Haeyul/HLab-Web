<script setup lang="ts">
defineProps<{
  kicker: string
  heading: string
  description: string
  basePath: string
  backLabel: string
}>()
</script>

<template>
  <section class="rounded-[1.6rem] border border-[#243654] bg-[#0a0f17d9] p-5 sm:p-7">
    <p class="text-xs uppercase tracking-[0.12em] text-[var(--text-soft)]">{{ kicker }}</p>
    <h1 class="mt-2 text-2xl font-semibold text-zinc-100 sm:text-3xl">{{ heading }}</h1>
    <p class="mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">{{ description }}</p>

    <div class="mt-4">
      <RouterLink
        :to="basePath"
        class="inline-flex items-center rounded-lg border border-[#243654] px-3 py-1.5 text-xs text-zinc-200 transition hover:border-[#5f8cff] hover:bg-[#101a2c] hover:text-white"
      >
        {{ backLabel }}
      </RouterLink>
    </div>
  </section>
</template>
