export default {
  jsPlugins: [
    "./.rimelight-utilities/.oxlint/rimelight.js"
  ],
  ignorePatterns: [
    ".drizzle/",
    "src-tauri/",
    "backups/"
  ],
  rules: {
    "no-empty-pattern": "off",
    "rimelight/prefer-validated-getters": "warn",
    "rimelight/component-props-standard": "warn",
    "rimelight/component-emits-standard": "warn",
    "rimelight/iconify-standard-format": "warn",
    "rimelight/vue-sfc-structure": "warn"
  },
};