import { authClient } from "../../auth/auth-client"

export default defineNuxtPlugin(async (nuxtApp) => {
  // Provide the auth client
  nuxtApp.provide("authClient", authClient)

  if (import.meta.server) {
    try {
      // Standard dynamic import for the server-side auth instance
      const { auth } = await import("../../auth/auth")
      nuxtApp.provide("auth", auth)
    } catch (e) {
      console.error("[RL Auth Plugin] SSR Auth Load Error:", e)
    }
  }
})
