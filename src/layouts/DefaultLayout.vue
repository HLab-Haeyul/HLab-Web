<script setup lang="ts">
import { usePageTransition } from '@/composables/usePageTransition'
import SiteHeader from '@/components/organisms/SiteHeader.vue'

const { transitionName } = usePageTransition()
</script>

<template>
  <SiteHeader />
  <RouterView v-slot="{ Component, route: currentRoute }">
    <Transition :name="transitionName" mode="out-in">
      <component :is="Component" :key="currentRoute.path" />
    </Transition>
  </RouterView>
</template>

<style>
.page-fade-enter-active,
.page-fade-leave-active,
.page-stack-forward-enter-active,
.page-stack-forward-leave-active,
.page-stack-backward-enter-active,
.page-stack-backward-leave-active {
  transition:
    opacity 320ms cubic-bezier(0.22, 0.8, 0.2, 1),
    transform 420ms cubic-bezier(0.22, 0.8, 0.2, 1),
    filter 420ms cubic-bezier(0.22, 0.8, 0.2, 1);
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
  filter: blur(4px);
}

.page-stack-forward-enter-from {
  opacity: 0;
  transform: translateX(24px) scale(0.992);
  filter: blur(5px);
}

.page-stack-forward-leave-to {
  opacity: 0;
  transform: translateX(-16px) scale(1.006);
  filter: blur(4px);
}

.page-stack-backward-enter-from {
  opacity: 0;
  transform: translateX(-24px) scale(0.992);
  filter: blur(5px);
}

.page-stack-backward-leave-to {
  opacity: 0;
  transform: translateX(16px) scale(1.006);
  filter: blur(4px);
}

@media (prefers-reduced-motion: reduce) {
  .page-fade-enter-active,
  .page-fade-leave-active,
  .page-stack-forward-enter-active,
  .page-stack-forward-leave-active,
  .page-stack-backward-enter-active,
  .page-stack-backward-leave-active {
    transition-duration: 1ms;
  }

  .page-fade-enter-from,
  .page-fade-leave-to,
  .page-stack-forward-enter-from,
  .page-stack-forward-leave-to,
  .page-stack-backward-enter-from,
  .page-stack-backward-leave-to {
    transform: none;
    filter: none;
  }
}
</style>
