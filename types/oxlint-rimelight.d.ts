// Extend oxlint types to include custom rimelight rules
declare module "oxlint" {
  interface DummyRuleMap {
    // Rimelight custom rules
    "rimelight/prefer-validated-getters"?: import("oxlint").DummyRule;
    "rimelight/component-props-standard"?: import("oxlint").DummyRule;
    "rimelight/component-emits-standard"?: import("oxlint").DummyRule;
    "rimelight/iconify-standard-format"?: import("oxlint").DummyRule;
    "rimelight/vue-sfc-structure"?: import("oxlint").DummyRule;
  }
}
