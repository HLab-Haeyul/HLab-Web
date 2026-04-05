import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    locale?: 'ko' | 'en'
    requiresAdminAuth?: boolean
    isAdminLogin?: boolean
  }
}
