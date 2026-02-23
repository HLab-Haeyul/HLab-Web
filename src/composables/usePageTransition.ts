import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export const usePageTransition = () => {
  const route = useRoute()
  const transitionName = ref('page-fade')

  const isStackPath = (path: string) => path.endsWith('/stack')

  watch(
    () => route.path,
    (to, from) => {
      const toStack = isStackPath(to)
      const fromStack = isStackPath(from)

      if (!fromStack && toStack) {
        transitionName.value = 'page-stack-forward'
        return
      }

      if (fromStack && !toStack) {
        transitionName.value = 'page-stack-backward'
        return
      }

      transitionName.value = 'page-fade'
    },
  )

  return { transitionName }
}
