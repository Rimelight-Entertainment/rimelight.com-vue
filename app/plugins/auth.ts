import { getAuthClient } from "../../auth/auth-client";

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig();

  // Provide the auth client (server returns the built-in stub, client returns the real one)
  nuxtApp.provide("authClient", getAuthClient(config.public.apiBase));

  if (import.meta.server) {
    try {
      // Use standard dynamic import for ESM compatibility (Cloudflare friendly)
      const { auth } = await import("../../auth/auth");
      nuxtApp.provide("auth", auth);
    } catch (e) {
      console.error("[RL Auth Plugin] SSR Auth Load Error:", e);
    }
  }
});
