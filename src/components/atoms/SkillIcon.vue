<script setup lang="ts">
withDefaults(
  defineProps<{
    imageSrc?: string
    imageAlt?: string
    icon?: string
    label?: string
    imageClass?: string
    iconClass?: string
  }>(),
  {
    imageClass: 'h-5 w-5 object-contain',
    iconClass: 'text-base leading-none',
  },
)
</script>

<template>
  <img
    v-if="imageSrc"
    :src="imageSrc"
    :alt="imageAlt ?? label"
    :class="imageClass"
    loading="lazy"
  />
  <span v-else :class="iconClass">{{ icon ?? '•' }}</span>
</template>
