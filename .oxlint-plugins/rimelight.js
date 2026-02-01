import {definePlugin} from "oxlint"
import {componentPropsStandard} from "./rules/componentPropsStandard.js"
import {preferValidatedGetters} from "./rules/preferValidatedGetters.js"

export default definePlugin({
    meta: {
        name: "rimelight"
    },
    rules: {
        "component-props-standard": componentPropsStandard,
        "prefer-validated-getters": preferValidatedGetters
    }
})
