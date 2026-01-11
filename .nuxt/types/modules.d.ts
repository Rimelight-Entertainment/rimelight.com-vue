import { NuxtModule, ModuleDependencyMeta } from '@nuxt/schema'
declare module '@nuxt/schema' {
  interface ModuleDependencies {
    ["rimelight-components"]?: ModuleDependencyMeta<typeof import("rimelight-components").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxt/icon"]?: ModuleDependencyMeta<typeof import("@nuxt/icon").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxt/fonts"]?: ModuleDependencyMeta<typeof import("@nuxt/fonts").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxtjs/color-mode"]?: ModuleDependencyMeta<typeof import("@nuxtjs/color-mode").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxt/ui"]?: ModuleDependencyMeta<typeof import("@nuxt/ui").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxtjs/device"]?: ModuleDependencyMeta<typeof import("@nuxtjs/device").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxtjs/i18n"]?: ModuleDependencyMeta<typeof import("@nuxtjs/i18n").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@vueuse/nuxt"]?: ModuleDependencyMeta<typeof import("@vueuse/nuxt").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@pinia/nuxt"]?: ModuleDependencyMeta<typeof import("@pinia/nuxt").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@pinia/colada-nuxt"]?: ModuleDependencyMeta<typeof import("@pinia/colada-nuxt").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["nuxt-site-config"]?: ModuleDependencyMeta<typeof import("nuxt-site-config").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxtjs/sitemap"]?: ModuleDependencyMeta<typeof import("@nuxtjs/sitemap").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxtjs/robots"]?: ModuleDependencyMeta<typeof import("@nuxtjs/robots").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["nuxt-og-image"]?: ModuleDependencyMeta<typeof import("nuxt-og-image").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxt/devtools"]?: ModuleDependencyMeta<typeof import("@nuxt/devtools").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxt/telemetry"]?: ModuleDependencyMeta<typeof import("@nuxt/telemetry").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@dxup/nuxt"]?: ModuleDependencyMeta<typeof import("@dxup/nuxt").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxt/image"]?: ModuleDependencyMeta<typeof import("@nuxt/image").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
  }
  interface NuxtOptions {
    /**
     * Configuration for `rimelight-components`
     */
    ["rimelightComponents"]: typeof import("rimelight-components").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/icon`
     */
    ["icon"]: typeof import("@nuxt/icon").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/fonts`
     */
    ["fonts"]: typeof import("@nuxt/fonts").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxtjs/color-mode`
     */
    ["colorMode"]: typeof import("@nuxtjs/color-mode").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/ui`
     */
    ["ui"]: typeof import("@nuxt/ui").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxtjs/device`
     */
    ["device"]: typeof import("@nuxtjs/device").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxtjs/i18n`
     */
    ["i18n"]: typeof import("@nuxtjs/i18n").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@vueuse/nuxt`
     */
    ["vueuse"]: typeof import("@vueuse/nuxt").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@pinia/nuxt`
     */
    ["pinia"]: typeof import("@pinia/nuxt").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@pinia/colada-nuxt`
     */
    ["colada"]: typeof import("@pinia/colada-nuxt").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `nuxt-site-config`
     */
    ["site"]: typeof import("nuxt-site-config").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxtjs/sitemap`
     */
    ["sitemap"]: typeof import("@nuxtjs/sitemap").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxtjs/robots`
     */
    ["robots"]: typeof import("@nuxtjs/robots").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `nuxt-og-image`
     */
    ["ogImage"]: typeof import("nuxt-og-image").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/devtools`
     */
    ["devtools"]: typeof import("@nuxt/devtools").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/telemetry`
     */
    ["telemetry"]: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@dxup/nuxt`
     */
    ["dxup"]: typeof import("@dxup/nuxt").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/image`
     */
    ["image"]: typeof import("@nuxt/image").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
  }
  interface NuxtConfig {
    /**
     * Configuration for `rimelight-components`
     */
    ["rimelightComponents"]?: typeof import("rimelight-components").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/icon`
     */
    ["icon"]?: typeof import("@nuxt/icon").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/fonts`
     */
    ["fonts"]?: typeof import("@nuxt/fonts").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxtjs/color-mode`
     */
    ["colorMode"]?: typeof import("@nuxtjs/color-mode").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/ui`
     */
    ["ui"]?: typeof import("@nuxt/ui").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxtjs/device`
     */
    ["device"]?: typeof import("@nuxtjs/device").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxtjs/i18n`
     */
    ["i18n"]?: typeof import("@nuxtjs/i18n").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@vueuse/nuxt`
     */
    ["vueuse"]?: typeof import("@vueuse/nuxt").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@pinia/nuxt`
     */
    ["pinia"]?: typeof import("@pinia/nuxt").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@pinia/colada-nuxt`
     */
    ["colada"]?: typeof import("@pinia/colada-nuxt").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `nuxt-site-config`
     */
    ["site"]?: typeof import("nuxt-site-config").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxtjs/sitemap`
     */
    ["sitemap"]?: typeof import("@nuxtjs/sitemap").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxtjs/robots`
     */
    ["robots"]?: typeof import("@nuxtjs/robots").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `nuxt-og-image`
     */
    ["ogImage"]?: typeof import("nuxt-og-image").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/devtools`
     */
    ["devtools"]?: typeof import("@nuxt/devtools").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/telemetry`
     */
    ["telemetry"]?: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@dxup/nuxt`
     */
    ["dxup"]?: typeof import("@dxup/nuxt").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/image`
     */
    ["image"]?: typeof import("@nuxt/image").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    modules?: (undefined | null | false | NuxtModule<any> | string | [NuxtModule | string, Record<string, any>] | ["rimelight-components", Exclude<NuxtConfig["rimelightComponents"], boolean>] | ["@nuxt/icon", Exclude<NuxtConfig["icon"], boolean>] | ["@nuxt/fonts", Exclude<NuxtConfig["fonts"], boolean>] | ["@nuxtjs/color-mode", Exclude<NuxtConfig["colorMode"], boolean>] | ["@nuxt/ui", Exclude<NuxtConfig["ui"], boolean>] | ["@nuxtjs/device", Exclude<NuxtConfig["device"], boolean>] | ["@nuxtjs/i18n", Exclude<NuxtConfig["i18n"], boolean>] | ["@vueuse/nuxt", Exclude<NuxtConfig["vueuse"], boolean>] | ["@pinia/nuxt", Exclude<NuxtConfig["pinia"], boolean>] | ["@pinia/colada-nuxt", Exclude<NuxtConfig["colada"], boolean>] | ["C:/Users/idant/WebstormProjects/idantity.me/node_modules/nuxt-site-config/dist/module.mjs", Exclude<NuxtConfig["site"], boolean>] | ["@nuxtjs/sitemap", Exclude<NuxtConfig["sitemap"], boolean>] | ["@nuxtjs/robots", Exclude<NuxtConfig["robots"], boolean>] | ["nuxt-og-image", Exclude<NuxtConfig["ogImage"], boolean>] | ["@nuxt/devtools", Exclude<NuxtConfig["devtools"], boolean>] | ["@nuxt/telemetry", Exclude<NuxtConfig["telemetry"], boolean>] | ["@dxup/nuxt", Exclude<NuxtConfig["dxup"], boolean>] | ["@nuxt/image", Exclude<NuxtConfig["image"], boolean>])[],
  }
}
declare module 'nuxt/schema' {
  interface ModuleDependencies {
    ["rimelight-components"]?: ModuleDependencyMeta<typeof import("rimelight-components").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxt/icon"]?: ModuleDependencyMeta<typeof import("@nuxt/icon").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxt/fonts"]?: ModuleDependencyMeta<typeof import("@nuxt/fonts").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxtjs/color-mode"]?: ModuleDependencyMeta<typeof import("@nuxtjs/color-mode").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxt/ui"]?: ModuleDependencyMeta<typeof import("@nuxt/ui").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxtjs/device"]?: ModuleDependencyMeta<typeof import("@nuxtjs/device").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxtjs/i18n"]?: ModuleDependencyMeta<typeof import("@nuxtjs/i18n").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@vueuse/nuxt"]?: ModuleDependencyMeta<typeof import("@vueuse/nuxt").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@pinia/nuxt"]?: ModuleDependencyMeta<typeof import("@pinia/nuxt").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@pinia/colada-nuxt"]?: ModuleDependencyMeta<typeof import("@pinia/colada-nuxt").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["nuxt-site-config"]?: ModuleDependencyMeta<typeof import("nuxt-site-config").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxtjs/sitemap"]?: ModuleDependencyMeta<typeof import("@nuxtjs/sitemap").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxtjs/robots"]?: ModuleDependencyMeta<typeof import("@nuxtjs/robots").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["nuxt-og-image"]?: ModuleDependencyMeta<typeof import("nuxt-og-image").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxt/devtools"]?: ModuleDependencyMeta<typeof import("@nuxt/devtools").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxt/telemetry"]?: ModuleDependencyMeta<typeof import("@nuxt/telemetry").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@dxup/nuxt"]?: ModuleDependencyMeta<typeof import("@dxup/nuxt").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxt/image"]?: ModuleDependencyMeta<typeof import("@nuxt/image").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
  }
  interface NuxtOptions {
    /**
     * Configuration for `rimelight-components`
     * @see https://rimelight.com/tools/rimelight-components
     */
    ["rimelightComponents"]: typeof import("rimelight-components").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/icon`
     * @see https://www.npmjs.com/package/@nuxt/icon
     */
    ["icon"]: typeof import("@nuxt/icon").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/fonts`
     * @see https://www.npmjs.com/package/@nuxt/fonts
     */
    ["fonts"]: typeof import("@nuxt/fonts").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxtjs/color-mode`
     * @see https://www.npmjs.com/package/@nuxtjs/color-mode
     */
    ["colorMode"]: typeof import("@nuxtjs/color-mode").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/ui`
     * @see https://ui.nuxt.com/docs/getting-started/installation/nuxt
     */
    ["ui"]: typeof import("@nuxt/ui").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxtjs/device`
     * @see https://www.npmjs.com/package/@nuxtjs/device
     */
    ["device"]: typeof import("@nuxtjs/device").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxtjs/i18n`
     * @see https://www.npmjs.com/package/@nuxtjs/i18n
     */
    ["i18n"]: typeof import("@nuxtjs/i18n").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@vueuse/nuxt`
     * @see https://www.npmjs.com/package/@vueuse/nuxt
     */
    ["vueuse"]: typeof import("@vueuse/nuxt").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@pinia/nuxt`
     * @see https://www.npmjs.com/package/@pinia/nuxt
     */
    ["pinia"]: typeof import("@pinia/nuxt").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@pinia/colada-nuxt`
     * @see https://www.npmjs.com/package/@pinia/colada-nuxt
     */
    ["colada"]: typeof import("@pinia/colada-nuxt").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `nuxt-site-config`
     */
    ["site"]: typeof import("nuxt-site-config").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxtjs/sitemap`
     * @see https://www.npmjs.com/package/@nuxtjs/sitemap
     */
    ["sitemap"]: typeof import("@nuxtjs/sitemap").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxtjs/robots`
     * @see https://www.npmjs.com/package/@nuxtjs/robots
     */
    ["robots"]: typeof import("@nuxtjs/robots").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `nuxt-og-image`
     * @see https://www.npmjs.com/package/nuxt-og-image
     */
    ["ogImage"]: typeof import("nuxt-og-image").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/devtools`
     * @see https://www.npmjs.com/package/@nuxt/devtools
     */
    ["devtools"]: typeof import("@nuxt/devtools").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/telemetry`
     * @see https://www.npmjs.com/package/@nuxt/telemetry
     */
    ["telemetry"]: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@dxup/nuxt`
     * @see https://www.npmjs.com/package/@dxup/nuxt
     */
    ["dxup"]: typeof import("@dxup/nuxt").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/image`
     * @see https://www.npmjs.com/package/@nuxt/image
     */
    ["image"]: typeof import("@nuxt/image").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
  }
  interface NuxtConfig {
    /**
     * Configuration for `rimelight-components`
     * @see https://rimelight.com/tools/rimelight-components
     */
    ["rimelightComponents"]?: typeof import("rimelight-components").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/icon`
     * @see https://www.npmjs.com/package/@nuxt/icon
     */
    ["icon"]?: typeof import("@nuxt/icon").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/fonts`
     * @see https://www.npmjs.com/package/@nuxt/fonts
     */
    ["fonts"]?: typeof import("@nuxt/fonts").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxtjs/color-mode`
     * @see https://www.npmjs.com/package/@nuxtjs/color-mode
     */
    ["colorMode"]?: typeof import("@nuxtjs/color-mode").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/ui`
     * @see https://ui.nuxt.com/docs/getting-started/installation/nuxt
     */
    ["ui"]?: typeof import("@nuxt/ui").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxtjs/device`
     * @see https://www.npmjs.com/package/@nuxtjs/device
     */
    ["device"]?: typeof import("@nuxtjs/device").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxtjs/i18n`
     * @see https://www.npmjs.com/package/@nuxtjs/i18n
     */
    ["i18n"]?: typeof import("@nuxtjs/i18n").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@vueuse/nuxt`
     * @see https://www.npmjs.com/package/@vueuse/nuxt
     */
    ["vueuse"]?: typeof import("@vueuse/nuxt").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@pinia/nuxt`
     * @see https://www.npmjs.com/package/@pinia/nuxt
     */
    ["pinia"]?: typeof import("@pinia/nuxt").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@pinia/colada-nuxt`
     * @see https://www.npmjs.com/package/@pinia/colada-nuxt
     */
    ["colada"]?: typeof import("@pinia/colada-nuxt").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `nuxt-site-config`
     */
    ["site"]?: typeof import("nuxt-site-config").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxtjs/sitemap`
     * @see https://www.npmjs.com/package/@nuxtjs/sitemap
     */
    ["sitemap"]?: typeof import("@nuxtjs/sitemap").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxtjs/robots`
     * @see https://www.npmjs.com/package/@nuxtjs/robots
     */
    ["robots"]?: typeof import("@nuxtjs/robots").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `nuxt-og-image`
     * @see https://www.npmjs.com/package/nuxt-og-image
     */
    ["ogImage"]?: typeof import("nuxt-og-image").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/devtools`
     * @see https://www.npmjs.com/package/@nuxt/devtools
     */
    ["devtools"]?: typeof import("@nuxt/devtools").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/telemetry`
     * @see https://www.npmjs.com/package/@nuxt/telemetry
     */
    ["telemetry"]?: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@dxup/nuxt`
     * @see https://www.npmjs.com/package/@dxup/nuxt
     */
    ["dxup"]?: typeof import("@dxup/nuxt").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/image`
     * @see https://www.npmjs.com/package/@nuxt/image
     */
    ["image"]?: typeof import("@nuxt/image").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    modules?: (undefined | null | false | NuxtModule<any> | string | [NuxtModule | string, Record<string, any>] | ["rimelight-components", Exclude<NuxtConfig["rimelightComponents"], boolean>] | ["@nuxt/icon", Exclude<NuxtConfig["icon"], boolean>] | ["@nuxt/fonts", Exclude<NuxtConfig["fonts"], boolean>] | ["@nuxtjs/color-mode", Exclude<NuxtConfig["colorMode"], boolean>] | ["@nuxt/ui", Exclude<NuxtConfig["ui"], boolean>] | ["@nuxtjs/device", Exclude<NuxtConfig["device"], boolean>] | ["@nuxtjs/i18n", Exclude<NuxtConfig["i18n"], boolean>] | ["@vueuse/nuxt", Exclude<NuxtConfig["vueuse"], boolean>] | ["@pinia/nuxt", Exclude<NuxtConfig["pinia"], boolean>] | ["@pinia/colada-nuxt", Exclude<NuxtConfig["colada"], boolean>] | ["C:/Users/idant/WebstormProjects/idantity.me/node_modules/nuxt-site-config/dist/module.mjs", Exclude<NuxtConfig["site"], boolean>] | ["@nuxtjs/sitemap", Exclude<NuxtConfig["sitemap"], boolean>] | ["@nuxtjs/robots", Exclude<NuxtConfig["robots"], boolean>] | ["nuxt-og-image", Exclude<NuxtConfig["ogImage"], boolean>] | ["@nuxt/devtools", Exclude<NuxtConfig["devtools"], boolean>] | ["@nuxt/telemetry", Exclude<NuxtConfig["telemetry"], boolean>] | ["@dxup/nuxt", Exclude<NuxtConfig["dxup"], boolean>] | ["@nuxt/image", Exclude<NuxtConfig["image"], boolean>])[],
  }
}