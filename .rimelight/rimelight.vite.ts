import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { defineVitestProject } from "@nuxt/test-utils/config"
import { playwright } from "vite-plus/test/browser-playwright"

const __dirname = dirname(fileURLToPath(import.meta.url))

export const rimelightViteConfig = {
  server: {},
  build: {},
  preview: {},
  test: {
    projects: [
      {
        resolve: {
          alias: {
            "~": resolve(__dirname, "..", "app"),
            "#shared": resolve(__dirname, "..", "shared"),
            "#server": resolve(__dirname, "..", "server")
          }
        },
        test: {
          name: "unit",
          include: ["test/unit/**/*.{test,spec}.ts"],
          environment: "node"
        }
      },
      await defineVitestProject({
        test: {
          name: "nuxt",
          include: ["test/nuxt/**/*.{test,spec}.ts"],
          environment: "nuxt",
          environmentOptions: {
            nuxt: {
              rootDir: fileURLToPath(new URL("..", import.meta.url)),
              overrides: {
                vue: {
                  runtimeCompiler: true
                },
                experimental: {
                  payloadExtraction: false,
                  viteEnvironmentApi: false
                },
                pwa: {
                  pwaAssets: { disabled: true }
                },
                ogImage: { enabled: false }
              }
            }
          },
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: "chromium", headless: true }]
          }
        }
      })
    ],
    coverage: {
      enabled: true,
      provider: "v8",
      exclude: ["**/node_modules/**", "dist/**", ".agent/**", "src-tauri/**"]
    }
  },
  lint: {
    jsPlugins: [resolve(__dirname, "..", ".oxlint", "rimelight.js")],
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
}
