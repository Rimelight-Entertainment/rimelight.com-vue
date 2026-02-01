import { createAuthClient } from "better-auth/vue"
import { inferAdditionalFields } from "better-auth/client/plugins"
import { adminClient, organizationClient } from "better-auth/client/plugins"
import type { auth } from "./auth"
import { ac, owner, admin, member, user } from "./permissions"

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient(),
    organizationClient({
      ac,
      roles: {
        owner,
        admin,
        member,
        user
      },
      teams: {
        enabled: true
      }
    })
  ]
})

export type ClientSession = typeof authClient.$Infer.Session
