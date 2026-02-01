import {fileURLToPath} from "node:url"

const isTauri = process.env.NUXT_APP_TARGET === "tauri"

export default defineNuxtConfig({
  $env: {
    development: {
      devtools: { enabled: true },
      devServer: { host: "127.0.0.1", port: 3000 },
      typescript: { typeCheck: true },
      site: { indexable: false }
    },
    testing: {
      devtools: { enabled: false }
    },
    staging: {
      devtools: { enabled: true },
      site: { url: "https://staging.rimelight.com", indexable: false },
      nitro: {
        sourceMap: true
      }
    },
    production: {
      devtools: { enabled: false },
      typescript: { typeCheck: false },
      nitro: {
        compressPublicAssets: true,
        minify: true
      },
      // Switch to true on release
      site: { url: "https://rimelight.com", indexable: false },
      robots: {
        blockAiBots: true,
        blockNonSeoBots: true,
        disallow: ["/internal"]
      }
    }
  },
  ssr: !isTauri,
  router: {
    options: {
      hashMode: isTauri
    }
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "https://rimelight.com",
      isTauri
    }
  },
  app: {
    baseURL: isTauri ? "" : "/",
    head: {
      title: "Rimelight Entertainment",
      titleTemplate: "%s | rimelight.com",
      meta: [
        {
          name: "description",
          content: "Tell your story."
        },
        {
          name: "author",
          content: "Rimelight Entertainment"
        },
        {
          name: "creator",
          content: "Rimelight Entertainment"
        }
      ],
      link: [
        {
          rel: "icon",
          type: "image/svg+xml",
          href: "/favicon.svg"
        }
      ]
    },
    viewTransition: true
  },
  modules: [
    "rimelight-components",
    "@nuxt/ui",
    "@nuxtjs/device",
    "@nuxtjs/i18n",
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "@pinia/colada-nuxt",
    ...(!isTauri ? ["@nuxtjs/sitemap", "@nuxtjs/robots", "nuxt-og-image"] : [])
  ],
  compatibilityDate: "2025-01-01",
  alias: {
    openpgp: "openpgp/dist/openpgp.min.mjs",
    "#types": fileURLToPath(new URL("./app/types", import.meta.url)),
    "#validators": fileURLToPath(new URL("./shared/validators", import.meta.url))
  },
  vite: {
    resolve: {
      alias: {
        openpgp: "openpgp/dist/openpgp.min.mjs"
      }
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true
      }
    },
    clearScreen: false,
    envPrefix: ["VITE_", "TAURI_"],
    server: {
      strictPort: true,
      hmr: {
        protocol: "ws",
        host: "127.0.0.1",
        port: 3000
      },
      watch: {
        ignored: ["**/src-tauri/**"]
      }
    }
  },
  ignore: ["**/src-tauri/**"],
  nitro: {
    preset: isTauri ? "node" : "cloudflare_module",
    alias: {
      worker_threads: "unenv/runtime/mock/empty",
      "node:worker_threads": "unenv/runtime/mock/empty"
    },
    externals: {
      external: ["openpgp"]
    },
    ...(!isTauri
      ? {
          cloudflare: {
            deployConfig: true,
            nodeCompat: true
          }
        }
      : {}),
    experimental: {
      websocket: true
    },
    prerender: {
      //crawlLinks: true
    },
    routeRules: {
      //"/": { prerender: true },
      "/documents/**": { isr: 3600 },
      "/blog/**": { isr: 3600 },
      "/internal/**": { ssr: false }
    }
  },
  ...(!isTauri
    ? {
        site: {
          url: "https://rimelight.com",
          name: "Rimelight Entertainment",
          indexable: false
        },
        robots: {
          blockAiBots: false,
          blockNonSeoBots: false,
          disallow: ["/internal"]
        }
      }
    : {}),
  css: ["~/assets/css/main.css"],
  components: [
    {
      path: "~/components",
      pathPrefix: false,
      prefix: "RL"
    },
    {
      path: "~/pages",
      pattern: "**/components/**",
      pathPrefix: false,
      prefix: "RL"
    }
  ],
  pages: {
    pattern: ["**/*.vue", "!**/components/**"]
  },
  colorMode: {
    preference: "dark",
    fallback: "dark"
  },
  fonts: {
    defaults: {
      weights: [
        // Thin
        100,
        // ExtraLight
        200,
        // Light
        300,
        // Regular
        400,
        // Medium
        500,
        // SemiBold
        600,
        // Bold
        700,
        // Extra Bold
        800
      ],
      styles: ["normal", "italic"]
    },
    families: [
      {
        name: "JetBrains Mono",
        global: true,
        provider: "local"
      }
    ]
  },
  icon: {
    provider: "server",
    class: "icon",
    size: "24px",
    mode: "svg",
    customCollections: [
      {
        prefix: "first-party",
        dir: "./app/assets/icons/first-party",
        normalizeIconName: false
      },
      {
        prefix: "third-party",
        dir: "./app/assets/icons/third-party",
        normalizeIconName: false
      }
    ]
  },
  image: {
    format: ["webp"],
    provider: "cloudflare",
    cloudflare: {
      baseURL: "https://cdn.rimelight.com"
    }
  },
  i18n: {
    strategy: "prefix_except_default",
    defaultLocale: "en",
    locales: [
      //{
      //  code: "ar",
      //  name: "العربية",
      //  file: "ar.json"
      //},
      {
        code: "en",
        name: "English",
        file: "en.json"
      }
      //{
      //  code: "es",
      //  name: "Español",
      //  file: "es.json"
      //},
      //{
      //  code: "fr",
      //  name: "Français",
      //  file: "fr.json"
      //},
      //{
      //  code: "ja",
      //  name: "日本語",
      //  file: "ja.json"
      //},
      //{
      //  code: "ko",
      //  name: "한국어",
      //  file: "ko.json"
      //},
      //{
      //  code: "pt",
      //  name: "Português",
      //  file: "pt.json"
      //}
      //{
      //  code: "ro",
      //  name: "Română",
      //  file: "ro.json"
      //},
      //{
      //  code: "zh_cn",
      //  name: "简体中文",
      //  file: "zh_cn.json"
      //}
    ]
  },
  ui: {
    prefix: "U",
    theme: {
      colors: [
        "neutral",
        "primary",
        "secondary",
        "info",
        "success",
        "warning",
        "error",
        "commentary",
        "ideation",
        "source"
      ]
    }
  },
  future: {
    compatibilityVersion: 5
  },
  experimental: {
    viteEnvironmentApi: true,
    typescriptPlugin: true
    //typedPages: true
  }
})
