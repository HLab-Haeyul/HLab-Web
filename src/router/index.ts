import { createRouter, createWebHistory } from 'vue-router'
import PortfolioView from '@/views/PortfolioView.vue'
import StackDetailView from '@/views/StackDetailView.vue'
import BlogView from '@/views/BlogView.vue'
import BlogPostView from '@/views/BlogPostView.vue'
import ProjectView from '@/views/ProjectView.vue'
import AdminView from '@/views/AdminView.vue'
import AdminBlogManagerView from '@/views/AdminBlogManagerView.vue'
import AdminBlogPostView from '@/views/AdminBlogPostView.vue'
import AdminBlogWriteView from '@/views/AdminBlogWriteView.vue'
import AdminProjectManagerView from '@/views/AdminProjectManagerView.vue'
import AdminPortfolioManagerView from '@/views/AdminPortfolioManagerView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }

    if (to.path === from.path && to.fullPath !== from.fullPath) {
      return false
    }

    return {
      top: 0,
    }
  },
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
      path: '/ko/projects',
      name: 'projects-ko',
      component: ProjectView,
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
      path: '/ko/admin/blog/write',
      name: 'admin-blog-write-ko',
      component: AdminBlogWriteView,
      meta: {
        locale: 'ko',
      },
    },
    {
      path: '/ko/admin/projects',
      name: 'admin-projects-ko',
      component: AdminProjectManagerView,
      meta: {
        locale: 'ko',
      },
    },
    {
      path: '/ko/admin/projects/:id',
      name: 'admin-project-detail-ko',
      component: AdminProjectManagerView,
      meta: {
        locale: 'ko',
      },
    },
    {
      path: '/ko/admin/portfolio',
      name: 'admin-portfolio-ko',
      component: AdminPortfolioManagerView,
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
      path: '/en/projects',
      name: 'projects-en',
      component: ProjectView,
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
      path: '/en/admin/blog/write',
      name: 'admin-blog-write-en',
      component: AdminBlogWriteView,
      meta: {
        locale: 'en',
      },
    },
    {
      path: '/en/admin/projects',
      name: 'admin-projects-en',
      component: AdminProjectManagerView,
      meta: {
        locale: 'en',
      },
    },
    {
      path: '/en/admin/projects/:id',
      name: 'admin-project-detail-en',
      component: AdminProjectManagerView,
      meta: {
        locale: 'en',
      },
    },
    {
      path: '/en/admin/portfolio',
      name: 'admin-portfolio-en',
      component: AdminPortfolioManagerView,
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
