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

  modules: [],

  ignore: ["**/src-tauri/**"],

  $development: {
    site: { indexable: false },
  },

  $production: {
    nitro: {
      scheduledTasks: {
        // Daily at midnight
        "0 0 * * *": ["cleanup-notes-trash", "cleanup-todos-archived"],
      },
  routeRules: {
    "/documents/**": { isr: true },
    "/blog/**": { isr: true },
    "/dashboard/**": {
      ssr: false,
      appLayout: "dashboard",
    },
    "/store/**": {
      appLayout: "store",
    },
    "/franchises/grand-tale/**": {
      appLayout: "grand-tale",
    },
      },
    },
    site: {
      url: "https://rimelight.com",
      // Switch to true on release
      indexable: false
    }
  },

  vite: {
    envPrefix: ["TAURI_"],
    server: {
      watch: {
        ignored: ["**/src-tauri/**"],
      },
    },
  },

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
      titleTemplate: "%s | Rimelight Entertainment",
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
        {
          rel: "preconnect",
          href: "https://cdn.rimelight.com",
        },
        {
          rel: "dns-prefetch",
          href: "https://cdn.rimelight.com",
        },
      ],
    },
  },

  security: {
    headers: {
      contentSecurityPolicy: {
        "img-src": ["'self'", "data:", "https://cdn.rimelight.com", "https://i.ytimg.com", "https://*.youtube.com"],
        "connect-src": ["'self'", "https://rimelight.com", "https://*.youtube.com"],
        "frame-src": ["'self'", "https://www.youtube.com", "https://www.youtube-nocookie.com"],
        "script-src": ["'self'", "https:", "'unsafe-inline'", "'strict-dynamic'", "'nonce-{{nonce}}'", "https://www.youtube.com", "https://s.ytimg.com"]
      }
    }
  },

  i18n: {
    strategy: "prefix_except_default",
    defaultLocale: "en",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      cookieSecure: true,
      alwaysRedirect: false,
    },
    locales: [
      //{
      //  code: "ar",
      //  name: "العربية",
      //  file: "ar.json"
      //},
      {
        code: "en",
        name: "English",
        language: "en-US",
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
      {
        code: "pt",
        name: "Português",
        language: "pt-BR",
        file: "pt.json",
      },
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

  fonts: {
    families: [],
  },

  icon: {
    customCollections: [],
  },

  image: {
    domains: ["rimelight.com"],
    cloudflare: {
      baseURL: "https://cdn.rimelight.com",
    },
  },

  studio: {
    repository: {
      owner: "Rimelight-Entertainment",
      repo: "rimelight.com",
    },
  },

  llms: {
    domain: "https://rimelight.com",
    title: "Rimelight Entertainment",
    description: "Tell your story.",
  },

  ui: {
    theme: {
      colors: [
        "grandTalePrimary",
        "grandTaleSecondary",
      ]
    }
  }
});
