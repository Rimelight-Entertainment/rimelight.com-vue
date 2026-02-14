import type { RouterConfig } from "@nuxt/schema";

/*
 * Filters out 'partials' directories within the Pages directory,
 * allowing for co-located page-specific components.
 */
export default <RouterConfig>{
  routes: (_routes) => {
    if (import.meta.env.MODE === "production") {
      _routes = _routes.filter((route) => !route.path.includes("partials"));
    }
    return _routes;
  },
};
