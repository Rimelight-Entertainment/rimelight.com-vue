import { componentEmitsStandard } from "./rules/componentEmitsStandard.js"
import { componentPropsStandard } from "./rules/componentPropsStandard.js"
import { iconifyStandardFormat } from "./rules/iconifyStandardFormat.js"
import { preferValidatedGetters } from "./rules/preferValidatedGetters.js"
import { vueComponentStructure } from "./rules/vueComponentStructure.js"
import { vuePageStructure } from "./rules/vuePageStructure.js"

export default {
  meta: {
    name: "rimelight"
  },
  rules: {
    "component-props-standard": componentPropsStandard,
    "component-emits-standard": componentEmitsStandard,
    "prefer-validated-getters": preferValidatedGetters,
    "iconify-standard-format": iconifyStandardFormat,
    "vue-component-structure": vueComponentStructure,
    "vue-page-structure": vuePageStructure
  }
}
