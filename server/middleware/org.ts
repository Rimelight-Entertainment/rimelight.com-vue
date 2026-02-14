import { auth } from "~~/auth";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  });

  // Logic: If user is logged in but has no active organization, set it.
  if (session?.session && !session.session.activeOrganizationId) {
    await auth.api.setActiveOrganization({
      headers: event.headers,
      body: {
        organizationId: "019c1f72-edbc-74dc-8e8d-2d13984e4f9b",
      },
    });
  }
});
