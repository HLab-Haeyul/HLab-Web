import { createRouter, createWebHistory } from 'vue-router'
import PortfolioView from '../views/PortfolioView.vue'
import StackDetailView from '../views/StackDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
  ],
})

export default router
