import { fileURLToPath } from "node:url";
import { existsSync, readdirSync } from "node:fs";
import { resolve, basename } from "node:path";
import { addBlockMapTemplates, addEditorBlockMapTemplates } from "./scripts/templates";

const currentDir = fileURLToPath(new URL(".", import.meta.url));

export default defineNuxtConfig({
  compatibilityDate: "2026-02-13",
  future: {
    compatibilityVersion: 5,
  },
  experimental: { nitroAutoImports: true },

  modules: [
    "@nuxtjs/i18n",
    "@nuxt/image",
    "@nuxt/ui",
    "@nuxt/scripts",
    "@vueuse/nuxt",
    function (options, nuxt) {
      const resolvePath = (path: string) => resolve(currentDir, path);

      // Scan the directory for all .vue files
      const blockRendererPath = resolvePath("./app/components/article/blocks/renderer");
      if (existsSync(blockRendererPath)) {
        const blockRendererFiles = readdirSync(blockRendererPath).filter((name) =>
          name.endsWith(".vue"),
        );

        // Generate a clean list of component names
        const blockRendererNames = blockRendererFiles.map((file) => {
          const baseName = basename(file, ".vue"); // e.g., 'SectionBlockRenderer'
          return baseName.replace(/Renderer$/, ""); // e.g., 'SectionBlock'
        });

        // Generate the Component Map Template
        const blockRendererTemplate = addBlockMapTemplates(blockRendererNames, currentDir);

        // Expose the map template to the runtime via an alias
        nuxt.options.alias["#build/rimelight-block-renderer-map"] = blockRendererTemplate.dst;
      }

      const blockEditorPath = resolvePath("./app/components/article/blocks/editor");
      if (existsSync(blockEditorPath)) {
        const blockEditorFiles = readdirSync(blockEditorPath).filter((name) =>
          name.endsWith(".vue"),
        );

        // Generate a clean list of component names
        const blockEditorNames = blockEditorFiles.map((file) => {
          const baseName = basename(file, ".vue"); // e.g., 'SectionBlockEditor'
          return baseName.replace(/Editor$/, ""); // e.g., 'SectionBlock'
        });

        // Generate the Component Map Template
        const blockEditorTemplate = addEditorBlockMapTemplates(blockEditorNames, currentDir);

        // Expose the map template to the runtime via an alias
        nuxt.options.alias["#build/rimelight-block-editor-map"] = blockEditorTemplate.dst;
      }

      // Register type definitions
      nuxt.hook("prepare:types", ({ references }) => {
        references.push({ path: resolvePath("./app/types/app.config.d.ts") });
      });
    },
  ],

  ignore: [],

  $development: {
    devtools: { enabled: false },
    // Change to true in case the issue gets resolved: https://github.com/fi3ework/vite-plugin-checker/issues/557
    typescript: { typeCheck: false },
    site: { indexable: false },
  },

  $test: {
    devtools: { enabled: true },
  },

  $production: {
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
      disallow: ["/dashboard"],
    },
    a11y: {
      enabled: false,
    },
  },

  ssr: true,
  router: {
    options: {
      scrollBehaviorType: "smooth",
    },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "https://rimelight.com",
    },
  },
  app: {
    baseURL: "/",
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
  alias: {
    "#types": fileURLToPath(new URL("./app/types", import.meta.url)),
    "#validators": fileURLToPath(new URL("./shared/validators", import.meta.url)),
    "drizzle-orm": fileURLToPath(new URL("./node_modules/drizzle-orm", import.meta.url)),
    "#utils": fileURLToPath(new URL("./shared/utils", import.meta.url)),
    "#auth": fileURLToPath(new URL("./shared/auth", import.meta.url)),
    "#db": fileURLToPath(new URL("./server/db/schema", import.meta.url)),
    "#composables": fileURLToPath(new URL("./app/composables", import.meta.url)),
  },
  vite: {
    clearScreen: false,
    envPrefix: ["VITE_"],
    server: {
      strictPort: true,
      hmr: {
        protocol: "ws",
        host: "127.0.0.1",
        port: 3000,
      },
    },
    optimizeDeps: {
      include: ["@vue/devtools-core", "@vue/devtools-kit"],
    },
  },

  nitro: {
    preset: "cloudflare_module",
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
    routeRules: {
      "/documents/**": { isr: 3600 },
      "/blog/**": { isr: 3600 },
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
    name: "Rimelight Entertainment",
    indexable: false,
  },

  i18n: {
    strategy: "prefix_except_default",
    defaultLocale: "en",
    langDir: "locales",
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
      {
        code: "pt",
        name: "Português",
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
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      cookieSecure: true,
      alwaysRedirect: false,
    },
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
    {
      path: "~/app/components",
      pathPrefix: false,
      prefix: "RL",
    },
  ],

  pages: {
    pattern: ["**/*.vue", "!**/components/**"],
  },

  colorMode: {
    preference: "system",
    fallback: "dark",
    dataValue: "theme",
  },

  image: {
    format: ["webp"],
    provider: "cloudflare",
    cloudflare: {
      baseURL: "https://cdn.rimelight.com",
    },
  },

  icon: {
    mode: "svg",
    class: "icon",
    size: "24px",
    customCollections: [
      {
        prefix: "first-party",
        dir: "./app/assets/icons/first-party",
        normalizeIconName: false,
      },
      {
        prefix: "logos",
        dir: "./app/assets/icons/first-party/logos",
        normalizeIconName: false,
      },
      {
        prefix: "third-party",
        dir: "./app/assets/icons/third-party",
        normalizeIconName: false,
      },
    ],
  },

  ui: {
    prefix: "U",
    content: true,
    prose: true,
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
        "source",
      ],
    },
  },
});
