/**
 * Server-only auth plugin.
 * Provides the Better Auth server instance ($auth) for SSR session fetching.
 * The auth client (better-auth/vue) is NEVER imported here — client only.
 */
export default defineNuxtPlugin({
  name: "better-auth-server",
  enforce: "pre",
  async setup(nuxtApp) {
    // Provide a no-op stub so useAuth never receives undefined $authClient on SSR
    nuxtApp.provide("authClient", {
      getSession: async () => ({ data: null, error: null }),
      organization: { checkRolePermission: () => false },
    });

    try {
      const { auth } = await import("../../auth/auth");
      nuxtApp.provide("auth", auth);
    } catch (e) {
      console.error("[RL Auth Server Plugin] Failed to load server auth:", e);
    }
  },
});
