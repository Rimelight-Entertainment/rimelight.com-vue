import { createAuthClient } from "better-auth/vue"
import { inferAdditionalFields } from "better-auth/client/plugins"
import { adminClient, organizationClient } from "better-auth/client/plugins"
import type { AccessControl } from "better-auth/plugins/access"
import type { auth } from "./auth"
import { createAccessControl } from "better-auth/plugins/access"
import { statement, owner, admin, member, user } from "rimelight-components/auth"

const ac = createAccessControl(statement)

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient(),
    organizationClient({
      ac: ac as AccessControl<typeof statement>,
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
