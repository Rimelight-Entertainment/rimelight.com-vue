import { useRoute, useState } from "#imports"
import { watch } from "vue"

export const useDashboard = () => {
  const route = useRoute()

  const isNotificationsSlideoverOpen = useState<boolean>(
    "dashboard:notificationsSlideover",
    () => false
  )

  watch(
    () => route.fullPath,
    () => {
      isNotificationsSlideoverOpen.value = false
    }
  )

  return {
    isNotificationsSlideoverOpen
  }
}
