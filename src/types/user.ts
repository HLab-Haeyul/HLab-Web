export const USER_ROLE_VALUES = ['admin', 'teamate', 'guest'] as const

export type UserRole = (typeof USER_ROLE_VALUES)[number]

export type AuthenticatedUser = {
  phoneNumber: string
  role: UserRole
}

export const normalizeUserRole = (value: unknown, fallback: UserRole = 'guest'): UserRole => {
  if (typeof value !== 'string') {
    return fallback
  }

  return USER_ROLE_VALUES.find((role) => role === value) ?? fallback
}

export const hasAdminRole = (role: UserRole | null | undefined) => role === 'admin'
