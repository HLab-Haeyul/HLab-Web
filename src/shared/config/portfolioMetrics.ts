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

export const isPortfolioMetricsApiEnabled = () => {
  const explicit = (import.meta.env.VITE_PORTFOLIO_METRICS_API_ENABLED as string | undefined)?.trim()

  if (explicit) {
    const parsed = parseBooleanEnv(explicit)

    if (parsed !== null) {
      return parsed
    }
  }

  return true
}
