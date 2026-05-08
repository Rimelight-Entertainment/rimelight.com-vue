import type { PageType, PageDefinition } from "./index";

declare module "@nuxt/schema" {
  interface LogoConfig {
    light?: string;
    dark?: string;
    [key: string]: any;
  }

  interface RimelightComponentsConfig {
    pageDefinitions?: Partial<Record<PageType, PageDefinition>>;
    logos?: {
      mark?: string | LogoConfig;
      type?: string | LogoConfig;
      classic?: string | LogoConfig;
      symbol?: string | LogoConfig;
      [key: string]: any;
    };
    [key: string]: any;
  }

  interface AppConfig {
    rimelightComponents?: RimelightComponentsConfig;
  }
}

declare module "nuxt/schema" {
  interface AppConfig {
    rimelightComponents?: import("@nuxt/schema").RimelightComponentsConfig;
  }
}

export {};
