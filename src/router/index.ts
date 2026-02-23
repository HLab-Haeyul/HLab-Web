import { createRouter, createWebHistory } from 'vue-router'
import PortfolioView from '@/views/PortfolioView.vue'
import StackDetailView from '@/views/StackDetailView.vue'
import BlogView from '@/views/BlogView.vue'
import BlogPostView from '@/views/BlogPostView.vue'
import AdminView from '@/views/AdminView.vue'
import AdminBlogManagerView from '@/views/AdminBlogManagerView.vue'
import AdminBlogPostView from '@/views/AdminBlogPostView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // scrollBehavior(to) {
  //   if (to.hash) {
  //     return {
  //       el: to.hash,
  //       behavior: 'smooth',
  //     }
  //   }

  //   return {
  //     top: 0,
  //   }
  // }, --- IGNORE ---
  routes: [
    {
      path: '/',
      redirect: '/ko',
    },
    {
      path: '/ko',
      name: 'portfolio-ko',
      component: PortfolioView,
      meta: {
        locale: 'ko',
      },
    },
    {
      path: '/ko/stack',
      name: 'stack-ko',
      component: StackDetailView,
      meta: {
        locale: 'ko',
      },
    },
    {
      path: '/ko/blog',
      name: 'blog-ko',
      component: BlogView,
      meta: {
        locale: 'ko',
      },
    },
    {
      path: '/ko/blog/:id',
      name: 'blog-post-ko',
      component: BlogPostView,
      meta: {
        locale: 'ko',
      },
    },
    {
      path: '/ko/admin',
      name: 'admin-ko',
      component: AdminView,
      meta: {
        locale: 'ko',
      },
    },
    {
      path: '/ko/admin/blog',
      name: 'admin-blog-ko',
      component: AdminBlogManagerView,
      meta: {
        locale: 'ko',
      },
    },
    {
      path: '/ko/admin/blog/:id',
      name: 'admin-blog-post-ko',
      component: AdminBlogPostView,
      meta: {
        locale: 'ko',
      },
    },
    {
      path: '/en',
      name: 'portfolio-en',
      component: PortfolioView,
      meta: {
        locale: 'en',
      },
    },
    {
      path: '/en/stack',
      name: 'stack-en',
      component: StackDetailView,
      meta: {
        locale: 'en',
      },
    },
    {
      path: '/en/blog',
      name: 'blog-en',
      component: BlogView,
      meta: {
        locale: 'en',
      },
    },
    {
      path: '/en/blog/:id',
      name: 'blog-post-en',
      component: BlogPostView,
      meta: {
        locale: 'en',
      },
    },
    {
      path: '/en/admin',
      name: 'admin-en',
      component: AdminView,
      meta: {
        locale: 'en',
      },
    },
    {
      path: '/en/admin/blog',
      name: 'admin-blog-en',
      component: AdminBlogManagerView,
      meta: {
        locale: 'en',
      },
    },
    {
      path: '/en/admin/blog/:id',
      name: 'admin-blog-post-en',
      component: AdminBlogPostView,
      meta: {
        locale: 'en',
      },
    },
  ],
})

export default router
