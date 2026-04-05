<script setup lang="ts">
import type {
  ProjectArchiveCopy,
  ProjectArchiveProject,
  ProjectToneStyle,
} from '@/entities/project'

const props = defineProps<{
  project: ProjectArchiveProject
  projectIndex: number
  isSelected: boolean
  selectedLabel: ProjectArchiveCopy['selectedLabel']
  toneStyle: ProjectToneStyle
}>()

const emit = defineEmits<{
  select: []
}>()

const handleSelect = () => {
  emit('select')
}
</script>

<template>
  <article
    role="button"
    tabindex="0"
    class="project-option project-card-enter"
    :class="{ 'is-selected': props.isSelected }"
    :style="[props.toneStyle, { animationDelay: `${props.projectIndex * 45}ms` }]"
    @click="handleSelect"
    @keydown.enter.prevent="handleSelect"
    @keydown.space.prevent="handleSelect"
  >
    <figure class="project-option-media">
      <img
        v-if="props.project.imageSrc"
        :src="props.project.imageSrc"
        :alt="props.project.imageAlt ?? props.project.title"
        class="h-full w-full object-cover"
        loading="lazy"
      />
      <div v-else class="project-option-placeholder">
        {{ props.project.title }}
      </div>
    </figure>

    <div class="min-w-0 flex-1">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <h2
            class="project-option-title truncate text-base font-semibold text-[var(--text-strong)]"
          >
            {{ props.project.title }}
          </h2>
          <p class="mt-1 text-xs leading-5 text-[var(--text-soft)]">{{ props.project.summary }}</p>
        </div>
        <span class="project-option-index">{{ `${props.projectIndex + 1}`.padStart(2, '0') }}</span>
      </div>

      <p class="mt-3 text-xs font-medium leading-5 text-[var(--text-strong)]">
        {{ props.project.impact }}
      </p>

      <ul class="mt-3 flex flex-wrap gap-1.5">
        <li
          v-for="item in props.project.stack"
          :key="`${props.project.title}-${item}`"
          class="project-stack-pill"
        >
          {{ item }}
        </li>
      </ul>

      <div class="mt-3 flex items-center justify-between gap-3">
        <span v-if="props.isSelected" class="project-option-badge">
          {{ props.selectedLabel }}
        </span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.project-option {
  position: relative;
  display: flex;
  gap: 0.95rem;
  border-bottom: 1px solid var(--line-soft);
  padding: 0 0 1rem;
  cursor: pointer;
  transition:
    transform 220ms ease,
    border-color 220ms ease,
    color 220ms ease;
}

.project-option:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.project-option:hover {
  transform: translateX(4px);
  border-color: var(--line-muted);
}

.project-option.is-selected {
  border-color: rgba(255, 255, 255, 0.2);
}

.project-option.is-selected::before {
  content: '';
  position: absolute;
  left: -0.7rem;
  top: 0.2rem;
  bottom: 1rem;
  width: 2px;
  border-radius: 999px;
  background: var(--project-accent);
}

.project-option-media {
  width: 4.9rem;
  height: 4.9rem;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 0.9rem;
  background: linear-gradient(160deg, var(--project-surface), #141414);
}

.project-option-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 1rem;
  text-align: center;
  color: var(--text-strong);
  background:
    radial-gradient(circle at 18% 18%, var(--project-accent-soft), transparent 46%),
    linear-gradient(160deg, var(--project-surface), #141414);
}

.project-option-index {
  flex-shrink: 0;
  font-size: var(--type-label-xs);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.project-option.is-selected .project-option-index {
  color: var(--project-accent);
}

.project-option-title {
  transition: color 180ms ease;
}

.project-option.is-selected .project-option-title {
  color: var(--project-accent);
}

.project-option-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-size: var(--type-label-xs);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--project-accent);
}

.project-stack-pill {
  padding: 0;
  font-size: var(--type-label-xs);
  color: var(--text-soft);
}

.project-card-enter {
  animation: projectCardEnter 460ms cubic-bezier(0.2, 0.82, 0.2, 1) both;
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

@media (max-width: 639px) {
  .project-option {
    padding: 0 0 0.85rem;
  }

  .project-option-media {
    width: 4.25rem;
    height: 4.25rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-card-enter {
    animation: none;
  }

  .project-option {
    transition-duration: 1ms;
  }
}
</style>
