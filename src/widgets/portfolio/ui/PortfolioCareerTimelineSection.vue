<script setup lang="ts">
import { computed } from 'vue'
import type { CareerTimelineItem, ProfileShowcaseCopy } from '@/entities/portfolio'

const props = defineProps<{
  profileShowcase: ProfileShowcaseCopy
  isAppLayout: boolean
}>()

const timelineEntries = computed<CareerTimelineItem[]>(() => [...props.profileShowcase.careerTimeline])
</script>

<template>
  <section id="career" :class="props.isAppLayout ? 'mt-10' : 'mt-12 md:mt-[4.5rem]'">
    <div class="max-w-[54rem]">
      <p class="ui-type-kicker text-zinc-500">{{ props.profileShowcase.careerKicker }}</p>
      <h2
        class="mt-3 text-zinc-100"
        :class="props.isAppLayout ? 'ui-type-title-sm-compact' : 'ui-type-title-md'"
      >
        {{ props.profileShowcase.careerHeading }}
      </h2>
      <p class="mt-4 max-w-[44rem] text-sm leading-6 text-zinc-400">
        {{ props.profileShowcase.careerBody }}
      </p>
    </div>

    <ol v-if="timelineEntries.length > 0" class="career-timeline">
      <li
        v-for="entry in timelineEntries"
        :key="entry.id"
        class="career-timeline__item"
      >
        <span aria-hidden="true" class="career-timeline__dot"></span>

        <article class="career-timeline__card">
          <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div class="min-w-0">
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                {{ entry.category }}
              </p>
              <h3 class="mt-2 text-lg font-semibold leading-7 text-[var(--text-strong)]">
                {{ entry.role }}
              </h3>
              <p class="mt-1 text-sm leading-6 text-[var(--text-soft)]">
                {{ entry.organization }}
              </p>
            </div>

            <div class="flex flex-wrap gap-2 md:justify-end">
              <span class="career-timeline__chip">{{ entry.periodLabel }}</span>
              <span class="career-timeline__chip career-timeline__chip--accent">
                {{ entry.durationLabel }}
              </span>
            </div>
          </div>

          <p class="mt-4 text-sm leading-7 text-zinc-300">
            {{ entry.summary }}
          </p>

          <ul
            v-if="entry.highlights.length > 0"
            class="mt-4 grid gap-2 text-sm leading-6 text-[var(--text-soft)]"
          >
            <li
              v-for="highlight in entry.highlights"
              :key="`${entry.id}-${highlight}`"
              class="career-timeline__highlight"
            >
              {{ highlight }}
            </li>
          </ul>
        </article>
      </li>
    </ol>

    <article v-else class="career-timeline__empty-state">
      <h3 class="text-lg font-semibold text-[var(--text-strong)]">
        {{ props.profileShowcase.careerEmptyTitle }}
      </h3>
      <p class="mt-2 text-sm leading-6 text-[var(--text-faint)]">
        {{ props.profileShowcase.careerEmptyBody }}
      </p>
    </article>
  </section>
</template>

<style scoped>
.career-timeline {
  position: relative;
  display: grid;
  gap: 1rem;
  margin: 1.5rem 0 0;
  padding: 0;
  list-style: none;
}

.career-timeline::before {
  content: '';
  position: absolute;
  top: 0.8rem;
  bottom: 0.8rem;
  left: 0.62rem;
  width: 1px;
  background: linear-gradient(
    180deg,
    rgba(129, 215, 179, 0) 0%,
    rgba(129, 215, 179, 0.34) 14%,
    rgba(244, 244, 242, 0.14) 100%
  );
}

.career-timeline__item {
  position: relative;
  padding-left: 2rem;
}

.career-timeline__dot {
  position: absolute;
  top: 1rem;
  left: 0.62rem;
  width: 0.72rem;
  height: 0.72rem;
  border: 1px solid rgba(129, 215, 179, 0.38);
  border-radius: 999px;
  background: rgba(129, 215, 179, 0.18);
  box-shadow: 0 0 0 0.45rem rgba(14, 19, 18, 0.92);
  transform: translate(-50%, -50%);
}

.career-timeline__card {
  border: 1px solid var(--line-soft);
  border-radius: 1.4rem;
  background:
    radial-gradient(circle at top right, rgba(129, 215, 179, 0.08), transparent 28%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.025), rgba(255, 255, 255, 0.015));
  padding: 1.15rem 1.1rem;
  backdrop-filter: blur(10px);
}

.career-timeline__chip {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--line-soft);
  border-radius: 999px;
  padding: 0.34rem 0.72rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--text-soft);
}

.career-timeline__chip--accent {
  border-color: rgba(129, 215, 179, 0.22);
  background: rgba(129, 215, 179, 0.08);
  color: var(--brand-primary-strong);
}

.career-timeline__highlight {
  position: relative;
  padding-left: 1rem;
}

.career-timeline__highlight::before {
  content: '';
  position: absolute;
  top: 0.7rem;
  left: 0;
  width: 0.38rem;
  height: 0.38rem;
  border-radius: 999px;
  background: rgba(129, 215, 179, 0.72);
}

.career-timeline__empty-state {
  margin-top: 1.5rem;
  border: 1px dashed var(--line-muted);
  border-radius: 1.4rem;
  background: rgba(255, 255, 255, 0.02);
  padding: 1.45rem 1.2rem;
}

@media (min-width: 768px) {
  .career-timeline {
    gap: 1.1rem;
    margin-top: 1.8rem;
  }

  .career-timeline__item {
    padding-left: 2.35rem;
  }

  .career-timeline__card {
    padding: 1.3rem 1.3rem 1.2rem;
  }
}
</style>
