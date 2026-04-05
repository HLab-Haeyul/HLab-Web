<template>
  <div class="admin-workspace-layout">
    <div aria-hidden="true" class="admin-workspace-layout__backdrop"></div>

    <main class="admin-workspace-layout__grid">
      <aside class="admin-workspace-layout__sidebar">
        <slot name="sidebar" />
      </aside>

      <div class="admin-workspace-layout__body">
        <section v-if="$slots.hero" class="admin-workspace-layout__hero">
          <slot name="hero" />
        </section>

        <div class="admin-workspace-layout__content">
          <slot />
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.admin-workspace-layout {
  position: relative;
  isolation: isolate;
  min-height: calc(100vh - 4.25rem);
  width: min(100%, 1400px);
  margin: 0 auto;
  padding: 1.1rem 0.9rem 3rem;
}

.admin-workspace-layout__backdrop {
  position: fixed;
  inset: 0;
  z-index: -10;
  pointer-events: none;
  background:
    radial-gradient(circle at 14% -6%, rgba(255, 255, 255, 0.16), transparent 34%),
    radial-gradient(circle at 85% 115%, rgba(255, 255, 255, 0.12), transparent 36%);
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.92), rgba(0, 0, 0, 0.4));
}

.admin-workspace-layout__grid {
  display: grid;
  gap: 1rem;
}

.admin-workspace-layout__sidebar {
  align-self: start;
}

.admin-workspace-layout__body,
.admin-workspace-layout__content {
  display: grid;
  gap: 1rem;
}

@media (min-width: 640px) {
  .admin-workspace-layout {
    padding-left: 1.75rem;
    padding-right: 1.75rem;
  }
}

@media (min-width: 1024px) {
  .admin-workspace-layout {
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }
}

@media (min-width: 1280px) {
  .admin-workspace-layout__grid {
    grid-template-columns: 216px minmax(0, 1fr);
    align-items: start;
  }

  .admin-workspace-layout__sidebar {
    position: sticky;
    top: 6rem;
  }
}
</style>
