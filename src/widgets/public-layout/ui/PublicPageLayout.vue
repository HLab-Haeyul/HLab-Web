<script setup lang="ts">
import { computed } from 'vue'

type LayoutWidth = 'default' | 'wide' | 'narrow'
type LayoutTheme = 'default' | 'blog' | 'blog-light'

const props = withDefaults(
  defineProps<{
    width?: LayoutWidth
    topSpacing?: 'default' | 'compact'
    bottomSpacing?: 'default' | 'roomy'
    theme?: LayoutTheme
  }>(),
  {
    width: 'default',
    topSpacing: 'default',
    bottomSpacing: 'default',
    theme: 'default',
  },
)

const layoutStyle = computed(() => {
  const maxWidthByVariant: Record<LayoutWidth, string> = {
    default: '1400px',
    wide: '1480px',
    narrow: '1100px',
  }

  const topPaddingByVariant = {
    default: '1.1rem',
    compact: '0.75rem',
  }

  const bottomPaddingByVariant = {
    default: '3rem',
    roomy: '4.25rem',
  }

  return {
    '--public-layout-max-width': maxWidthByVariant[props.width],
    '--public-layout-top-padding': topPaddingByVariant[props.topSpacing],
    '--public-layout-bottom-padding': bottomPaddingByVariant[props.bottomSpacing],
  }
})
</script>

<template>
  <div class="public-page-layout" :class="`public-page-layout--${props.theme}`" :style="layoutStyle">
    <div aria-hidden="true" class="public-page-layout__backdrop"></div>
    <main class="public-page-layout__content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.public-page-layout {
  position: relative;
  isolation: isolate;
  min-height: calc(100vh - 4.25rem);
  width: min(100%, var(--public-layout-max-width));
  margin: 0 auto;
  padding: var(--public-layout-top-padding) 0.9rem var(--public-layout-bottom-padding);
}

.public-page-layout__backdrop {
  position: fixed;
  inset: 0;
  z-index: -10;
  pointer-events: none;
  background:
    radial-gradient(circle at 16% -8%, rgba(255, 255, 255, 0.14), transparent 34%),
    radial-gradient(circle at 84% 112%, rgba(255, 255, 255, 0.1), transparent 32%);
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.44));
}

.public-page-layout--blog .public-page-layout__backdrop {
  background:
    radial-gradient(circle at 16% 0%, rgba(95, 208, 162, 0.18), transparent 28%),
    radial-gradient(circle at 88% 2%, rgba(76, 142, 246, 0.14), transparent 24%),
    radial-gradient(circle at 50% 115%, rgba(95, 208, 162, 0.08), transparent 32%),
    linear-gradient(180deg, rgba(9, 14, 13, 0.94) 0%, rgba(14, 19, 18, 0.92) 100%);
  mask-image: none;
}

.public-page-layout--blog-light .public-page-layout__backdrop {
  background:
    radial-gradient(circle at 12% 4%, rgba(18, 184, 134, 0.16), transparent 26%),
    radial-gradient(circle at 88% 8%, rgba(255, 184, 76, 0.16), transparent 24%),
    radial-gradient(circle at 50% 112%, rgba(18, 184, 134, 0.08), transparent 30%),
    linear-gradient(180deg, #ecf6f0 0%, #f4f8f3 52%, #f7f1e7 100%);
  mask-image: none;
}

.public-page-layout__content {
  min-height: 100%;
}

@media (min-width: 640px) {
  .public-page-layout {
    padding-left: 1.75rem;
    padding-right: 1.75rem;
  }
}

@media (min-width: 1024px) {
  .public-page-layout {
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }
}
</style>
