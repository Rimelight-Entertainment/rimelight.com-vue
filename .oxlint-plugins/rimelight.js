import { definePlugin } from "oxlint"
import { noTopLevelRef } from "./rules/noTopLevelRef.js"
import { componentPropsStandard } from "./rules/componentPropsStandard.js"
import { preferValidatedGetters } from "./rules/preferValidatedGetters.js"

export default definePlugin({
  meta: {
    name: "rimelight"
  },
  rules: {
    "no-top-level-ref": noTopLevelRef,
    "component-props-standard": componentPropsStandard,
    "prefer-validated-getters": preferValidatedGetters
  }
})
