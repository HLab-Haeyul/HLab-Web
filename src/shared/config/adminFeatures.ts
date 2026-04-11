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

export const isAdminFeatureEnabled = () => {
  const explicit = (import.meta.env.VITE_ADMIN_ENABLED as string | undefined)?.trim()

  if (!explicit) {
    return true
  }

  const parsed = parseBooleanEnv(explicit)
  return parsed ?? true
}
