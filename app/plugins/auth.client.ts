import { getAuthClient } from "../../auth/auth-client";

/**
 * Client-only auth plugin.
 * Initializes the Better Auth Vue client — NEVER runs on the server.
 * better-auth/vue is only imported and evaluated in the browser.
 */
export default defineNuxtPlugin({
  name: "better-auth-client",
  enforce: "pre",
  setup(nuxtApp) {
    const config = useRuntimeConfig();
    const authClient = getAuthClient(config.public.apiBase);
    nuxtApp.provide("authClient", authClient);
  },
});
