import { defineConfig } from "vite-plus"

export default defineConfig({
  server: {},

  build: {},

  preview: {},

  test: {},

  lint: {
    options: {
      typeAware: true,
      typeCheck: true
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

  staged: {
    "*": "vp check --fix"
  }
})
