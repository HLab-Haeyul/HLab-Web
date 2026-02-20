export const getEstimatedViewCount = (slug: string) => {
  const seed = [...slug].reduce((acc, char) => acc + char.charCodeAt(0), 0)

  return 120 + (seed % 2400)
}
