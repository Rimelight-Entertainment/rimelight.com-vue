export default defineNuxtRouteMiddleware(async (to, _from) => {
  // 1. Skip early for health checks or static files if needed, and auth-related routes
  if (to.path === "/construction" || to.path.startsWith("/auth") || (to.path.startsWith("/api") && !to.path.startsWith("/api/auth"))) {
    return;
  }

  const { session, status, promise } = useAuth();

  // 2. Wait for auth to initialize (SSR safe)
  if (status.value === "pending" && promise) {
    try {
      await promise;
    } catch (e) {
      console.error("[Construction Middleware] Auth session wait failed:", e);
    }
  }

  // 3. User is not authenticated, redirect to construction
  if (!session.value) {
    if (to.path !== "/construction") {
       return navigateTo({
         path: "/construction",
         query: { redirect: to.fullPath },
       });
    }
  }
});
