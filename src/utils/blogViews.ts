export const getEstimatedViewCount = (id: string) => {
  const seed = [...id].reduce((acc, char) => acc + char.charCodeAt(0), 0)

  return 120 + (seed % 2400)
}
