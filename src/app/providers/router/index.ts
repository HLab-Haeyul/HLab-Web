import { defineComponent, h } from 'vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import PortfolioPage from '@/pages/portfolio'
import StackDetailPage from '@/pages/stack-detail'
import ProjectsPage from '@/pages/projects'
import AdminDashboardPage from '@/pages/admin/dashboard'
import AdminProjectManagerPage from '@/pages/admin/project-manager'
import AdminPortfolioManagerPage from '@/pages/admin/portfolio-manager'
import AdminLoginPage from '@/pages/admin/login'
import { ensureAdminAuthenticated } from '@/features/auth/admin-session'
import { EXTERNAL_BLOG_URL } from '@/shared/config/externalLinks'
import { isAdminAuthBypassed } from '@/shared/config/adminAuth'
import { isAdminFeatureEnabled } from '@/shared/config/adminFeatures'

const redirectToExternalBlog = () => {
  if (typeof window !== 'undefined') {
    window.location.replace(EXTERNAL_BLOG_URL)
  }

  return false
}

const ExternalRedirectPlaceholder = defineComponent({
  name: 'ExternalRedirectPlaceholder',
  setup() {
    return () => h('div')
  },
})

const isAdminEnabled = isAdminFeatureEnabled()

const koAdminRoutes: RouteRecordRaw[] = isAdminEnabled
  ? [
      {
        path: '/ko/admin/login',
        name: 'admin-login-ko',
        component: AdminLoginPage,
        meta: {
          locale: 'ko',
          isAdminLogin: true,
        },
      },
      {
        path: '/ko/admin',
        name: 'admin-ko',
        component: AdminDashboardPage,
        meta: {
          locale: 'ko',
          requiresAdminAuth: true,
        },
      },
      {
        path: '/ko/admin/blog/:pathMatch(.*)*',
        redirect: '/ko/admin',
        meta: {
          locale: 'ko',
          requiresAdminAuth: true,
        },
      },
      {
        path: '/ko/admin/projects',
        name: 'admin-projects-ko',
        component: AdminProjectManagerPage,
        meta: {
          locale: 'ko',
          requiresAdminAuth: true,
        },
      },
      {
        path: '/ko/admin/projects/:id',
        name: 'admin-project-detail-ko',
        component: AdminProjectManagerPage,
        meta: {
          locale: 'ko',
          requiresAdminAuth: true,
        },
      },
      {
        path: '/ko/admin/portfolio',
        name: 'admin-portfolio-ko',
        component: AdminPortfolioManagerPage,
        meta: {
          locale: 'ko',
          requiresAdminAuth: true,
        },
      },
    ]
  : [
      {
        path: '/ko/admin/:pathMatch(.*)*',
        redirect: '/ko',
        meta: {
          locale: 'ko',
        },
      },
    ]

const enAdminRoutes: RouteRecordRaw[] = isAdminEnabled
  ? [
      {
        path: '/en/admin/login',
        name: 'admin-login-en',
        component: AdminLoginPage,
        meta: {
          locale: 'en',
          isAdminLogin: true,
        },
      },
      {
        path: '/en/admin',
        name: 'admin-en',
        component: AdminDashboardPage,
        meta: {
          locale: 'en',
          requiresAdminAuth: true,
        },
      },
      {
        path: '/en/admin/blog/:pathMatch(.*)*',
        redirect: '/en/admin',
        meta: {
          locale: 'en',
          requiresAdminAuth: true,
        },
      },
      {
        path: '/en/admin/projects',
        name: 'admin-projects-en',
        component: AdminProjectManagerPage,
        meta: {
          locale: 'en',
          requiresAdminAuth: true,
        },
      },
      {
        path: '/en/admin/projects/:id',
        name: 'admin-project-detail-en',
        component: AdminProjectManagerPage,
        meta: {
          locale: 'en',
          requiresAdminAuth: true,
        },
      },
      {
        path: '/en/admin/portfolio',
        name: 'admin-portfolio-en',
        component: AdminPortfolioManagerPage,
        meta: {
          locale: 'en',
          requiresAdminAuth: true,
        },
      },
    ]
  : [
      {
        path: '/en/admin/:pathMatch(.*)*',
        redirect: '/en',
        meta: {
          locale: 'en',
        },
      },
    ]

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
      path: '/admin/:pathMatch(.*)*',
      redirect: (to) => {
        if (!isAdminEnabled) {
          return '/ko'
        }

        const rest = Array.isArray(to.params.pathMatch)
          ? to.params.pathMatch.join('/')
          : String(to.params.pathMatch ?? '')
        const normalizedRest = rest.replace(/^\/+/, '')

        return normalizedRest ? `/ko/admin/${normalizedRest}` : '/ko/admin'
      },
    },
    {
      path: '/ko',
      name: 'portfolio-ko',
      component: PortfolioPage,
      meta: {
        locale: 'ko',
      },
    },
    {
      path: '/ko/stack',
      name: 'stack-ko',
      component: StackDetailPage,
      meta: {
        locale: 'ko',
      },
    },
    {
      path: '/ko/blog/:pathMatch(.*)*',
      name: 'legacy-blog-ko',
      component: ExternalRedirectPlaceholder,
      beforeEnter: redirectToExternalBlog,
      meta: {
        locale: 'ko',
      },
    },
    {
      path: '/ko/projects',
      name: 'projects-ko',
      component: ProjectsPage,
      meta: {
        locale: 'ko',
      },
    },
    ...koAdminRoutes,
    {
      path: '/en',
      name: 'portfolio-en',
      component: PortfolioPage,
      meta: {
        locale: 'en',
      },
    },
    {
      path: '/en/stack',
      name: 'stack-en',
      component: StackDetailPage,
      meta: {
        locale: 'en',
      },
    },
    {
      path: '/en/blog/:pathMatch(.*)*',
      name: 'legacy-blog-en',
      component: ExternalRedirectPlaceholder,
      beforeEnter: redirectToExternalBlog,
      meta: {
        locale: 'en',
      },
    },
    {
      path: '/en/projects',
      name: 'projects-en',
      component: ProjectsPage,
      meta: {
        locale: 'en',
      },
    },
    ...enAdminRoutes,
  ],
})

const resolveLocalePrefix = (path: string) => (path.startsWith('/en') ? '/en' : '/ko')
const isSafeRedirectPath = (value: string) => value.startsWith('/') && !value.startsWith('//')
const isAdminPath = (path: string) => /^\/(?:admin|(?:ko|en)\/admin)(?:\/|$)/.test(path)
const isAdminLoginPath = (path: string) =>
  /^\/(?:admin\/login|(?:ko|en)\/admin\/login)\/?$/.test(path)

router.beforeEach(async (to) => {
  if (!isAdminEnabled && isAdminPath(to.path)) {
    return resolveLocalePrefix(to.path)
  }

  const isAdminLoginRoute =
    to.matched.some((record) => record.meta.isAdminLogin) || isAdminLoginPath(to.path)
  const requiresAdminAuth =
    to.matched.some((record) => record.meta.requiresAdminAuth) ||
    (isAdminPath(to.path) && !isAdminLoginRoute)

  if (requiresAdminAuth) {
    if (isAdminAuthBypassed()) {
      return true
    }

    const isAuthenticated = await ensureAdminAuthenticated()

    if (isAuthenticated) {
      return true
    }

    return {
      path: `${resolveLocalePrefix(to.path)}/admin/login`,
      query: {
        redirect: to.fullPath,
      },
    }
  }

  if (isAdminLoginRoute) {
    if (isAdminAuthBypassed()) {
      return true
    }

    const isAuthenticated = await ensureAdminAuthenticated()

    if (!isAuthenticated) {
      return true
    }

    const redirectQuery = Array.isArray(to.query.redirect)
      ? to.query.redirect[0]
      : to.query.redirect

    if (typeof redirectQuery === 'string' && isSafeRedirectPath(redirectQuery)) {
      return redirectQuery
    }

    return `${resolveLocalePrefix(to.path)}/admin`
  }

  return true
})

export default router
