<script setup lang="ts">
type PostImageItem = {
  key: string
  src: string
  alt: string
  caption: string
}

type PostVideoItem = {
  key: string
  src: string
  title: string
  poster: string | null
  autoplay: boolean
  muted: boolean
  loop: boolean
}

type Props = {
  mediaHeading: string
  images: PostImageItem[]
  videos: PostVideoItem[]
}

const props = defineProps<Props>()
</script>

<template>
  <section id="post-media" class="mt-7 space-y-4">
    <h2 class="text-xl font-semibold text-zinc-100">{{ props.mediaHeading }}</h2>

    <div v-if="props.images.length > 0" class="grid gap-3 sm:grid-cols-2">
      <figure
        v-for="image in props.images"
        :key="image.key"
        class="overflow-hidden rounded-xl border border-[#2f2f2f] bg-[#151515]"
      >
        <img :src="image.src" :alt="image.alt" class="h-full w-full object-cover" loading="lazy" />
        <figcaption v-if="image.caption" class="border-t border-[#2f2f2f] px-3 py-2 text-xs text-zinc-400">
          {{ image.caption }}
        </figcaption>
      </figure>
    </div>

    <div v-if="props.videos.length > 0" class="space-y-3">
      <article
        v-for="video in props.videos"
        :key="video.key"
        class="overflow-hidden rounded-xl border border-[#2f2f2f] bg-[#151515]"
      >
        <video
          controls
          playsinline
          preload="metadata"
          class="w-full"
          :poster="video.poster || undefined"
          :autoplay="video.autoplay"
          :muted="video.muted"
          :loop="video.loop"
        >
          <source :src="video.src" />
        </video>
        <p class="border-t border-[#2f2f2f] px-3 py-2 text-xs text-zinc-400">{{ video.title }}</p>
      </article>
    </div>
  </section>
</template>
