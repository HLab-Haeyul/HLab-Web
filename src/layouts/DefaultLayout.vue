<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { usePageTransition } from '@/composables/usePageTransition'
import SiteHeader from '@/components/organisms/SiteHeader.vue'

const { transitionName } = usePageTransition()
const showAppIntro = ref(true)

let introTimer: ReturnType<typeof setTimeout> | undefined

onMounted(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const introDuration = reducedMotion ? 650 : 1450

  introTimer = setTimeout(() => {
    showAppIntro.value = false
  }, introDuration)
})

onBeforeUnmount(() => {
  if (introTimer) {
    clearTimeout(introTimer)
  }

  document.body.style.overflow = ''
  document.documentElement.style.overflow = ''
})

watch(
  showAppIntro,
  (introOpen) => {
    const value = introOpen ? 'hidden' : ''
    document.body.style.overflow = value
    document.documentElement.style.overflow = value
  },
  { immediate: true },
)
</script>

<template>
  <Transition name="app-intro-fade">
    <section v-if="showAppIntro" class="app-intro-overlay" aria-label="앱 인트로">
      <div class="app-intro-card">
        <p class="app-intro-kicker">INITIAL RENDER</p>
        <h1 class="app-intro-brand">KIMMINJAE</h1>
        <p class="app-intro-subtitle">페이지를 준비하고 있습니다</p>
        <div class="app-intro-meter"><span></span></div>
      </div>
    </section>
  </Transition>
  <SiteHeader />
  <RouterView v-slot="{ Component, route: currentRoute }">
    <Transition :name="transitionName" mode="out-in">
      <component :is="Component" :key="currentRoute.path" />
    </Transition>
  </RouterView>
</template>

<style>
.app-intro-overlay {
  position: fixed;
  inset: 0;
  z-index: 150;
  display: grid;
  place-items: center;
  padding: 1.25rem;
  background:
    radial-gradient(circle at 50% -10%, rgba(79, 141, 255, 0.12), transparent 42%),
    radial-gradient(circle at 50% 110%, rgba(79, 141, 255, 0.08), transparent 34%),
    linear-gradient(165deg, #0f0f0f 0%, #111111 52%, #121212 100%);
}

.app-intro-card {
  width: min(560px, 100%);
  border: 1px solid #2a2a2a;
  border-radius: 1rem;
  background: rgba(18, 18, 18, 0.86);
  padding: clamp(1.25rem, 4vw, 2rem);
  backdrop-filter: blur(10px);
}

.app-intro-kicker {
  margin: 0;
  color: #71717a;
  font-size: 0.72rem;
  letter-spacing: 0.14em;
}

.app-intro-brand {
  margin: 0.35rem 0 0;
  color: #ffffff;
  font-size: clamp(1.45rem, 6vw, 2.35rem);
  letter-spacing: 0.08em;
  animation: app-intro-rise 620ms cubic-bezier(0.2, 0.82, 0.2, 1) both;
}

.app-intro-subtitle {
  margin: 0.42rem 0 0;
  color: #a1a1aa;
  font-size: 0.9rem;
}

.app-intro-meter {
  margin-top: 0.95rem;
  height: 2px;
  border-radius: 999px;
  background: #27272a;
  overflow: hidden;
}

.app-intro-meter span {
  display: block;
  width: 100%;
  height: 100%;
  transform-origin: left center;
  background: linear-gradient(90deg, #fafafa, #a1a1aa);
  animation: app-intro-progress 1.25s linear both;
}

.app-intro-fade-leave-active {
  transition:
    opacity 420ms ease,
    transform 420ms ease;
}

.app-intro-fade-leave-from {
  opacity: 1;
  transform: scale(1);
}

.app-intro-fade-leave-to {
  opacity: 0;
  transform: scale(1.01);
}

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

@keyframes app-intro-rise {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes app-intro-progress {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-intro-brand,
  .app-intro-meter span {
    animation: none;
  }

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
