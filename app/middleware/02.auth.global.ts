export default defineNuxtRouteMiddleware(async (to, _from) => {
  const { session, status, promise } = useAuth();

  // 1. Wait for auth to initialize (SSR safe)
  if (status.value === "pending" && promise) {
    try {
      await promise;
    } catch (e) {
      // Ignored
    }
  }

  // 2. Auth Page Redirection
  // If authenticated, don't allow access to sign-in or construction pages
  if (session.value) {
    if (to.path === "/auth/sign-in" || to.path === "/auth/sign-up" || to.path === "/construction") {
      return navigateTo("/");
    }
  }

  // 3. Protected Route Guarding
  const protectedRoutes = ["/dashboard", "/settings", "/admin"];
  const isProtected = protectedRoutes.some((route) => to.path.startsWith(route));

  if (isProtected && !session.value) {
    return navigateTo("/construction");
  }
});
