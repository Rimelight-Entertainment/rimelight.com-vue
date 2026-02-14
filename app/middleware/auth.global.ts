export default defineNuxtRouteMiddleware(async (to, _from) => {
  const { session, status } = useAuth();

  if (status.value === 'pending') {
    await new Promise<void>((resolve) => {
      const stop = watch(status, (val) => {
        if (val !== 'pending') {
          stop();
          resolve();
        }
      });
    });
  }

  // Guard against empty auth base route.
  if (to.path === "/auth") {
    return navigateTo("/auth/sign-in");
  }

  // User is not authenticated
  if (!session.value) {
    if (to.path === "/dashboard") {
      return navigateTo("/auth/sign-in");
    }
    if (to.path === "/blog/drafts") {
      return navigateTo("/auth/sign-in");
    }
  }

  // User is authenticated
  if (session.value) {
    if (to.path === "/auth/sign-in" || to.path === "/auth/sign-up") {
      return navigateTo("/");
    }
  }
});
