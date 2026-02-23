<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLocale } from '@/composables/useLocale'
import BlogPostPageTemplate from '@/components/templates/BlogPostPageTemplate.vue'

const { adminBlogPath } = useLocale()
const route = useRoute()

const postId = computed(() => {
  const raw = route.params.id
  const value = Array.isArray(raw) ? raw[0] : raw

  if (typeof value !== 'string') {
    return ''
  }

  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
})

const editPostPath = computed(() => {
  if (!postId.value) {
    return adminBlogPath.value
  }

  const query = new URLSearchParams({
    edit: postId.value,
  })

  return `${adminBlogPath.value}?${query.toString()}#admin-blog-compose`
})
</script>

<template>
  <BlogPostPageTemplate
    :force-admin-comment-mode="true"
    :back-path="adminBlogPath"
    back-label-override="글 관리로"
    :edit-post-path="editPostPath"
    edit-post-label="글 수정하기"
  />
</template>
