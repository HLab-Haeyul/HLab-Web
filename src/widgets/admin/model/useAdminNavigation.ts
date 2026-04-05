import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminAuth } from '@/features/auth/admin-session'
import { useLocale } from '@/shared/lib/routing'
import type { AdminNavItem } from '@/widgets/admin'

export const useAdminNavigation = () => {
  const { route, adminPath, adminProjectPath, adminPortfolioPath } = useLocale()
  const router = useRouter()
  const { logout } = useAdminAuth()

  const adminLoginPath = computed(() => `${adminPath.value}/login`)

  const navItems = computed<AdminNavItem[]>(() => [
    {
      id: 'admin-nav-projects',
      label: '프로젝트 관리',
      to: adminProjectPath.value,
    },
    {
      id: 'admin-nav-portfolio',
      label: '포트폴리오 관리',
      to: adminPortfolioPath.value,
    },
  ])

  const activePath = computed(() => route.path)

  const handleLogout = async () => {
    await logout()
    await router.replace(adminLoginPath.value)
  }

  return {
    navItems,
    activePath,
    handleLogout,
  }
}
