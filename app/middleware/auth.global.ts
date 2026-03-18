export default defineNuxtRouteMiddleware(async (to, _from) => {
  // 1. Static skip for high-performance early exit
  const skipPaths = ["/construction", "/auth", "/api/auth"]
  if (skipPaths.some((p) => to.path.startsWith(p))) return

  const { session, status, promise } = useAuth()

  // 2. Wait for session if pending (SSR safe via useAsyncData)
  if (status.value === "pending" && promise) {
    try {
      // Nuxt 3/4 useAsyncData results are awaitable
      await promise
    } catch (e) {
      if (import.meta.server) {
        console.error("[SSR Auth Middleware] Session fetch crash:", e)
      }
    }
  }

  // 3. Authenticated logic
  if (session.value) {
    // Don't allow access to construction/sign-in if already logged in
    if (to.path === "/construction" || to.path === "/auth/sign-in") {
      return navigateTo("/")
    }
    return
  }

  // 4. Unauthenticated logic
  // Enforce construction page site-wide for public users
  return navigateTo({
    path: "/construction",
    query: { redirect: to.fullPath }
  })
})
