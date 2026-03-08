import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { defineConfig } from "oxlint"

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  jsPlugins: [
    resolve(__dirname, "./.oxlint/rimelight.js")
  ],
  ignorePatterns: [
    ".drizzle/",
    "src-tauri/",
    "backups/"
  ],
  rules: {
    "no-empty-pattern": "off",
    "rimelight/prefer-validated-getters": "warn",
    "rimelight/component-emits-standard": "warn",
    "rimelight/component-props-standard": "warn",
    "rimelight/iconify-standard-format": "warn",
    "rimelight/vue-component-structure": "warn",
    "rimelight/vue-page-structure": "warn"
  }
})
