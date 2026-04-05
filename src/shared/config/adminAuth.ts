import type { AuthenticatedUser } from '@/entities/user'

const parseBooleanEnv = (value: string) => {
  const normalized = value.trim().toLowerCase()

  if (['1', 'true', 'yes', 'on'].includes(normalized)) {
    return true
  }

  if (['0', 'false', 'no', 'off'].includes(normalized)) {
    return false
  }

  return null
}

const ADMIN_BYPASS_PROFILE: AuthenticatedUser = {
  phoneNumber: 'test-admin',
  role: 'admin',
}

export const isAdminAuthBypassed = () => {
  const explicit = (import.meta.env.VITE_ADMIN_AUTH_BYPASS as string | undefined)?.trim()

  if (!explicit) {
    return false
  }

  const parsed = parseBooleanEnv(explicit)
  return parsed ?? false
}

export const getAdminBypassProfile = () => ADMIN_BYPASS_PROFILE
