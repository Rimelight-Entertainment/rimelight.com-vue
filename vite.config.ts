import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { defineVitestProject } from "@nuxt/test-utils/config"
import { playwright } from "@vitest/browser-playwright"
import { defineConfig } from "vite-plus"

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  server: {},
  build: {},
  preview: {},
  test: {
    projects: [
      {
        test: {
          name: "unit",
          include: ["test/unit/*.{test,spec}.ts"],
          environment: "node"
        }
      },
      await defineVitestProject({
        test: {
          name: "nuxt",
          include: ["test/nuxt/*.{test,spec}.ts"],
          environment: "nuxt",
          environmentOptions: {
            nuxt: {
              rootDir: fileURLToPath(new URL(".", import.meta.url))
            }
          },
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }]
          }
        }
      }),
      {
        test: {
          name: "e2e",
          include: ["test/e2e/*.{test,spec}.ts"],
          environment: "node"
        }
      }
    ],
    coverage: {
      enabled: true,
      provider: "v8"
    }
  },
  lint: {
    jsPlugins: [resolve(__dirname, "./.oxlint/rimelight.js")],
    ignorePatterns: [
      "dist/**",
      ".agent/",
      "AGENTS.md",
      "CLAUDE.md",
      "GEMINI.md",
      ".drizzle/",
      "src-tauri/"
    ],
    options: {
      typeAware: true,
      typeCheck: true
    },
    rules: {
      "no-empty-pattern": "off",
      "rimelight/prefer-validated-getters": "warn",
      "rimelight/component-emits-standard": "warn",
      "rimelight/component-props-standard": "warn",
      "rimelight/iconify-standard-format": "warn",
      "rimelight/vue-component-structure": "warn",
      "rimelight/vue-page-structure": "warn"
    }
  },
  fmt: {
    ignorePatterns: [".agent/", "AGENTS.md", "CLAUDE.md", "GEMINI.md", ".drizzle/", "src-tauri/"],
    printWidth: 100,
    tabWidth: 2,
    useTabs: false,
    semi: false,
    singleQuote: false,
    trailingComma: "none",
    bracketSpacing: true,
    insertFinalNewline: true,
    experimentalSortPackageJson: true
  },
  run: {},
  pack: {},
  staged: {}
})
