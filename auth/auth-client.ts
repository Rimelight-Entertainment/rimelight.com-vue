import { createAuthClient } from "better-auth/vue";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { adminClient, organizationClient } from "better-auth/client/plugins";
import type { AccessControl } from "better-auth/plugins/access";
import { statement } from "rimelight-components/auth/statements";
import { ac, owner, admin, member, user } from "rimelight-components/auth/permissions";

let _authClient: any = null;

/**
 * A safe, no-op auth client for server-side rendering.
 * Prevents "null" member access while ensuring no reactive hooks are called.
 */
const stubClient = {
  getSession: async () => ({ data: null, error: null }),
  organization: {
     checkRolePermission: () => false
  }
} as any;

export const getAuthClient = (baseURL?: string) => {
  if (import.meta.server) return stubClient;
  
  if (!_authClient) {
    _authClient = createAuthClient({
      baseURL,
      plugins: [
        inferAdditionalFields<any>(),
        adminClient(),
        organizationClient({
          ac: ac as AccessControl<typeof statement>,
          roles: { owner, admin, member, user },
          teams: { enabled: true },
        }),
      ],
    });
  }
  return _authClient;
};

// Deprecated export, but kept for compatibility as a direct link to the client if available
export const authClient = import.meta.client ? _authClient : stubClient;

export type ClientSession = any;
