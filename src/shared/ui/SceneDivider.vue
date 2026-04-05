<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'tree' | 'beacon' | 'stones'
    compact?: boolean
  }>(),
  {
    variant: 'tree',
    compact: false,
  },
)
</script>

<template>
  <div
    class="scene-divider"
    :class="[`scene-divider--${variant}`, compact ? 'scene-divider--compact' : '']"
    aria-hidden="true"
  >
    <span class="scene-divider__line"></span>

    <div class="scene-divider__scene">
      <span class="scene-divider__mist scene-divider__mist--left"></span>
      <span class="scene-divider__mist scene-divider__mist--right"></span>
      <span class="scene-divider__glow"></span>

      <svg
        v-if="variant === 'tree'"
        viewBox="0 0 240 120"
        class="scene-divider__svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="120" cy="90" rx="42" ry="9" fill="rgba(255,255,255,0.05)" />
        <path
          d="M118 82C118.6 68 119.5 57 120 49C120.5 57 121.4 68 122 82"
          stroke="rgba(244,244,242,0.38)"
          stroke-width="6"
          stroke-linecap="round"
        />
        <path
          d="M111 67C112.8 60.6 116.4 56.8 120 55.4C123.6 56.8 127.2 60.6 129 67"
          stroke="rgba(244,244,242,0.24)"
          stroke-width="3"
          stroke-linecap="round"
        />
        <circle cx="103" cy="53" r="16" fill="rgba(129,215,179,0.2)" />
        <circle cx="120" cy="43" r="19" fill="rgba(129,215,179,0.32)" />
        <circle cx="138" cy="55" r="15" fill="rgba(129,215,179,0.24)" />
        <path
          d="M93 66C98.5 55.2 107.2 49.8 120 49.8C132.8 49.8 141.5 55.2 147 66"
          stroke="rgba(159,230,200,0.72)"
          stroke-width="2.8"
          stroke-linecap="round"
        />
        <path
          d="M97 86C106 81 114.2 78.8 120 78.8C125.8 78.8 134 81 143 86"
          stroke="rgba(244,244,242,0.18)"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>

      <svg
        v-else-if="variant === 'beacon'"
        viewBox="0 0 240 120"
        class="scene-divider__svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="120" cy="92" rx="44" ry="9" fill="rgba(255,255,255,0.05)" />
        <rect x="109" y="46" width="22" height="38" rx="11" fill="rgba(244,244,242,0.14)" />
        <path
          d="M114 84H126L134 92H106L114 84Z"
          fill="rgba(244,244,242,0.12)"
        />
        <circle cx="120" cy="36" r="8" fill="rgba(129,215,179,0.88)" />
        <path
          d="M96 38C102.8 29.6 110.4 25.4 120 25.4C129.6 25.4 137.2 29.6 144 38"
          stroke="rgba(159,230,200,0.5)"
          stroke-width="2.6"
          stroke-linecap="round"
        />
        <path
          d="M102 48C107 42.6 112.8 39.8 120 39.8C127.2 39.8 133 42.6 138 48"
          stroke="rgba(244,244,242,0.22)"
          stroke-width="2"
          stroke-linecap="round"
        />
        <path
          d="M120 29V18"
          stroke="rgba(244,244,242,0.28)"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>

      <svg
        v-else
        viewBox="0 0 240 120"
        class="scene-divider__svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="120" cy="92" rx="44" ry="9" fill="rgba(255,255,255,0.05)" />
        <rect x="103" y="71" width="34" height="12" rx="6" fill="rgba(244,244,242,0.14)" />
        <rect x="98" y="56" width="44" height="13" rx="6.5" fill="rgba(244,244,242,0.18)" />
        <rect x="108" y="42" width="24" height="11" rx="5.5" fill="rgba(244,244,242,0.22)" />
        <path
          d="M120 41C119.6 34.8 116.8 30.4 111.8 27"
          stroke="rgba(159,230,200,0.72)"
          stroke-width="2.4"
          stroke-linecap="round"
        />
        <path
          d="M120 41C120.4 35.4 123.4 31.4 128.4 28.4"
          stroke="rgba(159,230,200,0.56)"
          stroke-width="2"
          stroke-linecap="round"
        />
        <circle cx="111" cy="26" r="3.8" fill="rgba(129,215,179,0.8)" />
        <circle cx="129" cy="28" r="3.2" fill="rgba(129,215,179,0.52)" />
      </svg>

      <span class="scene-divider__mote scene-divider__mote--a"></span>
      <span class="scene-divider__mote scene-divider__mote--b"></span>
      <span class="scene-divider__mote scene-divider__mote--c"></span>
    </div>
  </div>
</template>

<style scoped>
.scene-divider {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: min(100%, 64rem);
  min-height: clamp(4.75rem, 10vw, 6.75rem);
  margin-inline: auto;
  pointer-events: none;
}

.scene-divider--compact {
  min-height: clamp(3.8rem, 8vw, 5rem);
}

.scene-divider__line {
  position: absolute;
  inset: 50% 0 auto;
  height: 1px;
  transform: translateY(-50%);
  background:
    linear-gradient(
      90deg,
      transparent 0%,
      rgba(244, 244, 242, 0.08) 18%,
      rgba(129, 215, 179, 0.26) 50%,
      rgba(244, 244, 242, 0.08) 82%,
      transparent 100%
    );
}

.scene-divider__scene {
  position: relative;
  z-index: 1;
  width: clamp(10.5rem, 22vw, 14.5rem);
  height: clamp(4.5rem, 10vw, 6.25rem);
  animation: scene-sway 8.8s ease-in-out infinite;
}

.scene-divider__mist,
.scene-divider__glow {
  position: absolute;
  inset: auto;
  border-radius: 999px;
  filter: blur(16px);
}

.scene-divider__glow {
  inset: auto 22% 0 22%;
  height: 2.6rem;
  background:
    radial-gradient(circle, rgba(129, 215, 179, 0.18) 0%, rgba(129, 215, 179, 0) 72%);
}

.scene-divider__mist {
  top: 1.5rem;
  width: 3.4rem;
  height: 1.8rem;
  background: rgba(255, 255, 255, 0.06);
}

.scene-divider__mist--left {
  left: 0.6rem;
}

.scene-divider__mist--right {
  right: 0.6rem;
}

.scene-divider__svg {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  overflow: visible;
  filter: drop-shadow(0 12px 26px rgba(0, 0, 0, 0.28));
}

.scene-divider__mote {
  position: absolute;
  border-radius: 999px;
  background: rgba(159, 230, 200, 0.62);
  box-shadow: 0 0 14px rgba(129, 215, 179, 0.22);
  animation: scene-float 6.4s ease-in-out infinite;
}

.scene-divider__mote--a {
  top: 0.85rem;
  left: 2.1rem;
  width: 0.3rem;
  height: 0.3rem;
}

.scene-divider__mote--b {
  top: 0.15rem;
  right: 3rem;
  width: 0.44rem;
  height: 0.44rem;
  animation-delay: -1.4s;
}

.scene-divider__mote--c {
  top: 1.4rem;
  right: 1.4rem;
  width: 0.22rem;
  height: 0.22rem;
  animation-delay: -2.3s;
}

.scene-divider--beacon .scene-divider__glow {
  background:
    radial-gradient(circle, rgba(129, 215, 179, 0.12) 0%, rgba(129, 215, 179, 0) 70%);
}

.scene-divider--stones .scene-divider__mist {
  background: rgba(255, 255, 255, 0.045);
}

@keyframes scene-sway {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

@keyframes scene-float {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-5px);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .scene-divider__scene,
  .scene-divider__mote {
    animation: none;
  }
}
</style>
