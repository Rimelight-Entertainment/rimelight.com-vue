import { getAuthClient } from "../../auth/auth-client";

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig();
  const authClient = getAuthClient(config.public.apiBase);

  nuxtApp.provide("authClient", authClient);

  if (import.meta.server) {
    try {
      // @ts-ignore
      const { auth } = await import("../../auth/auth");
      nuxtApp.provide("auth", auth);
    } catch (e) {
      console.error("[RL Auth Plugin] Failed to load server auth:", e);
    }
  }
});
