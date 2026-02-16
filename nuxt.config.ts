import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const isTauri = process.env.NUXT_APP_TARGET === "tauri";

const currentDir = fileURLToPath(new URL(".", import.meta.url));
const localLayerPath = resolve(currentDir, "../rimelight-components");
const isLocalLayer = existsSync(localLayerPath);

export default defineNuxtConfig({
  extends: [
    [
      isLocalLayer ? localLayerPath : "github:Rimelight-Entertainment/rimelight-components",
      { install: true },
    ],
  ],
  compatibilityDate: "2026-02-13",
  $env: {
    development: {
      devtools: { enabled: true },
      devServer: { host: "127.0.0.1", port: 3000 },
      typescript: { typeCheck: false },
      site: { indexable: false },
    },
    testing: {
      devtools: { enabled: false },
    },
    staging: {
      devtools: { enabled: true },
      site: { url: "https://staging.rimelight.com", indexable: false },
      nitro: {
        sourceMap: true,
      },
    },
    production: {
      devtools: { enabled: false },
      typescript: { typeCheck: false },
      nitro: {
        compressPublicAssets: true,
        minify: true,
      },
      // Switch to true on release
      site: { url: "https://rimelight.com", indexable: false },
      robots: {
        blockAiBots: true,
        blockNonSeoBots: true,
        disallow: ["/internal"],
      },
    },
  },
  ssr: !isTauri,
  router: {
    options: {
      hashMode: isTauri,
    },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "https://rimelight.com",
      isTauri,
    },
  },
  app: {
    baseURL: isTauri ? "" : "/",
    head: {
      title: "Rimelight Entertainment",
      titleTemplate: "%s | rimelight.com",
      meta: [
        {
          name: "description",
          content: "Tell your story.",
        },
        {
          name: "author",
          content: "Rimelight Entertainment",
        },
        {
          name: "creator",
          content: "Rimelight Entertainment",
        },
      ],
      link: [
        {
          rel: "icon",
          type: "image/svg+xml",
          href: "/favicon.svg",
        },
      ],
    },
    viewTransition: true,
  },
  modules: [
    "@pinia/nuxt",
    "@pinia/colada-nuxt",
    ...(!isTauri ? ["@nuxtjs/sitemap", "@nuxtjs/robots", "nuxt-og-image"] : []),
  ],
  alias: {
    "#types": fileURLToPath(new URL("./app/types", import.meta.url)),
    "#validators": fileURLToPath(new URL("./shared/validators", import.meta.url)),
    "drizzle-orm": fileURLToPath(new URL("./node_modules/drizzle-orm", import.meta.url)),
    ...(isLocalLayer
      ? {
        "#rimelight-components/types": resolve(localLayerPath, "app/types"),
        "#rimelight-components/utils": resolve(localLayerPath, "app/utils"),
        "#rimelight-components/validators": resolve(localLayerPath, "shared/validators"),
        "#rimelight-components/auth": resolve(localLayerPath, "shared/auth"),
        "#rimelight-components/db": resolve(localLayerPath, "shared/db"),
        "rimelight-components": localLayerPath,
      }
      : {}),
  },
  vite: {
    clearScreen: false,
    envPrefix: ["VITE_", "TAURI_"],
    server: {
      strictPort: true,
      hmr: {
        protocol: "ws",
        host: "127.0.0.1",
        port: 3000,
      },
      watch: {
        ignored: ["**/src-tauri/**"],
      },
    },
  },
  ignore: ["**/src-tauri/**"],
  nitro: {
    preset: isTauri ? "node" : "cloudflare_module",
    ...(!isTauri
      ? {
        cloudflare: {
          deployConfig: true,
          nodeCompat: true,
        },
      }
      : {}),
    experimental: {
      websocket: true,
      tasks: true,
    },
    scheduledTasks: {
      // Run every 5 minutes
      // '*/5 * * * *': ['cache:cleanup'],

      // Daily at midnight
      "0 0 * * *": ["cleanup-notes-trash", "cleanup-todos-archived"],

      // Weekly on Sunday at 2 AM
      // '0 2 * * 0': ['db:optimize']
    },
    prerender: {
      //crawlLinks: true
    },
    routeRules: {
      //"/": { prerender: true },
      "/documents/**": { isr: 3600 },
      "/blog/**": { isr: 3600 },
      "/internal/**": { ssr: false },
    },
  },
  ...(!isTauri
    ? {
      site: {
        url: "https://rimelight.com",
        name: "Rimelight Entertainment",
        indexable: false,
      },
      robots: {
        blockAiBots: false,
        blockNonSeoBots: false,
        disallow: ["/internal"],
      },
    }
    : {}),
  css: ["~/assets/css/main.css"],
  components: [
    {
      path: "~/components",
      pathPrefix: false,
      prefix: "RL",
    },
    {
      path: "~/pages",
      pattern: "**/components/**",
      pathPrefix: false,
      prefix: "RL",
    },
  ],
  pages: {
    pattern: ["**/*.vue", "!**/components/**"],
  },

  icon: {
    class: "icon",
    size: "24px",
    customCollections: [
      {
        prefix: "first-party",
        dir: "./app/assets/icons/first-party",
        normalizeIconName: false,
      },
      {
        prefix: "third-party",
        dir: "./app/assets/icons/third-party",
        normalizeIconName: false,
      },
    ],
  },
  image: {
    format: ["webp"],
    provider: "cloudflare",
    cloudflare: {
      baseURL: "https://cdn.rimelight.com",
    },
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
        file: "en.json",
      },
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
    ],
  },
  future: {
    compatibilityVersion: 5,
  },
});
