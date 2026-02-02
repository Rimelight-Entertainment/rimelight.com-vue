import { auth } from "../../auth/auth"

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers
  })

  // Logic: If user is logged in but has no active organization, set it.
  if (session?.session && !session.session.activeOrganizationId) {
    await auth.api.setActiveOrganization({
      headers: event.headers,
      body: {
        organizationId: "019c1b1d-d078-715e-bf1b-17376daab0ae"
      }
    })
  }
})
