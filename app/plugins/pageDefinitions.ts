import { PAGE_MAP } from "#types"
import { usePageRegistry } from "rimelight-components/composables"

export default defineNuxtPlugin(() => {
    const { registerDefinitions } = usePageRegistry()

    registerDefinitions(PAGE_MAP)
})