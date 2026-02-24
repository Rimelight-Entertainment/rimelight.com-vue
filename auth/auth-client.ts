import { createAuthClient } from "better-auth/vue";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { adminClient, organizationClient } from "better-auth/client/plugins";
import type { AccessControl } from "better-auth/plugins/access";
import { statement } from "rimelight-components/auth/statements";
import { ac, owner, admin, member, user } from "rimelight-components/auth/permissions";

// We don't initialize the client here to avoid SSR issues with top-level Vue hook calls.
// Instead, we export a factory or initialize it on demand.

let _authClient: ReturnType<typeof createAuthClient> | null = null;

export const getAuthClient = (baseURL?: string) => {
  if (!_authClient) {
    _authClient = createAuthClient({
      baseURL,
      plugins: [
        inferAdditionalFields<any>(), // Use any here to avoid circular dependency with server-side auth type if needed, or pass correctly
        adminClient(),
        organizationClient({
          ac: ac as AccessControl<typeof statement>,
          roles: {
            owner,
            admin,
            member,
            user,
          },
          teams: {
            enabled: true,
          },
        }),
      ],
    });
  }
  return _authClient;
};

// For backward compatibility while we refactor, but it's discouraged to use this directly on SSR
export const authClient = getAuthClient();

export type ClientSession = typeof authClient.$Infer.Session;
